package com.cloudwise.lcap.dataplateform.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.PageResult;
import com.cloudwise.lcap.common.enums.ResultCode;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.exception.ParameterException;
import com.cloudwise.lcap.common.utils.SnowFlakeUtil;
import com.cloudwise.lcap.dataplateform.core.execute.QueryExecute;
import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;
import com.cloudwise.lcap.dataplateform.dao.DataSourceDao;
import com.cloudwise.lcap.dataplateform.dao.UnitSettingDao;
import com.cloudwise.lcap.dataplateform.dto.UnitSettingDto;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.model.UnitSetting;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.beetl.core.util.ArraySet;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.SIMPLE;
import static com.cloudwise.lcap.common.enums.ResultCode.COMBINE_QUERY_NO_SUB_QUERY;
import static com.cloudwise.lcap.common.enums.ResultCode.QUERY_REF_BY_COMBINE;
import static com.cloudwise.lcap.common.utils.ValidatorUtils.validateLegalString;

/**
 * 可视化组件设置信息的增删改查
 *
 * @author yinqiqi
 */

@Slf4j
@RestController
@RequestMapping("/unit")
public class UnitSettingController {

    private UnitSettingDao unitSettingDao;
    private DataSourceDao dataSourceDao;
    @Value("${db_bathpath}")
    private String dbBathPath;
    public UnitSettingController(UnitSettingDao unitSettingDao, DataSourceDao dataSourceDao) {
        this.unitSettingDao = unitSettingDao;
        this.dataSourceDao = dataSourceDao;
    }

    private int previewCount = 50;

