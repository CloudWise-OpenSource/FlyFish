package com.cloudwise.lcap.dataplateform.core.query;

import cn.hutool.json.JSONObject;
import com.alibaba.druid.pool.DruidDataSource;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.ParameterException;
import com.cloudwise.lcap.common.exception.SqlExecException;
import com.cloudwise.lcap.common.utils.DataUtils;
import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;
import com.cloudwise.lcap.dataplateform.dto.DataTableDto;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.model.DatasourceStatus;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.cloudwise.lcap.common.contants.Constant.*;
import static com.cloudwise.lcap.common.enums.ResultCode.DATA_SOURCE_CONNECT_PARAM_ERROR;
import static com.cloudwise.lcap.common.enums.ResultCode.DATA_SOURCE_CONNECT_PARAM_NOT_FOUND;

@Slf4j
public class JDBCQueryProxy {


    public static JSONObject query(ExecuteBean params,String type) {
        JSONObject result = new JSONObject();
        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        String sql = params.getSql();
        Long taskId = params.getTaskId();
        JSONObject connectData = params.getConnectData();
        String servers = connectData.getStr("servers");
        validateUrl(servers,type);
        String username = connectData.getStr("username");
        String password = connectData.getStr("password");
        try {
            log.info("==============数据查询==============");
            DruidDataSource dataSource = getDataSource(type);
            dataSource.setUrl(servers);
            dataSource.setUsername(username);
            dataSource.setPassword(password);
            connection = dataSource.getConnection();
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            List<Map<String,Object>> data = DataUtils.getResult2(resultSet);
            result.put("data", data);
            result.put("taskId", taskId);
            log.info("taskId:{},sql:", taskId, sql);
            log.info("==============数据查询结束==============");
        } catch (Exception e) {
            log.error(type+"数据查询执行失败" + e);
            throw new SqlExecException(type+"数据查询执行失败");
        } finally {
            if (resultSet != null) {
                try {
                    if (!resultSet.isClosed()) {
                        resultSet.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("resultSet close failed");
                }
            }
            if (statement != null) {
                try {
                    if (!statement.isClosed()) {
                        statement.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
            if (connection != null) {
                try {
                    if (!connection.isClosed()) {
                        connection.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
        }
        return result;
    }


    /**
     * 获取某个库下的表列表
     *
     * @param dataSourceConfig
     * @return
     */
    public static List<DataTableDto> getTableList(DataSourceConfig dataSourceConfig,String type) {
        Connection connection = null;
        JSONObject connectData = new JSONObject(dataSourceConfig.getConnectData());
        String schemaName = dataSourceConfig.getSchemaName();
        String schemaType = dataSourceConfig.getSchemaType();
        String datasourceId = dataSourceConfig.getDatasourceId();
        String datasourceName = dataSourceConfig.getDatasourceName();
        String servers = connectData.getStr("servers");
        validateUrl(servers,type);
        String username = connectData.getStr("username");
        String password = connectData.getStr("password");
        try {
            DruidDataSource dataSource = getDataSource(type);
            dataSource.setUrl(servers);
            dataSource.setUsername(username);
            dataSource.setPassword(password);
            connection = dataSource.getConnection();
            DatabaseMetaData metaData = connection.getMetaData();
            ResultSet tables1 = null;
            if(type.equalsIgnoreCase(POSTGRES) ){
                String modelName = connectData.getStr("modelName");
                tables1 = metaData.getTables(schemaName, modelName, null, new String[]{"TABLE"});
            }else if(type.equalsIgnoreCase(ORACLE)){
                String modelName = connectData.getStr("modelName");
                tables1 = metaData.getTables(null, modelName == null?null:modelName.toUpperCase(), null, new String[]{"TABLE"});
            }else {
                tables1 = metaData.getTables(null, schemaName, null, new String[]{"TABLE"});
            }
            List<Map<String,Object>> tables = DataUtils.getResult2(tables1);

            List<DataTableDto> dataTables = new ArrayList<>();
            for (Map<String,Object> table : tables) {
                String table_name = (String)table.get("TABLE_NAME");
                DataTableDto build = DataTableDto.builder().tableId(table_name).tableName(table_name)
                        .datasourceId(datasourceId).datasourceName(datasourceName).schemaName(schemaName)
                        .schemaType(schemaType).modelName(schemaName).build();
                dataTables.add(build);
            }
            return dataTables;
        } catch (Exception e) {
            log.error(type+"获取数据表元数据失败" + e);
            throw new SqlExecException(type+"获取数据表元数据失败");
        } finally {
            if (connection != null) {
                try {
                    if (!connection.isClosed()) {
                        connection.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
        }
    }

    /**
     * 获取数据表详细信息：表结构、表的样例数据
     *
     * @param dataSourceConfig
     * @return
     */
    public static DataTableDto getTableDetail(DataSourceConfig dataSourceConfig, String tableName, DataTableDto dataTableDto,String type) {
        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        JSONObject connectData = new JSONObject(dataSourceConfig.getConnectData());
        String schemaName = dataSourceConfig.getSchemaName();
        String servers = connectData.getStr("servers");
        validateUrl(servers,type);
        String username = connectData.getStr("username");
        String password = connectData.getStr("password");
        try {
            DruidDataSource dataSource = getDataSource(type);
            dataSource.setUrl(servers);
            dataSource.setUsername(username);
            dataSource.setPassword(password);
            connection = dataSource.getConnection();
            DatabaseMetaData metaData = connection.getMetaData();
            if(type.equalsIgnoreCase(POSTGRES) ){
                String modelName = connectData.getStr("modelName");
                resultSet = metaData.getColumns(schemaName, modelName, tableName, "%");
                schemaName = modelName;
            }else if(type.equalsIgnoreCase(ORACLE)){
                String modelName = connectData.getStr("modelName");
                modelName = modelName == null?null:modelName.toUpperCase();
                schemaName = modelName;
                tableName = tableName.toUpperCase();
                resultSet = metaData.getColumns(null, modelName , tableName, "%");
            }else {
                resultSet = metaData.getColumns(null, schemaName, tableName, "%");
            }

            List<Map<String,Object>> fieldMeta = DataUtils.getResult2(resultSet);

            JSONObject fields = new JSONObject();
            for (Map<String,Object> column : fieldMeta) {
                String fieldName = (String)column.get("COLUMN_NAME");
                String fieldType = (String)column.get("TYPE_NAME");
                fields.put(fieldName, fieldType);
            }
            dataTableDto.setFields(fields);
            if(StringUtils.isBlank(schemaName)){
                schemaName = "default";
            }
            String exampleSql = "";
            if(type.equalsIgnoreCase(ORACLE)){
                exampleSql = "select *  from (select * from " + schemaName + "." + tableName + ") where ROWNUM <= 10";
            }else if(type.equalsIgnoreCase(SQLSERVER)){
                exampleSql = "select top 10 * from " + schemaName + "." + tableName ;
            } else{
                exampleSql = "select * from " + schemaName + "." + tableName + " limit 10";
            }
            statement = connection.createStatement();
            resultSet = statement.executeQuery(exampleSql);
            List<Map<String, Object>> exampleData = DataUtils.getResult(resultSet);
            dataTableDto.setExampleData(exampleData);
        } catch (Exception e) {
            log.error(type+"获取数据表结构失败" + e);
            if (e instanceof BaseException) {
                throw new BaseException(e);
            }else if (e.getCause() instanceof BaseException){
                throw (BaseException)e.getCause();
            }
            throw new SqlExecException(type+"获取数据表结构失败");
        } finally {
            if (resultSet != null) {
                try {
                    if (!resultSet.isClosed()) {
                        resultSet.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("resultSet close failed");
                }
            }
            if (statement != null) {
                try {
                    if (!statement.isClosed()) {
                        statement.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
            if (connection != null) {
                try {
                    if (!connection.isClosed()) {
                        connection.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
        }
        return dataTableDto;
    }


    public static DatasourceStatus available(String servers,String username,String password,String type) {
        DatasourceStatus datasourceStatus = DatasourceStatus.builder().available(true).build();
        Connection connection = null;
        validateUrl(servers,type);
        try {
            DruidDataSource dataSource = getDataSource(type);
            dataSource.setUrl(servers);
            dataSource.setUsername(username);
            dataSource.setPassword(password);
            connection = dataSource.getConnection();
        } catch (SQLException e) {
            log.error("数据源连接失败," + e.getMessage());
            datasourceStatus.setAvailable(false);
            datasourceStatus.setMessage("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
        } finally {
            if (null != connection) {
                try {
                    if (!connection.isClosed()) {
                        connection.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return datasourceStatus;
    }


    private static void validateUrl(String url,String type) {
        if (StringUtils.isEmpty(url)) {
            log.error("数据源连接地址缺失");
            throw new ParameterException(DATA_SOURCE_CONNECT_PARAM_NOT_FOUND);
        }
        if (!url.startsWith("jdbc") || !url.contains(type)) {
            log.error("数据源连接信息错误");
            throw new ParameterException(DATA_SOURCE_CONNECT_PARAM_ERROR);
        }
    }


    private static DruidDataSource getDataSource(String type) {
        DruidDataSource dataSource = new DruidDataSource();
        if(StringUtils.isBlank(type)){
            log.error("数据库类型（type）不能为空");
            throw new ParameterException(DATA_SOURCE_CONNECT_PARAM_ERROR);
        }
        switch (type.toLowerCase()) {
            case MYSQL:
                dataSource.setDriverClassName(MYSQL_DRIVER);
                break;
            case POSTGRES:
                dataSource.setDriverClassName(POSTGRES_DRIVER);
                break;
            case ORACLE:
                dataSource.setDriverClassName(ORACLE_DRIVER);
                break;
            case CLICKHOUSE:
                dataSource.setDriverClassName(CLICKHOUSE_DRIVER);
                break;
            case SQLSERVER:
                dataSource.setDriverClassName(SQL_SERVER_DRIVER);
                dataSource.setValidationQuery("select 1");
                break;
            case DAMENG:
                dataSource.setDriverClassName(DAMENG_DRIVER);
                break;
            case MARIA:
                dataSource.setDriverClassName(MARIA_DRIVER);
                break;
            default:
                break;
        }
        //        dataSource.setInitialSize(10);
//        dataSource.setMaxActive(100);
//        dataSource.setMinIdle(10);
//        dataSource.setMaxWait(3000);
//        //取消测试
//        dataSource.setTestWhileIdle(false);
//        ////指明是否在从池中取出连接前进行检验,如果检验失败,则从池中去除连接并尝试取出另一个.
        dataSource.setTestOnBorrow(true);
        dataSource.setPoolPreparedStatements(true);
        dataSource.setMaxOpenPreparedStatements(10);
//        //destroy线程执行回收回收任务的间隔
        dataSource.setTimeBetweenEvictionRunsMillis(10000);
//        //连接回收的超时时间
        dataSource.setRemoveAbandonedTimeoutMillis(10000);
//        ////1000 * 60 * 30  连接在池中保持空闲而不被空闲连接回收器线程,(如果有)回收的最小时间值，单位毫秒
//        dataSource.setMinEvictableIdleTimeMillis(30000);
//        dataSource.setKeepAlive(true);
        //请求失败之后中断
        dataSource.setBreakAfterAcquireFailure(true);
        // 失败后重连的次数
        dataSource.setConnectionErrorRetryAttempts(2);
        //等待 2000 毫秒
        dataSource.setMaxWait(10000);
        dataSource.addConnectionProperty("remarks", "true");
        dataSource.addConnectionProperty("useInformationSchema", "true");
        return dataSource;
    }

}
