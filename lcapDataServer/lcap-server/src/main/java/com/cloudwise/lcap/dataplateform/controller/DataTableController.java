package com.cloudwise.lcap.dataplateform.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.PageResult;
import com.cloudwise.lcap.common.contants.Constant;
import com.cloudwise.lcap.common.exception.ParameterException;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.common.utils.SnowFlakeUtil;
import com.cloudwise.lcap.dataplateform.core.calcite.http.HttpEnumerable;
import com.cloudwise.lcap.dataplateform.core.calcite.http.HttpQueryUtil;
import com.cloudwise.lcap.dataplateform.core.execute.DataSourceUtils;
import com.cloudwise.lcap.dataplateform.core.execute.QueryExecute;
import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;
import com.cloudwise.lcap.dataplateform.dao.DataSourceDao;
import com.cloudwise.lcap.dataplateform.dto.DataTableDto;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.service.DataTableService;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.linq4j.Linq4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 表的动态修改、新增和删除只支持http、redis、mongo
 */
@Slf4j
@RestController
@RequestMapping("/datatable")
public class DataTableController {

    private DataSourceDao dataSourceDao;
    private DataTableService dataTableService;
    private static final Long maxScanTotal = 1000L;
    @Value("${db_bathpath}")
    private String dbBathPath;

    public DataTableController(DataSourceDao dataSourceDao, DataTableService dataTableService) {
        this.dataSourceDao = dataSourceDao;
        this.dataTableService = dataTableService;
    }

    /**
     * 条件查询数据源下的表列表
     * 对于http、redis、mongo数据源，直接从 datatable 查询
     * 对于jdbc类数据源，直接从数据库引擎查
     */
    @GetMapping
    public List<DataTableDto> findTablesWithSchema1(@RequestParam String datasourceId, @RequestParam(required = false) String tableName) {
        DataSourceConfig config = dataSourceDao.findByDatasourceId(datasourceId);
        if (null == config) {
            log.error("参数错误,数据源不存在");
            throw new ParameterException("参数错误,数据源不存在");
        }
        return DataSourceUtils.queryTableBasicInfoList(config, tableName);
    }

    /**
     * 查看某一个表的元数据和样例数据
     */
    @GetMapping("/tableMeta")
    public DataTableDto findWithExampleData(@RequestParam String schemaType, @RequestParam String schemaName, @RequestParam String tableName,@RequestParam String datasourceId) {
        DataSourceConfig config = dataSourceDao.findByDatasourceId(datasourceId);
        if (null == config) {
            log.error("参数错误，数据源 " + schemaName + "不存在");
            throw new ParameterException("参数错误，数据源 " + schemaName + "不存在");
        }
        return DataSourceUtils.queryTableMeta(config, tableName);
    }

    /**
     * 新增表
     * 现在只有http redis mongo 下可以新增数据表
     */
    @PostMapping
    public DataTableDto addTable(@RequestBody DataTableDto dto) {
        return dataTableService.addTable(dto);
    }

    /**
     * 修改表
     */
    @PostMapping("/update")
    public void update(@RequestBody DataTableDto dto) {
        dataTableService.update(dto);
    }


    /**
     * 删除表
     */
    @PostMapping("/delete")
    public void deleteById(@RequestBody DataTableDto dto) {
        String tableId = dto.getTableId();
        String datasourceId = dto.getDatasourceId();
        dataSourceDao.deleteTableByTableId(tableId, datasourceId);

    }