    /**
     * 新增配置
     */
    @PostMapping
    public UnitSetting addUnitSetting(@RequestBody UnitSetting unitSetting) {
        String queryName = unitSetting.getQueryName();
        Integer queryType = unitSetting.getQueryType();
        unitSetting.setQueryType(SIMPLE);
        if (StringUtils.isEmpty(unitSetting.getSql())) {
            log.error("参数缺失:{}，sql必填", unitSetting);
            throw new ParameterException("参数缺失，sql必填");
        }

        String tableId = unitSetting.getTableId();
        String tableName = unitSetting.getTableName();
        if (StringUtils.isEmpty(tableId)) {
            unitSetting.setTableId(tableName);
        }
        if (!validateLegalString(queryName)) {
            log.error("数据源名称不符合规则,queryName:{}", queryName);
            log.error("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
            throw new ParameterException("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
        }

        if (null != unitSettingDao.findByQueryName(queryName)) {
            log.error("同名数据查询已存在,queryName:{}", queryName);
            throw new ParameterException("同名数据查询已存在");
        }

        if (!SIMPLE.equals(queryType) && CollectionUtil.isEmpty(unitSetting.getSetting().getJSONArray("combineIds"))) {
            log.error("复合查询的查询子项不能为空");
            throw new BizException(COMBINE_QUERY_NO_SUB_QUERY);
        }
        return unitSettingDao.addUnitSetting(unitSetting);
    }

    @PostMapping("/update")
    public void update(@RequestBody UnitSetting unitSetting) {
        String queryName = unitSetting.getQueryName();
        if (!validateLegalString(queryName)) {
            log.error("数据源名称不符合规则,queryName:{}", queryName);
            log.error("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
            throw new ParameterException("数据查询名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
        }

        UnitSetting query = unitSettingDao.findByQueryName(queryName);
        if (null != query && !query.getSettingId().equals(unitSetting.getSettingId())) {
            log.error("同名数据查询已存在,queryName:{}", queryName);
            throw new ParameterException("同名数据查询已存在");
        }
        unitSettingDao.update(unitSetting);
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
    public PageResult<UnitSettingDto> findAll(@RequestParam(required = false, defaultValue = "0") Integer pageNo, @RequestParam(required = false, defaultValue = "10") Integer pageSize, @RequestParam(required = false) String queryName, @RequestParam(required = false) Integer queryType, @RequestParam(required = false) String datasourceName) {
        if (!validateLegalString(queryName) || !validateLegalString(datasourceName)) {
            log.error("数据查询名称或者数据源名称不能包含特殊字符");
            return new PageResult<>(pageNo, pageSize, 0L, null);
            //throw new ParameterException("项目名不能包含特殊字符");
        }
        Set<String> datasourceIds = new ArraySet<>();
        if (StringUtils.isNotBlank(datasourceName)) {
            List<DataSourceConfig> dataSourceConfigs = dataSourceDao.findByRegexDatasourceName(datasourceName);
            if (CollectionUtil.isNotEmpty(dataSourceConfigs)){
                datasourceIds.addAll(dataSourceConfigs.stream().map(DataSourceConfig::getDatasourceId).collect(Collectors.toSet()));
            }else{
                return new PageResult<>(pageNo,pageSize,0L,new ArrayList<>());
            }
        }
        PageResult<UnitSetting> all = unitSettingDao.findAll(pageNo, pageSize, queryName, queryType, datasourceIds);

        List<UnitSetting> data = all.getData();
        List<String> combineIds = new ArrayList<>();
        for (UnitSetting unitSetting : data) {
            if (null != unitSetting.getQueryType() && !unitSetting.getQueryType().equals(SIMPLE)) {
                List<String> combineIdList = unitSetting.getSetting().getBeanList("combineIds", String.class);
                if (CollectionUtil.isNotEmpty(combineIdList)){
                    combineIds.addAll(combineIdList);
                }
            }
        }
        List<UnitSetting> unitSettingList = unitSettingDao.findByIds(combineIds);
        unitSettingList.addAll(data);
        //settingId和datasourceId的对应关系
        Map<String, String> var = new HashMap<>();
        for (UnitSetting unitSetting : unitSettingList) {
            var.put(unitSetting.getSettingId(), unitSetting.getDatasourceId());
            if (StringUtils.isNotBlank(unitSetting.getDatasourceId())){
                datasourceIds.add(unitSetting.getDatasourceId());
            }
        }

        List<DataSourceConfig> dataSourceConfigs = dataSourceDao.findByDatasourceIds(datasourceIds);
        Map<String, DataSourceConfig> dataSourceMap = dataSourceConfigs.stream().collect(Collectors.toMap(DataSourceConfig::getDatasourceId, Function.identity()));

        //翻译数据源名称
        List<UnitSettingDto> dataList = new ArrayList<>();
        for (UnitSetting unitSetting : data) {
            UnitSettingDto unitSettingDto = new UnitSettingDto();
            BeanUtils.copyProperties(unitSetting, unitSettingDto);
            //翻译复合查询的数据源名称
            if (null != unitSetting.getQueryType() && !unitSetting.getQueryType().equals(SIMPLE)) {
                List<String> combineId1 = unitSetting.getSetting().getBeanList("combineIds", String.class);

                Set<String> theDatasourceName = new HashSet<>();
                for (String settingId : combineId1) {
                    String dataSourceId = var.get(settingId);
                    DataSourceConfig config = dataSourceMap.get(dataSourceId);
                    if (null != config && StringUtils.isNotBlank(config.getDatasourceName())) {
                        theDatasourceName.add(config.getDatasourceName());
                    }
                }
                String collect = theDatasourceName.stream().collect(Collectors.joining(","));
                unitSettingDto.setDatasourceName(collect);
            } else {
                DataSourceConfig config = dataSourceMap.get(unitSetting.getDatasourceId());
                if (null != config) {
                    unitSettingDto.setDatasourceName(config.getDatasourceName());
                }
            }
            dataList.add(unitSettingDto);
        }
        return new PageResult<>(all.getPageNo(), all.getPageSize(), all.getTotal(), dataList);
    }


    /**
     * 获取数据查询详情
     */
    @GetMapping("/{settingId}")
    public UnitSettingDto findById(@PathVariable String settingId) {
        UnitSetting unitSetting = unitSettingDao.findById(settingId);
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
        DataSourceConfig dataSourceConfig = dataSourceDao.findByDatasourceId(unitSetting.getDatasourceId());
        if (null != dataSourceConfig) {
            datasourceName = dataSourceConfig.getDatasourceName();
            schemaType = dataSourceConfig.getSchemaType();
            schemaName = dataSourceConfig.getSchemaName();
        }

        UnitSettingDto unitSettingDto = new UnitSettingDto();
        BeanUtils.copyProperties(unitSetting, unitSettingDto);
        //如果是复合查询,需要翻译每一个查询子项
        Integer queryType = unitSetting.getQueryType();
        if (null != queryType && !queryType.equals(SIMPLE)) {
            List<String> combineIds = unitSetting.getSetting().getBeanList("combineIds", String.class);
            if (CollectionUtil.isNotEmpty(combineIds)){
                List<UnitSetting> combineInfo = unitSettingDao.findByIds(combineIds);
                if (CollectionUtil.isNotEmpty(combineInfo)){
                    Map<String, UnitSetting> collect = combineInfo.stream().collect(Collectors.toMap(UnitSetting::getSettingId, Function.identity()));
                    List<UnitSetting> var = new ArrayList<>();
                    for (String combineId : combineIds) {
                        var.add(collect.get(combineId));
                    }
                    unitSettingDto.getSetting().put("combineInfo", var);
                }
            }
        }
        unitSettingDto.setSchemaType(schemaType);
        unitSettingDto.setSchemaName(schemaName);
        unitSettingDto.setDatasourceName(datasourceName);
        unitSettingDto.setTableName(tableName);
        return unitSettingDto;
    }

    @PostMapping("/delete/{settingId}")
    public void deleteById(@PathVariable String settingId) {
        //删除前需要判断是否被复合查询引用
        if (CollectionUtil.isNotEmpty(unitSettingDao.findCombineQueryByRefId(settingId))) {
            log.error("该数据查询正在被复合查询使用");
            throw new BizException(QUERY_REF_BY_COMBINE);
        }
        unitSettingDao.deleteById(settingId);
    }

    /**
     * 根据可视化组件id执行查询
     */
    @GetMapping("/query")
    public Object getData(@RequestParam String id) {
        UnitSetting unitSetting = unitSettingDao.findById(id);
        if (null == unitSetting) {
            log.error("参数错误,数据查询配置不存在");
            throw new ParameterException("参数错误,数据查询配置不存在");
        }
        //简单查询
        String datasourceId = unitSetting.getDatasourceId();
        DataSourceConfig config = dataSourceDao.findByDatasourceId(datasourceId);

        if (null == config) {
            log.error("对应的数据源不存在,无法建立数据源连接");
            throw new ParameterException("对应的数据源不存在,无法建立数据源连接");
        } else {
            ExecuteBean params = ExecuteBean.builder().taskId(SnowFlakeUtil.getFlowIdInstance().nextId()).sql(unitSetting.getSql())
                    .schemaType(config.getSchemaType())
                    .schemaName(config.getSchemaName())
                    .datasourceId(datasourceId)
                    .connectData(new JSONObject(config.getConnectData()))
                    .tables(config.getTables())
                    .build();
            try {
                return QueryExecute.execute(params);
            } catch (Exception e) {
                log.error("调用链执行异常," + e.getMessage());
                throw new BizException(ResultCode.INTERNAL_SERVER_ERROR);
            }
        }
    }

}
