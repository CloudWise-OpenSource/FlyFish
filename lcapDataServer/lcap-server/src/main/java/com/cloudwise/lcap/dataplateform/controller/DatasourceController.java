package com.cloudwise.lcap.dataplateform.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.PageResult;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.exception.DataSourceConnectionException;
import com.cloudwise.lcap.common.exception.ParameterException;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.common.utils.ValidatorUtils;
import com.cloudwise.lcap.dataplateform.core.execute.DataSourceUtils;
import com.cloudwise.lcap.dataplateform.dao.DataSourceDao;
import com.cloudwise.lcap.dataplateform.dao.UnitSettingDao;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.model.DatasourceStatus;
import com.cloudwise.lcap.dataplateform.model.UnitSetting;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.cloudwise.lcap.common.contants.Constant.HTTP;
import static com.cloudwise.lcap.common.contants.Constant.SCHEMA_NAME;
import static com.cloudwise.lcap.common.utils.ValidatorUtils.validateLegalString;

/**
 * 数据源管理：数据源的增删改查
 *
 * @author yinqiqi
 */
@Slf4j
@RestController
@RequestMapping("datasource")
public class DatasourceController {
    // private static final Log log = LogFactory.getLog(DatasourceController.class);
    @Autowired
    private DataSourceDao dataSourceDao;
    @Value("${db_bathpath}")
    private String dbBathPath;

    @Autowired
    private UnitSettingDao unitSettingDao;

    /**
     * 添加数据源
     */
    @PostMapping
    public DataSourceConfig addDataSource(@RequestBody DataSourceConfig configInfo) {
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

        DataSourceConfig config2 = dataSourceDao.findByDatasourceName(datasourceName);
        if (null != config2) {
            log.error("数据源名称:{}重复", datasourceName);
            throw new ParameterException("数据源名称已存在");
        }
        configInfo.setSchemaName(schemaName);
        configInfo.setDatasourceName(datasourceName);

        connectData.remove("datasourceName");
        connectData.remove("schemaName");

        Map<String, Object> map = new HashMap<>(connectData);
        map.put(SCHEMA_NAME, schemaName);
        configInfo.setConnectData(connectData.toString());
        DatasourceStatus status = DataSourceUtils.available(schemaType, map);
        if (!status.getAvailable()) {
            log.error("数据源连接测试失败,请确认连接配置信息," + status.getMessage());
            throw new DataSourceConnectionException("数据源连接测试失败,msg:" + status.getMessage());
        }

        return dataSourceDao.save(configInfo);
    }