    /**
     * 执行http查询
     *
     * @param params
     * @return
     */
    @PostMapping("/query")
    public Object query(@RequestBody ExecuteBean params) {
        //发起http请求
        JSONObject connectData = params.getConnectData();
        String url = connectData.getStr("url");
        String method = connectData.getStr("method");
        String requestBody = connectData.getStr("requestBody");
        List<JSONObject> fields = connectData.getBeanList("fields", JSONObject.class);
        List<JSONObject> paramList = JsonUtils.parseArray(connectData.getStr("params"), JSONObject.class);
        Map<String, Object> param1 = new HashMap<>();
        if (CollectionUtil.isNotEmpty(paramList)) {
            param1 = paramList.stream().collect(Collectors.toMap(o -> o.getStr("name"), o -> o.get("default")));
        }

        List<JSONObject> header = JsonUtils.parseArray(connectData.getStr("header"), JSONObject.class);
        Map<String, Object> header1 = new HashMap<>();
        if (CollectionUtil.isNotEmpty(header)) {
            header1 = header.stream().collect(Collectors.toMap(o -> o.getStr("name"), o -> o.get("default")));
        }
//        HttpRequestDTO enumerable = HttpRequestDTO.builder()
//                .path(url).method(method).reqHeaders(param1).reqHeaders(header1).reqBody(requestBody).build();
        HttpEnumerable enumerable = HttpEnumerable.builder()
                .url(url).method(method).params(param1).header(header1).requestBody(requestBody).build();
        Object data = HttpQueryUtil.request(enumerable);
        if (CollectionUtil.isNotEmpty(fields)) {
            List<Map<String, Object>> fields1 = new ArrayList<>();
            for (JSONObject field : fields) {
                HashMap<String, Object> objectObjectHashMap = new HashMap<>();
                objectObjectHashMap.putAll(field);
                fields1.add(objectObjectHashMap);
            }
            data = Linq4j.enumerator(HttpEnumerable.buildResponseData(data, fields1));
        }
        return data;
    }


    /**
     * 测试sql查询，返回限制内的数据量
     *
     * @param params
     * @return
     */
    @PostMapping("/sqlquery")
    public PageResult sqlquery(@RequestBody ExecuteBean params) {
        String datasourceId = params.getDatasourceId();
        DataSourceConfig config = dataSourceDao.findByDatasourceId(datasourceId);
        if (null == config) {
            log.error("参数错误,数据源不存在");
            throw new ParameterException("参数错误,数据源不存在");
        }
        params.setSchemaName(config.getSchemaName());
        params.setSchemaType(config.getSchemaType());
        if (StringUtils.isNotBlank(config.getConnectData())) {
            params.setConnectData(new JSONObject(config.getConnectData()));
        }
        //发起sql查询
        params.setTaskId(SnowFlakeUtil.getFlowIdInstance().nextId());
        params.setTables(config.getTables());

        String sql = params.getSql();
        if(Constant.ORACLE.equalsIgnoreCase(config.getSchemaType()) || Constant.SQLSERVER.equalsIgnoreCase(config.getSchemaType()) || Constant.POSTGRES.equalsIgnoreCase(config.getSchemaType())){
            sql = sql.replace("`","");
            String modelName = params.getConnectData().getStr("modelName");
            if(sql.contains(params.getSchemaName())){
                sql = sql.replace(params.getSchemaName(),modelName);
            }
        }
        if(Constant.DAMENG.equalsIgnoreCase(config.getSchemaType())){
            sql = sql.replace("`","");
        }
        String pageSql = "select count(1) as total from ( " + sql + ") t";
        Integer pageNo = params.getPageNo();
        Integer pageSize = params.getPageSize();
        params.setSql(pageSql);
        List<Map<String, Object>> count = QueryExecute.execute(params);
        long total = 0L;
        if (null != count.get(0) && count.get(0).containsKey("total")) {
            total = Long.valueOf(count.get(0).get("total").toString());
            if (total > maxScanTotal) {
                total = maxScanTotal;
            }
        }
        int startLimit = (pageNo - 1) * pageSize;
        int endLimit = pageNo*pageSize;
        String dataSql = "";
        if(Constant.ORACLE.equalsIgnoreCase(config.getSchemaType())){
            dataSql = String.format("select * from (select t.*, ROWNUM rn from ( " + sql + ") t where ROWNUM <= %s ) where rn > %s", endLimit,startLimit);
        }else if(Constant.POSTGRES.equalsIgnoreCase(config.getSchemaType())){
            dataSql = String.format("select * from ( " + sql + ") as t limit %s offset %s", pageSize,startLimit);
        }else if(Constant.SQLSERVER.equalsIgnoreCase(config.getSchemaType())){
            dataSql = String.format("select * from ( " + sql + ") as t order by 1 offset %s rows fetch next %s rows only ", startLimit,pageSize);
        } else{
            dataSql = String.format("select * from ( " + sql + ") as t limit %s,%s", startLimit,pageSize);
        }
        params.setSql(dataSql);

        List<Map<String, Object>> data = QueryExecute.execute(params);

        PageResult pageResult = new PageResult(pageNo, pageSize, total, data);
        return pageResult;
    }

}
