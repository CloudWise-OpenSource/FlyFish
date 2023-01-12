package com.cloudwise.lcap.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudwise.lcap.commonbase.base.PageResult;
import com.cloudwise.lcap.commonbase.dto.CombineQueryDto;
import com.cloudwise.lcap.commonbase.dto.DataQueryDto;
import com.cloudwise.lcap.dto.UnitSearchByParamDto;
import com.cloudwise.lcap.commonbase.entity.DataCombineQuery;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.entity.DataTable;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.CombineException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.exception.SqlExecException;
import com.cloudwise.lcap.commonbase.mapper.DataCombineQueryMapper;
import com.cloudwise.lcap.commonbase.mapper.DataQueryMapper;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.datasource.combine.CombineDataset;
import com.cloudwise.lcap.datasource.execute.QueryExecute;
import com.cloudwise.lcap.datasource.model.ExecuteBean;
import com.cloudwise.lcap.dto.DataQueryResponse;
import com.cloudwise.lcap.helper.DataQueryHelper;
import com.cloudwise.lcap.service.IDataCombineQueryService;
import com.cloudwise.lcap.service.IDataQueryService;
import com.cloudwise.lcap.service.IDataSourceService;
import com.cloudwise.lcap.service.IDataTableService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;
import static com.cloudwise.lcap.commonbase.enums.ResultCode.*;
import static com.cloudwise.lcap.commonbase.util.ValidatorUtils.validateLegalString;

/**
 * 可视化组件设置信息的增删改查
 *
 * @author yinqiqi
 */
@Slf4j
@RestController
@RequestMapping("/unit")
public class DataQueryController {

    @Value("${db_bathpath}")
    private String dbBathPath;

    @Autowired
    private IDataQueryService dataQueryService;
    @Autowired
    private IDataSourceService dataSourceService;
    @Autowired
    private IDataCombineQueryService dataCombineQueryService;
    @Autowired
    private IDataTableService dataTableService;
    @Resource
    private DataQueryMapper dataQueryMapper;
    @Resource
    private DataCombineQueryMapper combineQueryMapper;
    private int previewCount = 50;
    @Autowired
    private QueryExecute queryExecute;