    /**
     * 修改数据源
     *
     * @param config
     */
    @PostMapping("/update")
    public void update(@RequestBody DataSourceConfig config) {
        String datasourceId = config.getDatasourceId();
        //可能修改schemaName，修改确保修改时不重名
        DataSourceConfig config1 = dataSourceDao.findByDatasourceId(datasourceId);
        if (null == config1) {
            log.error("参数缺失或参数不正确，datasourceId:{},查询到的DataSourceConfig:{}", datasourceId, config1);
            throw new ParameterException("数据源不存在,datasourceId=" + datasourceId);
        }
        String schemaType = StringUtils.isNotBlank(config.getSchemaType()) ? config.getSchemaType() : config1.getSchemaType();
        //http数据源下已经有数据表时，不允许修改
//        if (HTTP.equalsIgnoreCase(schemaType) && CollectionUtil.isNotEmpty(config1.getTables())){
//            log.error("数据源信息已经被数据表使用,请先移除数据表");
//            throw new RejectedException("数据源信息已经被数据表使用,请先移除数据表");
//        }
        String connectData = config.getConnectData();
        Map<String, Object> map = new JSONObject(connectData);
        String schemaName = config.getSchemaName();
        String datasourceName = config.getDatasourceName();
        if (StringUtils.isEmpty(schemaName)) {
            schemaName = (String) map.get(SCHEMA_NAME);
            config.setSchemaName(schemaName);
        }
        if (!schemaType.equalsIgnoreCase(HTTP) && !ValidatorUtils.varValidate(schemaName)) {
            log.error("数据库名称不符合规则,schemaName=" + schemaName);
            throw new ParameterException("数据库不符合规则,仅支持数字、英文字母和下划线,并且不能是纯数字");
        }
        if (!validateLegalString(datasourceName)) {
            log.error("数据源名称不符合规则,datasourceName:{}", datasourceName);
            log.error("数据源名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
            throw new ParameterException("数据源名称不符合规则,不能包含 ~!#%^&*=+\\/\\\\|{};: 等特殊字符");
        }

        if (StringUtils.isNotEmpty(datasourceName) && !schemaName.equals(config1.getDatasourceName())) {
            //数据源名称被修改
            DataSourceConfig config2 = dataSourceDao.findByDatasourceName(datasourceName);
            if (null != config2 && !config2.getDatasourceId().equals(datasourceId)) {
                log.error("数据源名称:{}重复", datasourceName);
                throw new ParameterException("数据源名称重复");
            }
        }

        DatasourceStatus status = DataSourceUtils.available(config.getSchemaType(), map);
        if (!status.getAvailable()) {
            log.error("数据源连接测试失败,请确认连接配置信息," + status.getMessage());
            throw new DataSourceConnectionException("数据源连接失败,请确认连接配置信息");
        }
        dataSourceDao.update(config);
    }

    /**
     * 条件查询，支持分页
     *
     * @param datasourceName
     * @param schemaName
     * @return
     */
    @GetMapping("/findAll")
    public PageResult<DataSourceConfig> queryDataSource(
            @RequestParam(required = false, defaultValue = "0") Integer pageNo,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String datasourceName,
            @RequestParam(required = false) String schemaName) {
        if (!validateLegalString(datasourceName)) {
            return new PageResult<>(pageNo, pageSize, 0L, new ArrayList<>());
        }
        return dataSourceDao.findDataSource(pageNo, pageSize, datasourceName, schemaName);
    }


    @GetMapping
    public DataSourceConfig detail(@RequestParam String datasourceId) {

        return dataSourceDao.findByDatasourceId(datasourceId);
    }


    /**
     * 删除数据源
     *
     * @param datasourceId
     */
    @PostMapping("/deleteById/{datasourceId}")
    public void update(@PathVariable String datasourceId) {
        DataSourceConfig config = dataSourceDao.findByDatasourceId(datasourceId);
        //如果有sql引用datasource，则不允许删除
        List<UnitSetting> unitSettings = unitSettingDao.findByDatasourceId(datasourceId);
        if (CollectionUtil.isNotEmpty(unitSettings)) {
            log.error("该数据库正在被数据查询引用,不能删除");
            throw new BizException("该数据库正在被数据查询引用,不能删除");
        }

        dataSourceDao.deleteByDatasourceId(datasourceId);
    }


    /**
     * 验证数据源是否可用
     *
     * @param schemaName
     */
    @GetMapping("/available")
    public DatasourceStatus available(@RequestParam(required = false) String schemaName, @RequestParam(required = false) String datasourceId) {
        DataSourceConfig config = null;
        if (StringUtils.isNotEmpty(schemaName)) {
            config = dataSourceDao.findBySchemaName(schemaName);
        } else if (StringUtils.isNotEmpty(datasourceId)) {
            config = dataSourceDao.findByDatasourceId(datasourceId);
        }

        String schemaType = config.getSchemaType();
        Map map = JsonUtils.jsonToMap(config.getConnectData());
        return DataSourceUtils.available(schemaType, map);
    }

    /**
     * 数据源看连接测试
     *
     * @param config
     * @return
     */
    @PostMapping("/connect")
    public DatasourceStatus connect(@RequestBody DataSourceConfig config) {
        String schemaType = config.getSchemaType();
        Map map = new JSONObject(config.getConnectData());
        DatasourceStatus available = DataSourceUtils.available(schemaType, map);
        if (!available.getAvailable()) {
            throw new BizException(available.getMessage());
        }
        return available;
    }
}
