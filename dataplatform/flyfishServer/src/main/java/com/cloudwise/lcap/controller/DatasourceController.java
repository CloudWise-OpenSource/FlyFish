package com.cloudwise.lcap.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cloudwise.lcap.commonbase.base.PageResult;
import com.cloudwise.lcap.commonbase.dto.DatasourceStatus;
import com.cloudwise.lcap.commonbase.entity.DataQuery;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.DataSourceConnectionException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.commonbase.util.ValidatorUtils;
import com.cloudwise.lcap.datasource.execute.DataSourceUtils;
import com.cloudwise.lcap.service.IDataQueryService;
import com.cloudwise.lcap.service.IDataSourceService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;
import static com.cloudwise.lcap.commonbase.util.ValidatorUtils.validateLegalString;

/**
 * 数据源管理：数据源的增删改查
 *
 * @author yinqiqi
 */
@Slf4j
@RestController
@RequestMapping("datasource")
public class DatasourceController {

    @Autowired
    private IDataSourceService dataSourceService;
    @Autowired
    private IDataQueryService dataQueryService;
    @Value("${db_bathpath}")
    private String dbBathPath;

    /**
     * 添加数据源
     */
    @PostMapping
    public DataSource addDataSource(@RequestBody DataSource configInfo) {
        JSONObject connectData = new JSONObject(configInfo.getConnectData());
        String datasourceName = connectData.getStr("datasourceName");
        String schemaName = connectData.getStr("schemaName");
        String schemaType = configInfo.getSchemaType();
        if (StringUtils.isAnyBlank(datasourceName, schemaName)) {
            log.error("数据源名称:{}和数据库:{}名称必填", datasourceName, schemaName);
            throw new ParameterException("数据源名称或数据库名称缺失");
        }
        if (!ValidatorUtils.varValidate(schemaName)) {
            log.error("数据库名不符合规则,schemaName=" + schemaName);
            throw new ParameterException("数据库名不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }
        if (!validateLegalString(configInfo.getDatasourceName())) {
            log.error("数据源名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符,schemaName=" + schemaName);
            throw new ParameterException("数据源名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
        }

        Map<String, Object> map = new HashMap<>(connectData);
        map.put(SCHEMA_NAME, schemaName);
        DatasourceStatus status = DataSourceUtils.available(schemaType, map);
        if (!status.getAvailable()) {
            log.error("数据源连接测试失败,请确认连接配置信息," + status.getMessage());
            throw new DataSourceConnectionException("连接信息有误，请修改后连接测试后再保存！");
        }

        DataSource config2 = dataSourceService.findByDatasourceName(datasourceName);
        if (null != config2) {
            log.error("数据源名称:{}重复", datasourceName);
            throw new ParameterException("数据源名称已存在");
        }
        configInfo.setSchemaName(schemaName);
        configInfo.setDatasourceName(datasourceName);

        connectData.remove("datasourceName");
        connectData.remove("schemaName");
        configInfo.setConnectData(connectData.toString());

        configInfo.setConnectData(connectData.toString());


        DataSource dataSource = new DataSource();
        dataSource.setDatasourceId(Snowflake.INSTANCE.nextId().toString());
        dataSource.setDatasourceName(configInfo.getDatasourceName());
        dataSource.setSchemaType(configInfo.getSchemaType());
        dataSource.setSchemaName(configInfo.getSchemaName());
        dataSource.setConnectData(configInfo.getConnectData());
        dataSource.setAccountId(ThreadLocalContext.getAccountId());
        dataSource.setCreator(ThreadLocalContext.getUserId());
        dataSource.setUpdater(ThreadLocalContext.getUserId());
        dataSourceService.save(dataSource);
        return dataSource;
    }


    /**
     * 修改数据源
     *
     * @param config
     */
    @PostMapping("/update")
    public void updateDataSource(@RequestBody DataSource config) {
        String datasourceId = config.getDatasourceId();
        //可能修改schemaName，修改确保修改时不重名
        DataSource dataSource = dataSourceService.findByDatasourceId(datasourceId);
        if (null == dataSource) {
            log.error("参数缺失或参数不正确，datasourceId:{},查询到的DataSourceConfig:{}", datasourceId, dataSource);
            throw new ParameterException("数据源不存在,datasourceId=" + datasourceId);
        }
        String datasourceName = config.getDatasourceName();
        String connectData = config.getConnectData();
        String schemaType = dataSource.getSchemaType();
        String schemaName = config.getSchemaName();
        DatasourceStatus status = DataSourceUtils.available(schemaType, new JSONObject(connectData));
        if (!status.getAvailable()) {
            log.error("数据源连接测试失败,请确认连接配置信息," + status.getMessage());
            throw new DataSourceConnectionException("数据源连接失败,请确认连接配置信息");
        }
        if (StringUtils.isNotEmpty(datasourceName) && !datasourceName.equals(dataSource.getDatasourceName())) {
            //数据源名称被修改
            DataSource config2 = dataSourceService.findByDatasourceName(datasourceName);
            if (null != config2 && !config2.getDatasourceId().equals(datasourceId)) {
                log.error("数据源名称:{}重复", datasourceName);
                throw new ParameterException("数据源名称重复");
            }
            if (!validateLegalString(datasourceName)) {
                log.error("数据源名称不符合规则,datasourceName:{}", datasourceName);
                log.error("数据源名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
                throw new ParameterException("数据源名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
            }
            dataSource.setDatasourceName(datasourceName);
        }
        if (!schemaType.equalsIgnoreCase(HTTP) && !ValidatorUtils.varValidate(schemaName)) {
            log.error("数据库名称不符合规则,schemaName=" + schemaName);
            throw new ParameterException("数据库不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }
        if (StringUtils.isNotEmpty(schemaName) && !schemaName.equals(dataSource.getSchemaName())) {
            dataSource.setSchemaName(schemaName);
        }
        dataSource.setConnectData(connectData);
        dataSource.setUpdater(ThreadLocalContext.getUserId());
        dataSourceService.updateById(dataSource);
    }

    /**
     * 条件查询，支持分页
     *
     * @param datasourceName
     * @param schemaName
     * @return
     */
    @GetMapping("/findAll")
    public PageResult<DataSource> queryDataSource(
            @RequestParam(required = false, defaultValue = "1") Long pageNo,
            @RequestParam(required = false, defaultValue = "10") Long pageSize,
            @RequestParam(required = false) String datasourceName,
            @RequestParam(required = false) String schemaName) {
        if (!validateLegalString(datasourceName)) {
            return new PageResult<>(pageNo, pageSize, 0L, new ArrayList<>());
        }
        Page<DataSource> withPage = dataSourceService.findWithPage(pageNo, pageSize, datasourceName, schemaName);
        return new PageResult<>(pageNo, pageSize, withPage.getTotal(), withPage.getRecords());
    }

    @GetMapping
    public DataSource detail(@RequestParam String datasourceId) {

        return dataSourceService.findByDatasourceId(datasourceId);
    }


    /**
     * 删除数据源
     *
     * @param datasourceId
     */
    @PostMapping("/deleteById/{datasourceId}")
    public void update(@PathVariable String datasourceId) {
        DataSource dataSource = dataSourceService.findByDatasourceId(datasourceId);
        //如果有sql引用datasource，则不允许删除
        List<DataQuery> dataQueries = dataQueryService.findByDataSourceId(datasourceId);
        if (CollectionUtil.isNotEmpty(dataQueries)) {
            log.error("该数据库正在被数据查询引用,不能删除");
            throw new BizException("该数据库正在被数据查询引用,不能删除");
        }
        dataSourceService.removeById(datasourceId);
    }


    /**
     * 验证数据源是否可用
     *
     * @param schemaName
     */
    @GetMapping("/available")
    public DatasourceStatus available(@RequestParam(required = false) String schemaName, @RequestParam(required = false) String datasourceId) {
        DataSource dataSource = null;
        if (StringUtils.isNotEmpty(schemaName)) {
            dataSource = dataSourceService.findBySchemaName(schemaName, null);
        } else if (StringUtils.isNotEmpty(datasourceId)) {
            dataSource = dataSourceService.findByDatasourceId(datasourceId);
        }

        assert dataSource != null;
        String schemaType = dataSource.getSchemaType();
        Map map = JsonUtils.jsonToMap(dataSource.getConnectData());
        return DataSourceUtils.available(schemaType, map);
    }

    /**
     * 数据源看连接测试
     *
     * @param config
     * @return
     */
    @PostMapping("/connect")
    public DatasourceStatus connect(@RequestBody DataSource config) {
        String schemaType = config.getSchemaType();
        Map map = new JSONObject(config.getConnectData());
        DatasourceStatus available = DataSourceUtils.available(schemaType, map);
        if (!available.getAvailable()) {
            throw new BizException(available.getMessage());
        }
        return available;
    }
}
