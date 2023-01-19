package com.cloudwise.lcap.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.base.PageResult;
import com.cloudwise.lcap.commonbase.dto.DataTableDto;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.entity.DataTable;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.datasource.execute.QueryExecute;
import com.cloudwise.lcap.datasource.model.ExecuteBean;
import com.cloudwise.lcap.datasource.model.HttpEnumerable;
import com.cloudwise.lcap.datasource.model.SqlQueryReq;
import com.cloudwise.lcap.datasource.query.JDBCQueryProxy;
import com.cloudwise.lcap.datasource.query.util.HttpQueryUtil;
import com.cloudwise.lcap.helper.DataQueryHelper;
import com.cloudwise.lcap.service.IDataSourceService;
import com.cloudwise.lcap.service.IDataTableService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;

/**
 * 表的动态修改、新增和删除只支持http、redis、mongo
 */
@Slf4j
@RestController
@RequestMapping("/datatable")
public class DataTableController {

    @Autowired
    private IDataSourceService dataSourceService;
    @Autowired
    private IDataTableService dataTableService;
    @Value("${db_bathpath}")
    private String dbBathPath;

    @Autowired
    private QueryExecute queryExecute;

    @Value("${datasource.maxconnect}")
    private int maxConnect;

    /**
     * 条件查询数据源下的表列表
     * 对于http、redis、mongo数据源，直接从 datatable 查询
     * 对于jdbc类数据源，直接从数据库引擎查
     */
    @GetMapping
    public List<DataTableDto> findTablesWithSchema1(@RequestParam String datasourceId, @RequestParam(required = false) String tableName) {
        DataSource dataSource = dataSourceService.findByDatasourceId(datasourceId);
        if (null == dataSource) {
            log.error("参数错误,数据源不存在");
            throw new ParameterException("参数错误,数据源不存在");
        }
        String schemaType = dataSource.getSchemaType();
        String datasourceName = dataSource.getDatasourceName();
        String schemaName = dataSource.getSchemaName();
        switch (schemaType.toLowerCase()) {
            case MYSQL:
            case POSTGRES:
            case SQL_SERVER:
            case ORACLE:
            case DAMENG:
            case MARIA:
            case CLICKHOUSE:
                return JDBCQueryProxy.getTableList(dataSource, maxConnect, schemaType);
            case HTTP:
                List<DataTableDto> returnData = new ArrayList<>();
                List<DataTable> tables = dataTableService.getTables(datasourceId);
                if (CollectionUtil.isNotEmpty(tables)) {
                    returnData = tables.stream().map(o -> DataTableDto.builder().tableId(o.getId()).tableName(o.getName()).datasourceId(datasourceId).modelName(schemaName).datasourceName(datasourceName).schemaName(schemaName).schemaType(schemaType).build()).collect(Collectors.toList());
                    if (StringUtils.isNotEmpty(tableName)) {
                        returnData = returnData.stream().filter(tableDto -> tableDto.getTableName().contains(tableName)).collect(Collectors.toList());
                    }
                }
                return returnData;
            default:
                break;
        }
        return new ArrayList<>();
    }

    /**
     * 查看某一个表的元数据和样例数据
     */
    @GetMapping("/tableMeta")
    public DataTableDto findWithExampleData(@RequestParam String schemaName, @RequestParam String tableName, @RequestParam String datasourceId) {

        return dataSourceService.queryTableMeta(datasourceId, tableName, schemaName);

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
        DataSource config = dataSourceService.findByDatasourceId(datasourceId);
        String schemaName = config.getSchemaName();
        dataTableService.deleteTable(datasourceId, tableId);

    }

    /**
     * 执行http查询
     *
     * @param params
     * @return
     */
    @PostMapping("/query")
    public Object httpQuery(@RequestBody ExecuteBean params) {
        //发起http请求
        JSONObject connectData = params.getConnectData();
        String url = connectData.getStr("url");
        String method = connectData.getStr("method");
        String requestBody = connectData.getStr("requestBody");
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
        HttpEnumerable enumerable = HttpEnumerable.builder()
                .url(url).method(method).params(param1).header(header1).requestBody(requestBody).build();

        Map<String, Object> extraHeader = new HashMap<>();
        extraHeader.forEach(enumerable.getHeader()::putIfAbsent);
        return HttpQueryUtil.request(enumerable);
    }


    /**
     * 测试sql查询，返回限制内的数据量
     *
     * @return
     */
    @PostMapping("/sqlquery")
    public PageResult<Map<String, Object>> sqlquery(@RequestBody SqlQueryReq sqlQueryReq) {
        String datasourceId = sqlQueryReq.getDatasourceId();
        DataSource dataSource = dataSourceService.findByDatasourceId(datasourceId);
        if (null == dataSource) {
            log.error("参数错误,数据源不存在");
            throw new ParameterException("参数错误,数据源不存在");
        }
        ExecuteBean params = new ExecuteBean();
        params.setSchemaName(dataSource.getSchemaName());
        String schemaType = dataSource.getSchemaType();
        params.setSchemaType(schemaType);
        if (StringUtils.isNotBlank(dataSource.getConnectData())) {
            params.setConnectData(new JSONObject(dataSource.getConnectData()));
        }
        //发起sql查询
        params.setTaskId(Snowflake.INSTANCE.nextId());
        params.setTables(dataTableService.getTables(datasourceId));
        Long accountId = ThreadLocalContext.getAccountId();
        String directory = dbBathPath + separator + accountId + separator + dataSource.getSchemaName();
        params.setDirectory(directory);

        //替换sql参数
        String sql = DataQueryHelper.getSqlBySearchParam(DataQuery.builder().sql(sqlQueryReq.getSql()).queryName("不会和参数前缀重复即可").build(),
                sqlQueryReq.getParams(), false);
        Integer pageNo = sqlQueryReq.getPageNo();
        Integer pageSize = sqlQueryReq.getPageSize();
        int startLimit = (pageNo - 1) * pageSize;
        params.setSql(sql);
        params.setPageNo(pageNo);
        params.setPageSize(pageSize);

        String dataSql = sql;
        if (!sql.contains("limit") && !sql.contains("LIMIT")) {
            if (HTTP.equalsIgnoreCase(params.getSchemaType())
                    || SQL_SERVER.equalsIgnoreCase(params.getSchemaType())
                    || ORACLE.equalsIgnoreCase(params.getSchemaType())) {
                dataSql = sql;
            } else {
                dataSql = String.format(sql + " limit " + DATA_TOTAL);
            }
        }
        params.setSql(dataSql);
        List<Map<String, Object>> data = queryExecute.execute(params);
        int total = data.size();
        if (total > DATA_TOTAL) {
            total = DATA_TOTAL;
        }
        List<Map<String, Object>> subData = new LinkedList<>();
        if (startLimit < total) {
            int pageCount = pageNo * pageSize;
            if (pageCount > total) {
                pageCount = total;
            }
            subData = data.subList(startLimit, pageCount);
        }
        return new PageResult<>(Long.valueOf(pageNo), Long.valueOf(pageSize), (long) total, subData);
    }


}