    /**
     * 新增配置
     */
    @PostMapping
    public void addUnitSetting(@RequestBody DataQueryDto unitSetting) {
        String queryName = unitSetting.getQueryName();
        Integer queryType = unitSetting.getQueryType();
        String sql = unitSetting.getSql();
        String tableId = unitSetting.getTableId();
        String tableName = unitSetting.getTableName();
        JSONObject setting = unitSetting.getSetting();
        if (queryType.equals(SIMPLE) && StringUtils.isEmpty(sql)) {
            log.error("参数缺失:{}，sql必填", unitSetting);
            throw new ParameterException("参数缺失，sql必填");
        }
        if (StringUtils.isEmpty(tableId)) {
            unitSetting.setTableId(tableName);
        }
        if (!validateLegalString(queryName)) {
            log.error("数据源名称不符合规则,queryName:{}", queryName);
            log.error("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
            throw new ParameterException("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
        }
        if (null != dataQueryService.findByQueryName(queryName)) {
            log.error("同名数据查询已存在,queryName:{}", queryName);
            throw new ParameterException("同名数据查询已存在");
        }
        if (!SIMPLE.equals(queryType) && CollectionUtil.isEmpty(setting.getJSONArray("combineIds"))) {
            log.error("复合查询的查询子项不能为空");
            throw new BizException(COMBINE_QUERY_NO_SUB_QUERY);
        }
        String queryId = Snowflake.INSTANCE.nextId().toString();
        DataQuery build = DataQuery.builder().id(queryId).dataSourceId(unitSetting.getDatasourceId()).tableId(unitSetting.getTableId())
                .queryName(queryName).queryType(queryType).sql(sql).updater(ThreadLocalContext.getUserId()).build();
        if (null != setting) {
            build.setSetting(setting.toString());
        }
        if (queryType.equals(SIMPLE)) {
            DataQueryHelper.getSqlBySearchParam(build, null, true);
        } else {
            //处理关联表
            JSONArray combineIds = setting.getJSONArray("combineIds");
            //检验重复值
            Set<String> exist = new HashSet<>();
            for (Object combineIdObj : combineIds) {
                String combineId = combineIdObj.toString();
                if (exist.contains(combineId)) {
                    continue;
                }
                DataCombineQuery combineQuery = DataCombineQuery.builder().
                        combineQueryId(queryId).refQueryId(combineId).build();
                dataCombineQueryService.save(combineQuery);
                exist.add(combineId);
            }
        }
        dataQueryService.save(build);
    }

    @PostMapping("/update")
    public void update(@RequestBody DataQueryDto dto) {
        String queryName = dto.getQueryName();
        if (!validateLegalString(queryName)) {
            log.error("数据源名称不符合规则,queryName:{}", queryName);
            log.error("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
            throw new ParameterException("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
        }

        DataQuery query = dataQueryService.findByQueryName(queryName);
        if (null != query && !query.getId().equals(dto.getSettingId())) {
            log.error("同名数据查询已存在,queryName:{}", queryName);
            throw new ParameterException("同名数据查询已存在");
        }
        Integer queryType = dto.getQueryType();
        JSONObject setting = dto.getSetting();
        String settingId = dto.getSettingId();
        if (queryType.equals(SIMPLE)) {
            //校验参数占位符是否都设置参数
            DataQueryHelper.getSqlBySearchParam(
                    DataQuery.builder().
                            sql(dto.getSql()).
                            setting(JsonUtils.toJSONString(dto.getSetting())).
                            build(), null, true);
        } else {
            //处理关联表
            //获取所有现在关联
            List<DataCombineQuery> combineQueries = dataCombineQueryService.queryByCombineQueryId(settingId);
            //兼容历史错误数据
            Map<String, List<String>> existCombine = new HashMap<>();
            for (DataCombineQuery combineQuery : combineQueries) {
                List<String> strings = existCombine.get(combineQuery.getRefQueryId());
                if (strings == null) {
                    strings = new LinkedList<>();
                }
                strings.add(combineQuery.getId());
                existCombine.put(combineQuery.getRefQueryId(),strings);
            }
            JSONArray combineIds = setting.getJSONArray("combineIds");
            for (Object combineIdObj : combineIds) {
                String combineId = combineIdObj.toString();
                List<String> existIds = existCombine.get(combineId);
                if (existIds!=null) {
                    if (existIds.size() == 1) {
                        //依然存在的关联 从map中移除 不需要新增
                        existCombine.remove(combineId);
                    } else {
                        //当关联大于1个说明有历史脏数据，只保留一个其他的删除
                        List<String> strings = existIds.subList(1, existIds.size());
                        existCombine.put(combineId,strings);
                    }
                    continue;
                }
                DataCombineQuery combineQuery = DataCombineQuery.builder().
                        combineQueryId(settingId).refQueryId(combineId).build();
                dataCombineQueryService.save(combineQuery);
            }
            if (existCombine.size() > 0) {
                //依然存在的关联都被移除 剩下的都是需要删除的关联
                for (List<String> combineQueryIds : existCombine.values()) {
                    for (String combineQueryId : combineQueryIds) {
                        dataCombineQueryService.removeById(combineQueryId);
                    }
                }
            }
        }
        UpdateWrapper<DataQuery> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("id", settingId);
        updateWrapper.set("query_name", queryName);
        updateWrapper.set("setting", JsonUtils.toJSONString(setting));
        updateWrapper.set("`sql`", dto.getSql());
        updateWrapper.set("data_source_id", dto.getDatasourceId());
        updateWrapper.set("table_id", dto.getTableId());
        updateWrapper.set("updater", ThreadLocalContext.getUserId());
        dataQueryService.update(updateWrapper);
    }

    /**
     * 获取查询列表
     *
     * @param pageNo
     * @param pageSize
     * @param queryName
     * @param queryType
     * @param datasourceName
     * @return
     */
    @GetMapping("/findAll")
    public PageResult<DataQueryResponse> findAll(@RequestParam(required = false, defaultValue = "1") Long pageNo,
                                                 @RequestParam(required = false, defaultValue = "10") Long pageSize,
                                                 @RequestParam(required = false) String queryName,
                                                 @RequestParam(required = false) Integer queryType,
                                                 @RequestParam(required = false) String datasourceName) {
        if (!validateLegalString(queryName) || !validateLegalString(datasourceName)) {
            log.error("数据查询名称或者数据源名称不能包含特殊字符");
            return new PageResult<>(pageNo, pageSize, 0L, null);
        }

        List<DataQuery> dataQueries = new ArrayList<>();
        if (StringUtils.isNotBlank(datasourceName)) {
            List<DataSource> dataSources = dataSourceService.findByRegexDatasourceName(datasourceName);
            if(CollectionUtil.isEmpty(dataSources)){
                return new PageResult<>(pageNo, pageSize, 0L, new ArrayList<>());
            }
            Map<String, DataSource> dataSourceMap = dataSources.stream().collect(Collectors.toMap(DataSource::getDatasourceId, Function.identity()));
            dataQueries = dataQueryService.findByDataSourceIds(dataSourceMap.keySet());
            if(CollectionUtil.isEmpty(dataQueries)){
                return new PageResult<>(pageNo, pageSize, 0L, new ArrayList<>());
            }
        }

        Set<String> collect1 = dataQueries.stream().map(DataQuery::getId).collect(Collectors.toSet());
        List<DataCombineQuery> dataCombineQueries = dataCombineQueryService.queryByRefQueryIds(collect1);

        Set<String> dataQueryIds = new HashSet<>();
        dataQueryIds.addAll(collect1);
        dataQueryIds.addAll(dataCombineQueries.stream().map(DataCombineQuery::getCombineQueryId).collect(Collectors.toSet()));

        Page<DataQuery> withPage = dataQueryService.findWithPage(pageNo, pageSize, queryType, queryName, dataQueryIds);
        List<DataQuery> records = withPage.getRecords();

        //获取组合查询子查询的信息
        List<String> combineIds = records.stream().filter(t -> !t.getQueryType().equals(SIMPLE)).map(DataQuery::getId).collect(Collectors.toList());
        List<DataQuery> combineInfo = new LinkedList<>();
        if (CollectionUtil.isNotEmpty(combineIds)) {
            List<DataCombineQuery> combineQueries = dataCombineQueryService.queryByCombineQueryIds(combineIds);
            if (CollectionUtil.isNotEmpty(combineQueries)) {
                dataCombineQueries.addAll(combineQueries);
                //获取子查询的数据源信息
                List<DataQuery> byQueryIds = dataQueryService.findByQueryIds(combineQueries.stream().map(DataCombineQuery::getRefQueryId).collect(Collectors.toList()));
                combineInfo.addAll(byQueryIds);
            }
        }

        LambdaQueryWrapper<DataSource> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DataSource::getAccountId,ThreadLocalContext.getAccountId());
        List<DataSource> dataSources1 = dataSourceService.getBaseMapper().selectList(queryWrapper);
        Map<String, DataSource> dataSourceMap = dataSources1.stream().collect(Collectors.toMap(DataSource::getDatasourceId, o -> o));
        //翻译数据源名称
        List<DataQueryResponse> dataList = new ArrayList<>();
        Map<String, String> collect = records.stream().filter(t -> t.getQueryType().equals(SIMPLE)).collect(Collectors.toMap(DataQuery::getId, DataQuery::getDataSourceId));
        if (CollectionUtil.isNotEmpty(combineInfo)) {
            Map<String, String> combineInfoDataSourceMap = combineInfo.stream().collect(Collectors.toMap(DataQuery::getId, DataQuery::getDataSourceId));
            collect.putAll(combineInfoDataSourceMap);
        }
        for (DataQuery dataQuery : records) {
            DataQueryResponse transfer = DataQueryResponse.transfer(dataQuery);
            //翻译复合查询的数据源名称
            if (!SIMPLE.equals(dataQuery.getQueryType())) {
                Set<String> theDatasourceName = new HashSet<>();
                //该复合查询对应的简单查询的数据源信息
                List<String> refQueryIds = dataCombineQueries.stream().filter(t -> t.getCombineQueryId().equalsIgnoreCase(dataQuery.getId())).map(DataCombineQuery::getRefQueryId).collect(Collectors.toList());
                for (String queryId : refQueryIds) {
                    String dataSourceId = collect.get(queryId);
                    DataSource dataSource = dataSourceMap.get(dataSourceId);
                    if (null != dataSource) {
                        theDatasourceName.add(dataSource.getDatasourceName());
                        transfer.setSchemaName(dataSource.getSchemaName());
                        transfer.setSchemaType(dataSource.getSchemaType());
                    }
                }
                transfer.setDatasourceName(String.join(",", theDatasourceName));
            } else {
                DataSource dataSource = dataSourceMap.get(dataQuery.getDataSourceId());
                if (null != dataSource) {
                    transfer.setDatasourceName(dataSource.getDatasourceName());
                    transfer.setSchemaName(dataSource.getSchemaName());
                    transfer.setSchemaType(dataSource.getSchemaType());
                }
            }
            dataList.add(transfer);
        }
        return new PageResult<>(pageNo, pageSize, withPage.getTotal(), dataList);
    }


    /**
     * 获取数据查询详情
     */
    @GetMapping("/{settingId}")
    public DataQueryResponse findById(@PathVariable("settingId") String queryId) {
        DataQuery unitSetting = dataQueryService.getById(queryId);
        if (null == unitSetting) {
            log.error("参数错误,数据源查询不存在");
            throw new ParameterException("参数错误,数据源查询不存在");
        }
        String tableId = unitSetting.getTableId();
        String tableName = tableId;
        String datasourceName = null;
        String schemaType = null;
        String schemaName = null;
        //需要翻译出数据库 数据表名称
        DataSource dataSourceConfig = dataSourceService.findByDatasourceId(unitSetting.getDataSourceId());
        if (null != dataSourceConfig) {
            datasourceName = dataSourceConfig.getDatasourceName();
            schemaType = dataSourceConfig.getSchemaType();
            schemaName = dataSourceConfig.getSchemaName();
            if (schemaType.equalsIgnoreCase(HTTP)) {
                DataTable dataTable = dataTableService.getById(tableId);
                if (null != dataTable) {
                    tableName = dataTable.getName();
                }
            }
        }

        DataQueryResponse unitSettingDto = DataQueryResponse.transfer(unitSetting);
        Map<String,Object> setting = unitSettingDto.getSetting();
        //如果是复合查询,需要翻译每一个查询子项
        Integer queryType = unitSettingDto.getQueryType();
        if (null != queryType && !queryType.equals(SIMPLE)) {
            //当前复合查询的子查询，可能包含相同的子查询
            List<String> combineIds = (List<String>)unitSettingDto.getSetting().get("combineIds");

            List<DataQuery> dataQueries = dataQueryService.findByQueryIds(combineIds);
            Map<String, DataQuery> collect = dataQueries.stream().collect(Collectors.toMap(DataQuery::getId, Function.identity()));

            List<JSONObject> combineInfo = new ArrayList<>();
            //需要遍历 combineIds ，因为可能包含相同的子查询，此时 dataQueries 中相同的子查询会是同一条数据
            for (String combineId : combineIds) {
                DataQuery dataQuery = collect.get(combineId);
                if(null == dataQuery){
                    log.error("子查询combineId:{}详细信息缺失.",combineId);
                    continue;
                }
                JSONObject jsonObject = new JSONObject(JSONUtil.parseObj(dataQuery).toString());
                if (StringUtils.isNotBlank(dataQuery.getSetting())){
                    jsonObject.put("setting",JSONUtil.parseObj(dataQuery.getSetting()));
                }
                jsonObject.put("settingId",dataQuery.getId());
                combineInfo.add(jsonObject);
            }
            setting.put("combineInfo",combineInfo);
            Map<String, JSONObject> paramsByName = new HashMap<>();
            Map<String, String> queryNameByParamName = new HashMap<>();
            Set<String> conflictName = new HashSet<>();
            for (String combineId : combineIds) {
                DataQuery dataQuery = collect.get(combineId);
                //处理组合查询参数逻辑
                JSONObject settings = new JSONObject(dataQuery.getSetting());
                if (settings != null) {
                    String queryName = dataQuery.getQueryName();
                    List<JSONObject> params = settings.getBeanList("params",JSONObject.class);
                    if (params != null) {
                        for (JSONObject json : params) {
                            String name = json.getStr("name");
                            if (conflictName.contains(name)) {
                                //已经确定冲突的直接换参数名
                                name = queryName + "_" + name;
                                json.set("name", name);
                                paramsByName.put(name, json);
                            } else {
                                JSONObject object = paramsByName.get(name);
                                if (object == null) {
                                    //当前没有说明未冲突
                                    paramsByName.put(name, json);
                                    queryNameByParamName.put(name, queryName);
                                } else {
                                    //当前存在说明冲突了
                                    String existQueryName = queryNameByParamName.get(name);
                                    //如果是同一个子查询则认为是同一个参数不再处理
                                    if (existQueryName.equals(queryName)) {
                                        continue;
                                    }
                                    //记录冲突
                                    conflictName.add(name);
                                    //换参数名保存
                                    String currentName = queryName + "_" + name;
                                    json.set("name", currentName);
                                    paramsByName.put(currentName, json);
                                    //将之前存在的也换参数名保存
                                    JSONObject remove = paramsByName.remove(name);
                                    String existName = existQueryName + "_" + name;
                                    remove.set("name", existName);
                                    paramsByName.put(existName, remove);
                                }
                            }
                        }
                    }
                }
            }
            setting.put("params", paramsByName.values());
        }
        unitSettingDto.setSchemaType(schemaType);
        unitSettingDto.setSchemaName(schemaName);
        unitSettingDto.setDatasourceName(datasourceName);
        unitSettingDto.setTableName(tableName);
        return unitSettingDto;
    }

    @PostMapping("/delete/{settingId}")
    public void deleteById(@PathVariable("settingId") String queryId) {
        DataQuery dataQuery = dataQueryService.getBaseMapper().selectById(queryId);
        if (dataQuery.getQueryType().equals(1)){
            //简单查询
            //删除前需要判断该 简单查询 是否被复合查询引用
            List<DataQuery> combineQueryList = dataQueryMapper.getCombineQueryListByRefQueryIds(Arrays.asList(queryId));

            if (CollectionUtil.isNotEmpty(combineQueryList)) {
                //简单查询存在被复合查询引用的引用关系
                log.error("该数据查询正在被复合查询使用");
                throw new BizException(QUERY_REF_BY_COMBINE);
            }else {
                //简单查询 不被引用，将引用关系清空，并删除基础查询
                combineQueryMapper.deleteByRefQueryId(queryId);
                dataQueryService.removeById(queryId);
            }
        }else {
            //复合查询
            dataQueryService.removeById(queryId);
            dataCombineQueryService.removeByCombineId(queryId);
        }
    }

    /**
     * 根据可视化组件id执行查询
     */
    @PostMapping(value = {"/query","shareQuery"})
    public Object query(@RequestBody UnitSearchByParamDto param) {
        String id = param.getId();
        DataQuery dataQuery = dataQueryService.getById(id);
        if (null == dataQuery) {
            log.error("参数错误,数据查询配置不存在");
            throw new ParameterException("参数错误,数据查询配置不存在");
        }
        Integer queryType = dataQuery.getQueryType();
        Map<String, String> sqlParam = param.getParams();
        if (null == queryType || queryType.equals(SIMPLE)) {
            //简单查询
            String datasourceId = dataQuery.getDataSourceId();
            DataSource config = dataSourceService.findByDatasourceId(datasourceId);
            String directory = dbBathPath + separator + ThreadLocalContext.getAccountId() + separator + config.getSchemaName();
            String sql = DataQueryHelper.getSqlBySearchParam(dataQuery, sqlParam, true);
            List<DataTable> tables = dataTableService.getTables(datasourceId);
            ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                    .schemaType(config.getSchemaType()).directory(directory)
                    .schemaName(config.getSchemaName()).datasourceId(datasourceId)
                    .connectData(new JSONObject(config.getConnectData())).tables(tables).build();
            try {
                return queryExecute.execute(params);
            } catch (Exception e) {
                log.error("数据查询执行异常," + e.getMessage());
                throw new SqlExecException(QUERY_EXECUTE_FAILED);
            }
        } else {
            //复合查询
            List<DataCombineQuery> dataCombineQueries = dataCombineQueryService.queryByCombineQueryId(id);
            List<String> refQueryIds = dataCombineQueries.stream().map(DataCombineQuery::getRefQueryId).collect(Collectors.toList());
            List<DataQuery> refQuerys = dataQueryService.findByQueryIds(refQueryIds);
            Map<String, DataQuery> refQuerysMap = refQuerys.stream().collect(Collectors.toMap(DataQuery::getId, Function.identity()));

            List<List<Map<String,Object>>> dataSets = new ArrayList<>();

            //每个简单查询都对应一个sql和数据源
            List<String> datasourceIds = refQuerys.stream().map(DataQuery::getDataSourceId).collect(Collectors.toList());
            List<DataSource> datasources = dataSourceService.findByDatasourceIds(datasourceIds);
            Map<String, DataSource> datasourceMap = datasources.stream().collect(Collectors.toMap(DataSource::getDatasourceId, Function.identity()));

            List<DataTable> tables = dataTableService.getTables(datasourceIds);
            Map<String, List<DataTable>> collect1 = tables.stream().collect(Collectors.groupingBy(DataTable::getDataSourceId));

            List<String> errorQuery = new ArrayList<>();
            for (String refQueryId : refQueryIds) {
                DataQuery query = refQuerysMap.get(refQueryId);
                String queryName = query.getQueryName();
                String datasourceId = query.getDataSourceId();
                DataSource config = datasourceMap.get(datasourceId);
                if (config == null) {
                    log.error("子查询-" + queryName + "对应的数据源信息不存在,无法建立数据源连接");
                    errorQuery.add(queryName);
                } else {
                    String sql = DataQueryHelper.getSqlBySearchParam(query, sqlParam, true);
                    String directory = dbBathPath + separator + ThreadLocalContext.getAccountId() + separator + config.getSchemaName();
                    ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                            .datasourceId(datasourceId).directory(directory)
                            .schemaName(config.getSchemaName())
                            .schemaType(config.getSchemaType())
                            .connectData(new JSONObject(config.getConnectData()))
                            .tables(collect1.get(datasourceId))
                            .build();
                    try {
                        List<Map<String,Object>> dataSet = queryExecute.execute(params);
                        dataSets.add(dataSet);
                    } catch (Exception e) {
                        log.error("子查询-{}失败,请检查子查询的sql语法是否正确", queryName);
                        errorQuery.add(queryName);
                    }
                }
            }
            if (CollectionUtil.isNotEmpty(errorQuery)) {
                String collect = errorQuery.stream().collect(Collectors.joining(","));
                throw new BizException(SUB_QUERY_EXECUTE_FAILED, "子查询:" + collect + "失败,请检查子查询的sql语法是否正确");
            }
            return CombineDataset.combine(queryType, dataSets);
        }
    }


    /**
     * 校验某个子查询是否可用
     */
    @GetMapping("/queryTest")
    public Object subQueryTest(@RequestParam String settingId, @RequestParam Integer queryType) {
        DataQuery unitSetting = dataQueryService.getById(settingId);
        if (null == unitSetting) {
            log.error("参数错误,数据查询配置不存在");
            throw new ParameterException("参数错误,数据查询配置不存在");
        }
        if (null != unitSetting.getQueryType() && unitSetting.getQueryType() > 1) {
            log.error("数据查询类型错误,仅支持普通数据查询校验");
            throw new CombineException(COMBINE_QUERY_TYPE_ERROR, "数据查询类型错误,仅支持普通数据查询校验");
        }
        String dataSourceId = unitSetting.getDataSourceId();
        DataSource dataSource = dataSourceService.findByDatasourceId(dataSourceId);
        if (null == dataSource) {
            log.error("对应的数据源不存在,无法建立数据源连接");
            throw new ParameterException("对应的数据源不存在,无法建立数据源连接");
        }
        JSONObject object = new JSONObject();
        object.put("settingId", settingId);
        object.put("queryName", unitSetting.getQueryName());
        object.put("avaliable", true);

        //简单查询
        String directory = dbBathPath + separator + ThreadLocalContext.getAccountId() + separator + dataSource.getSchemaName();
        String schemaType = dataSource.getSchemaType();
        String sql = DataQueryHelper.getSqlBySearchParam(unitSetting, null, true);
        ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                .datasourceId(dataSourceId).directory(directory)
                .schemaType(schemaType).schemaName(dataSource.getSchemaName())
                .connectData(new JSONObject(dataSource.getConnectData())).build();
        if (schemaType.equalsIgnoreCase(HTTP)) {
            List<DataTable> tables = dataTableService.getTables(dataSourceId);
            params.setTables(tables);
        }
        try {
            List<Map<String,Object>> dataSet = queryExecute.execute(params);
            CombineDataset.combine(queryType, Arrays.asList(dataSet));
        } catch (Exception e) {
            log.error("数据查询 settingId:{} 按格式 queryType:{} 转换失败,", settingId, queryType);
            //throw new BizException(ResultCode.QUERY_EXECUTE_FAILED);
            object.put("avaliable", false);
            object.put("msg", "\"" + unitSetting.getQueryName() + "\"数据转换失败,请检查数据结构是否可以复合");
            return object;
        }

        return object;

    }

    /**
     * 获取复合查询的查询子项的结果
     * 阶段1: 子查询原始数据集；
     * 阶段2: 子查询的数据集进行时序处理；
     * 阶段3: 阶段2的结果进行合并。
     * 该接口处理到阶段1，然后把所有的子查询的阶段1的结果按顺序返回。
     *
     * @param settingId
     * @return
     */
    @GetMapping("/combineQueryOriginal")
    public Object combineQueryOriginal(@RequestParam String settingId) {
        DataQuery unitSetting = dataQueryService.getById(settingId);
        if (null == unitSetting) {
            log.error("参数错误,数据查询配置不存在");
            throw new ParameterException("参数错误,数据查询配置不存在");
        }
        List<List<Map<String,Object>>> dataSets = new ArrayList<>();
        //复合查询
        if (null != unitSetting.getQueryType() && !unitSetting.getQueryType().equals(SIMPLE)) {
            List<DataCombineQuery> dataCombineQueries = dataCombineQueryService.queryByCombineQueryId(settingId);
            List<String> combineIds = dataCombineQueries.stream().map(DataCombineQuery::getRefQueryId).collect(Collectors.toList());
            List<DataQuery> dataQueries = dataQueryService.findByQueryIds(combineIds);
            List<String> datasourceIds = dataQueries.stream().map(DataQuery::getDataSourceId).collect(Collectors.toList());
            Map<String, DataSource> datasourceMap = dataSourceService.findByDatasourceIds(datasourceIds).stream().collect(Collectors.toMap(DataSource::getDatasourceId, Function.identity()));

            List<String> errorQuery = new ArrayList<>();
            for (DataQuery dataQuery : dataQueries) {
                String queryName = dataQuery.getQueryName();
                String datasourceId = dataQuery.getDataSourceId();
                DataSource config = datasourceMap.get(datasourceId);
                if (config == null) {
                    log.error("子查询-" + queryName + "对应的数据源信息不存在,无法建立数据源连接");
                    errorQuery.add(queryName);
                } else {
                    String accountId = ThreadLocalContext.getAccountId().toString();
                    String directory = dbBathPath + separator + accountId + separator + config.getSchemaName();
                    String schemaType = config.getSchemaType();
                    String sql = DataQueryHelper.getSqlBySearchParam(dataQuery, null, true);
                    ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                            .datasourceId(datasourceId)
                            .schemaName(config.getSchemaName()).directory(directory)
                            .schemaType(schemaType)
                            .connectData(new JSONObject(config.getConnectData()))
                            .build();
                    if (schemaType.equalsIgnoreCase(HTTP)) {
                        List<DataTable> tables = dataTableService.getTables(datasourceId);
                        params.setTables(tables);
                    }
                    try {
                        List<Map<String,Object>> dataSet = queryExecute.execute(params);
                        dataSets.add(dataSet);
                    } catch (Exception e) {
                        log.error("子查询:{}失败,请检查子查询的sql语法是否正确", queryName);
                        errorQuery.add(queryName);
                    }
                }
            }
            if (CollectionUtil.isNotEmpty(errorQuery)) {
                String collect = errorQuery.stream().collect(Collectors.joining(","));
                throw new BizException(SUB_QUERY_EXECUTE_FAILED, "子查询:" + collect + "失败,请检查子查询的sql语法是否正确");
            }
        }
        return dataSets;
    }

    /**
     * 非时序复合的数据预览直接显示所有子查询复合后的结果。
     * 阶段1: 子查询原始数据集；
     * 阶段2: 子查询的数据集进行时序处理；
     * 阶段3: 阶段2的结果进行合并。
     * 该接口处理到阶段3，然后把所有的子查询的阶段3的结果复合后返回。
     */
    @PostMapping("/combineQueryNoSequence")
    public Object combineQueryNoSequence(@RequestBody CombineQueryDto combineQueryDto) {
        List<String> refQueryIds = combineQueryDto.getCombineIds();
        if (CollectionUtil.isEmpty(refQueryIds)) {
            return null;
        }
        Integer queryType = combineQueryDto.getQueryType();
        List<DataQuery> unitSettings = dataQueryService.findByQueryIds(refQueryIds);
        Map<String, DataQuery> collect = unitSettings.stream().collect(Collectors.toMap(DataQuery::getId, Function.identity()));

        boolean flag = true;
        List<List<Map<String,Object>>> dataSets = new LinkedList<>();
        Map<String, JSONObject> errorCombineMap = new HashMap<>();
        String primaryKey = null;

        List<String> datasourceIds = unitSettings.stream().map(DataQuery::getDataSourceId).collect(Collectors.toList());
        List<DataSource> datasources = dataSourceService.findByDatasourceIds(datasourceIds);
        Map<String, DataSource> datasourceMap = datasources.stream().collect(Collectors.toMap(DataSource::getDatasourceId, Function.identity()));

        for (String refQueryId : refQueryIds) {
            DataQuery dataQuery = collect.get(refQueryId);
            String queryName = dataQuery.getQueryName();
            String queryId = dataQuery.getId();

            JSONObject object = new JSONObject();
            object.put("settingId", dataQuery.getId());
            object.put("queryName", queryName);
            object.put("available", true);
            errorCombineMap.put(queryId, object);

            String datasourceId = dataQuery.getDataSourceId();
            DataSource config = datasourceMap.get(datasourceId);

            String directory = dbBathPath + separator + ThreadLocalContext.getAccountId() + separator + config.getSchemaName();
            String schemaType = config.getSchemaType();
            String sql = DataQueryHelper.getSqlBySearchParam(dataQuery, null, true);
            ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                    .datasourceId(datasourceId).schemaName(config.getSchemaName()).directory(directory)
                    .schemaType(schemaType)
                    .connectData(new JSONObject(config.getConnectData()))
                    .build();
            if (schemaType.equalsIgnoreCase(HTTP)) {
                List<DataTable> tables = dataTableService.getTables(datasourceId);
                params.setTables(tables);
            }
            try {
                List<Map<String,Object>> dataSet = queryExecute.execute(params);
                if (queryType.equals(COMBINE_MULTI_VALUE_COLUMN_TYPE) && null == primaryKey) {
                    primaryKey = new ArrayList<>(dataSet.get(0).keySet()).get(0);
                }
                dataSet = dataSet.subList(0, Math.min(dataSet.size(), previewCount));
                dataSets.add(dataSet);

                //检查当前子查询的结果是否支持复合,子查询支持
                JSONObject object1 = CombineDataset.testCombine(primaryKey, queryType, dataSet);
                if (!object1.getBool("flag")) {
                    log.error("数据查询 settingId:{} 按格式 queryType:{} 转换失败,", queryId, queryType);
                    flag = false;
                    object.put("available", false);
                    object.put("msg", "\"" + queryName + "\"数据转换失败," + object1.getStr("msg"));
                    errorCombineMap.put(queryId, object);
                }
            } catch (Exception e) {
                log.error("子查询:{}失败,请检查子查询的sql语法是否正确", queryName);
                flag = false;
                object.put("available", false);
                object.put("msg", "子查询\"" + queryName + "\"执行失败,请检查sql语句或数据源配置是否正确");
                errorCombineMap.put(queryId, object);
                continue;
            }
        }
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("flag", flag);
        if (flag) {
            result.put("data", CombineDataset.combine(queryType, dataSets));
        } else {
            List<JSONObject> errorCombine = new ArrayList<>();
            for (String combineId : refQueryIds) {
                JSONObject object = errorCombineMap.get(combineId);
                errorCombine.add(object);
            }
            result.put("data", errorCombine);
        }
        return result;
    }


    /**
     * 获取时序复合的每个子查询处理后的结果
     * 阶段1: 子查询原始数据集；
     * 阶段2: 子查询的数据集进行时序处理；
     * 阶段3: 阶段2的结果进行合并。
     * 该接口处理到阶段2，然后把所有的子查询的阶段2的结果按顺序返回。
     */
    @PostMapping("/combineQuerySequence")
    public Object combineQuerySequence(@RequestBody CombineQueryDto combineQueryDto) {
        List<String> refQueryIds = combineQueryDto.getCombineIds();
        List<DataQuery> unitSettings = dataQueryService.findByQueryIds(refQueryIds);
        Map<String, DataQuery> collect = unitSettings.stream().collect(Collectors.toMap(DataQuery::getId, Function.identity()));
        boolean flag = true;
        List<List<Map<String,Object>>> dataSets = new LinkedList<>();
        Map<String, JSONObject> errorCombineMap = new HashMap<>();

        List<String> datasourceIds = unitSettings.stream().map(DataQuery::getDataSourceId).collect(Collectors.toList());
        Map<String, DataSource> datasourceMap = dataSourceService.findByDatasourceIds(datasourceIds).stream().collect(Collectors.toMap(DataSource::getDatasourceId, Function.identity()));

        for (String refQueryId : refQueryIds) {
            DataQuery dataQuery = collect.get(refQueryId);
            String queryId = dataQuery.getId();
            String queryName = dataQuery.getQueryName();

            String datasourceId = dataQuery.getDataSourceId();
            DataSource config = datasourceMap.get(datasourceId);

            JSONObject object = new JSONObject();
            object.put("settingId", queryId);
            object.put("queryName", queryName);
            object.put("available", true);
            errorCombineMap.put(queryId, object);
            if (config == null) {
                log.error("子查询-" + queryName + "对应的数据源信息不存在,无法建立数据源连接");
                flag = false;
                object.put("available", false);
                object.put("msg", "子查询-" + queryName + "对应的数据源信息不存在,无法建立数据源连接");
                errorCombineMap.put(queryId, object);
                continue;
            } else {
                String schemaType = config.getSchemaType();
                String directory = dbBathPath + separator + ThreadLocalContext.getAccountId() + separator + config.getSchemaName();
                String sql = DataQueryHelper.getSqlBySearchParam(dataQuery, null, true);
                ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                        .datasourceId(datasourceId).schemaName(config.getSchemaName()).directory(directory)
                        .schemaType(schemaType)
                        .connectData(new JSONObject(config.getConnectData()))
                        .build();
                if (schemaType.equalsIgnoreCase(HTTP)) {
                    List<DataTable> tables = dataTableService.getTables(datasourceId);
                    params.setTables(tables);
                }
                List<Map<String,Object>> dataSet = queryExecute.execute(params);
                try {
                    dataSet = dataSet.subList(0, Math.min(dataSet.size(), previewCount));
                } catch (Exception e) {
                    log.error("子查询:{}失败,请检查子查询的sql语法是否正确", queryName);
                    flag = false;
                    object.put("available", false);
                    object.put("msg", "子查询\"" + queryName + "\"执行失败,请检查sql语句或数据源配置是否正确");
                    errorCombineMap.put(queryId, object);
                    continue;
                }
                try {
                    //检查当前子查询的结果是否支持复合
                    dataSets.add((List<Map<String,Object>>) CombineDataset.combine(5, Arrays.asList(dataSet)));
                } catch (Exception e) {
                    log.error("数据查询 settingId:{} 按格式 queryType:{} 转换失败,", queryId, 5);
                    flag = false;
                    object.put("available", false);
                    object.put("msg", "\"" + queryName + "\"数据转换失败,请检查数据是否支持复合");
                    errorCombineMap.put(queryId, object);
                }
            }
        }
        JSONObject result = new JSONObject();
        result.put("flag", flag);
        if (flag) {
            result.put("data", dataSets);
        } else {
            List<JSONObject> errorCombine = new ArrayList<>();
            for (String combineId : refQueryIds) {
                errorCombine.add(errorCombineMap.get(combineId));
            }
            result.put("data", errorCombine);
        }
        return result;
    }


    @GetMapping("/subQuery")
    public Object combineQuerySequence(@RequestParam String settingId) {
        DataQuery unitSetting = dataQueryService.getById(settingId);
        if (null == unitSetting) {
            log.error("参数错误,查询不存在");
            throw new ParameterException("参数错误,查询不存在");
        } else if (null == unitSetting.getQueryType() || unitSetting.getQueryType().equals(SIMPLE)) {
            log.error("简单查询不支持子查询获取");
            throw new BizException("简单查询不支持子查询获取");
        }
        //复合查询
        List<String> refQueryIds = dataCombineQueryService.queryByCombineQueryId(settingId).stream().map(DataCombineQuery::getRefQueryId).collect(Collectors.toList());
        List<DataQuery> dataQueries = dataQueryService.findByQueryIds(refQueryIds);

        List<String> datasourceIds = dataQueries.stream().map(DataQuery::getDataSourceId).collect(Collectors.toList());
        Map<String, DataSource> datasourceMap = dataSourceService.findByDatasourceIds(datasourceIds).stream().collect(Collectors.toMap(DataSource::getDatasourceId, Function.identity()));

        List<List<Map<String,Object>>> dataSets = new ArrayList<>();
        for (DataQuery dataQuery : dataQueries) {
            String queryId = dataQuery.getId();
            String queryName = dataQuery.getQueryName();

            String datasourceId = dataQuery.getDataSourceId();
            DataSource config = datasourceMap.get(datasourceId);
            if (null == config) {
                List<Map<String,Object>> mapList = new ArrayList<>();
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("settingId", queryId);
                map.put("queryName", queryName);
                map.put("msg", "子查询-" + queryName + "对应的数据源信息不存在,无法建立数据源连接");
                log.error("子查询-" + queryName + "对应的数据源信息不存在,无法建立数据源连接");
                mapList.add(map);
                dataSets.add(mapList);
            } else {
                String schemaType = config.getSchemaType();
                String directory = dbBathPath + separator + ThreadLocalContext.getAccountId() + separator + config.getSchemaName();
                String sql = DataQueryHelper.getSqlBySearchParam(dataQuery, null, true);
                ExecuteBean params = ExecuteBean.builder().taskId(Snowflake.INSTANCE.nextId()).sql(sql)
                        .datasourceId(datasourceId).schemaName(config.getSchemaName()).directory(directory)
                        .schemaType(schemaType).connectData(new JSONObject(config.getConnectData())).build();
                if (schemaType.equalsIgnoreCase(HTTP)) {
                    List<DataTable> tables = dataTableService.getTables(datasourceId);
                    params.setTables(tables);
                }
                try {
                    List<Map<String,Object>> dataSet = queryExecute.execute(params);
                    dataSets.add(dataSet);
                } catch (Exception e) {
                    List<Map<String,Object>> mapList = new ArrayList<>();
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("settingId", queryId);
                    map.put("queryName", queryName);
                    map.put("msg", "子查询-" + queryName + "失败,请检查子查询的sql语法是否正确");
                    log.error("子查询-{}失败,请检查子查询的sql语法是否正确", queryName);
                    mapList.add(map);
                    dataSets.add(mapList);
                }
            }
        }

        return dataSets;
    }
}
