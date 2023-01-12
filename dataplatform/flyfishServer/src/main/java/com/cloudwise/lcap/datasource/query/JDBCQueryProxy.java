package com.cloudwise.lcap.datasource.query;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;
import static com.cloudwise.lcap.commonbase.enums.ResultCode.DATA_SOURCE_CONNECT_PARAM_ERROR;
import static com.cloudwise.lcap.commonbase.enums.ResultCode.DATA_SOURCE_CONNECT_PARAM_NOT_FOUND;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.cloudwise.lcap.commonbase.dto.DataTableDto;
import com.cloudwise.lcap.commonbase.dto.DatasourceStatus;
import com.cloudwise.lcap.commonbase.entity.DataSource;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.exception.SqlExecException;
import com.cloudwise.lcap.commonbase.util.DataUtils;
import com.cloudwise.lcap.datasource.model.ExecuteBean;
import com.cloudwise.lcap.datasource.model.QueryResult;
import com.cloudwise.lcap.datasource.pool.DatasourceDriverManager;
import com.cloudwise.lcap.datasource.pool.DatasourcePool;
import com.cloudwise.lcap.datasource.pool.DbConnectConfig;

import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JDBCQueryProxy {

    public static QueryResult query(ExecuteBean params, String type, int maxConnect) {
        QueryResult result = new QueryResult();
        DatasourcePool pool = null;
        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        Long taskId = params.getTaskId();
        JSONObject connectData = params.getConnectData();

        // 阶段一：建立数据库连接
        try {
            String url = connectData.getStr("servers");
            validateUrl(url, type);
            String username = connectData.getStr("username");
            String password = connectData.getStr("password");
            String driver = getDriver(type);
            String poolName = url + username + password;
            if (!DatasourceDriverManager.pools.containsKey(poolName)) {
                DbConnectConfig configBean = DbConnectConfig.builder().driver(driver).url(url).username(username)
                    .password(password).maxConnectionCount(maxConnect).type(type).poolName(poolName).build();
                pool = DatasourceDriverManager.getPool(configBean);
            } else {
                pool = DatasourceDriverManager.pools.get(poolName);
            }

            if (null == pool) {
                log.error("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
                throw new SqlExecException("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
            }
            connection = pool.getConnection();
            if (connection.isClosed()) {
                connection = DriverManager.getConnection(url, username, password);
            }
        } catch (SQLException e) {
            log.error(type + "数据源连接失败" + e);
            throw new SqlExecException("数据源连接失败," + e);
        }
        // 阶段二：数据查询
        try {
            log.info("==============数据查询==============");
            String sql = params.getSql();
            if (POSTGRES.equalsIgnoreCase(type) ||DAMENG.equalsIgnoreCase(type) || ORACLE.equalsIgnoreCase(type) || SQL_SERVER.equalsIgnoreCase(type)) {
                sql = sql.replaceAll("`", "");
            }
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);

            List<Map<String, Object>> data = DataUtils.getResult(resultSet);
            result.setData(data);
            result.setTaskId(taskId);
            log.info("taskId:{},sql:{}", taskId, sql);
            log.info("==============数据查询结束==============");
        } catch (Exception e) {
            log.error(type + "数据查询执行失败" + e);
            throw new SqlExecException("数据查询执行失败," + e);
        } finally {
            pool.freeConnection(connection, statement, resultSet);
        }
        return result;
    }

    /**
     * 获取某个库下的表列表
     *
     * @param dataSourceConfig
     * @return
     */
    public static List<DataTableDto> getTableList(DataSource dataSourceConfig, int maxConnect, String type) {
        JSONObject connectData = new JSONObject(dataSourceConfig.getConnectData());
        String schemaName = dataSourceConfig.getSchemaName();
        String schemaType = dataSourceConfig.getSchemaType();
        String datasourceId = dataSourceConfig.getDatasourceId();
        String datasourceName = dataSourceConfig.getDatasourceName();
        String url = connectData.getStr("servers");
        validateUrl(url, type);
        String username = connectData.getStr("username");
        String password = connectData.getStr("password");

        DatasourcePool pool = null;
        Connection connection = null;
        ResultSet resultSet = null;
        try {
            String driver = getDriver(type);
            String poolName = url + username + password;
            if (!DatasourceDriverManager.pools.containsKey(poolName)) {
                DbConnectConfig configBean = DbConnectConfig.builder().driver(driver).url(url).username(username)
                    .password(password).maxConnectionCount(maxConnect).type(type).poolName(poolName).build();
                pool = DatasourceDriverManager.getPool(configBean);
            } else {
                pool = DatasourceDriverManager.pools.get(poolName);
            }
            if (null == pool) {
                log.error("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
                throw new SqlExecException("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
            }
            connection = pool.getConnection();
            String modelName = connectData.getStr("modelName");
            if (type.equalsIgnoreCase(POSTGRES) || type.equalsIgnoreCase(SQL_SERVER)) {
                resultSet = connection.getMetaData().getTables(schemaName, modelName, null, new String[] {"TABLE"});
            } else if (type.equalsIgnoreCase(ORACLE)) {
                resultSet = connection.getMetaData().getTables(null, modelName == null ? null : modelName.toUpperCase(), null,
                    new String[] {"TABLE"});
            } else {
                resultSet = connection.getMetaData().getTables(null, schemaName, null, new String[] {"TABLE"});
            }
            List<Map<String, Object>> tables = DataUtils.getResult(resultSet);

            List<DataTableDto> dataTables = new ArrayList<>();
            for (Map<String, Object> table : tables) {
                String table_name = (String)table.get("TABLE_NAME");
                DataTableDto build = DataTableDto.builder().tableId(table_name).tableName(table_name)
                    .datasourceId(datasourceId).datasourceName(datasourceName).schemaName(schemaName)
                    .schemaType(schemaType).modelName(StringUtils.isBlank(modelName) ? schemaName : modelName).build();
                dataTables.add(build);
            }
            return dataTables;
        } catch (Exception e) {
            log.error(type + "获取数据表元数据失败" + e);
            throw new SqlExecException(type + "获取数据表元数据失败");
        } finally {
            if (null != pool) {
                pool.freeConnection(connection, null, resultSet);
            }
        }
    }

    /**
     * 获取数据表详细信息：表结构、表的样例数据
     *
     * @param dataSourceConfig
     * @return
     */
    public static DataTableDto getTableDetail(DataSource dataSourceConfig, String tableName, DataTableDto dataTableDto,
        int maxConnect, String type) {
        JSONObject connectData = new JSONObject(dataSourceConfig.getConnectData());
        String schemaName = dataSourceConfig.getSchemaName();
        String url = connectData.getStr("servers");
        validateUrl(url, type);
        String username = connectData.getStr("username");
        String password = connectData.getStr("password");
        Connection connection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        DatasourcePool pool = null;
        try {
            String driver = getDriver(type);
            String poolName = url + username + password;
            if (!DatasourceDriverManager.pools.containsKey(poolName)) {
                DbConnectConfig configBean = DbConnectConfig.builder().driver(driver).url(url).username(username)
                    .password(password).maxConnectionCount(maxConnect).type(type).poolName(poolName).build();
                pool = DatasourceDriverManager.getPool(configBean);
            } else {
                pool = DatasourceDriverManager.pools.get(poolName);
            }
            if (null == pool) {
                log.error("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
                throw new SqlExecException("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
            }
            connection = pool.getConnection();
            DatabaseMetaData metaData = connection.getMetaData();
            if (type.equalsIgnoreCase(POSTGRES) || type.equalsIgnoreCase(SQL_SERVER)) {
                String modelName = connectData.getStr("modelName");
                resultSet = metaData.getColumns(schemaName, modelName, tableName, "%");
                schemaName = modelName;
            } else if (type.equalsIgnoreCase(ORACLE)) {
                String modelName = connectData.getStr("modelName");
                modelName = modelName == null ? null : modelName.toUpperCase();
                schemaName = modelName;
                tableName = tableName.toUpperCase();
                resultSet = metaData.getColumns(null, modelName, tableName, "%");
            } else {
                resultSet = metaData.getColumns(null, schemaName, tableName, "%");
            }

            List<Map<String, Object>> fieldMeta = DataUtils.getColumns(resultSet);

            JSONObject fields = new JSONObject();
            for (Map<String, Object> column : fieldMeta) {
                String fieldName = (String)column.get("COLUMN_NAME");
                String fieldType = (String)column.get("TYPE_NAME");
                fields.put(fieldName, fieldType);
            }
            dataTableDto.setFields(fields);
            if (StringUtils.isBlank(schemaName)) {
                schemaName = "default";
            }
            String exampleSql = "";
            if (type.equalsIgnoreCase(SQL_SERVER)) {
                exampleSql = "select top 10 * from " + tableName;
            } else if (type.equalsIgnoreCase(ORACLE)) {
                exampleSql = "select *  from (select * from " + schemaName + "." + tableName + ") where ROWNUM <= 10";
            } else {
                exampleSql = "select * from " + schemaName + "." + tableName + " limit 10";
            }
            statement = connection.createStatement();
            resultSet = statement.executeQuery(exampleSql);
            List<Map<String, Object>> exampleData = DataUtils.getResult(resultSet);
            dataTableDto.setExampleData(exampleData);
        } catch (Exception e) {
            log.error(type + "获取数据表结构失败" + e);
            if (e instanceof BaseException) {
                throw new BaseException(e);
            } else if (e.getCause() instanceof BaseException) {
                throw (BaseException)e.getCause();
            }
            throw new SqlExecException(type + "获取数据表结构失败");
        } finally {
            if (null != pool) {
                pool.freeConnection(connection, statement, resultSet);
            }
        }
        return dataTableDto;
    }

    public static DatasourceStatus available(String url, String username, String password, String type, String schemaName, String modelName) {
        DatasourceStatus datasourceStatus = DatasourceStatus.builder().available(true).build();
        validateUrl(url, type);
        Connection conn = null;
        try {
            Class.forName(getDriver(type));
            conn = DriverManager.getConnection(url, username, password);
            if (!conn.isValid(5000)) {
                datasourceStatus.setAvailable(false);
                datasourceStatus.setMessage("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
                return datasourceStatus;
            }
        } catch (Exception e) {
            log.error("数据源连接失败," + e.getMessage());
            datasourceStatus.setAvailable(false);
            datasourceStatus.setMessage("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
            return datasourceStatus;
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
        return datasourceStatus;
    }

    private static void validateUrl(String url, String type) {
        if (StringUtils.isEmpty(url)) {
            log.error("数据源连接地址缺失");
            throw new ParameterException(DATA_SOURCE_CONNECT_PARAM_NOT_FOUND);
        }
        if (!url.startsWith("jdbc") || !url.contains(type.toLowerCase())) {
            log.error("数据源连接信息错误");
            throw new ParameterException(DATA_SOURCE_CONNECT_PARAM_ERROR);
        }
    }

    private static String getDriver(String type) {
        switch (type.toLowerCase()) {
            case MYSQL:
                return MYSQL_DRIVER;
            case POSTGRES:
                return POSTGRES_DRIVER;
            case SQL_SERVER:
                return SQL_SERVER_DRIVER;
            case ORACLE:
                return ORACLE_DRIVER;
            case DAMENG:
                return DAMENG_DRIVER;
            case MARIA:
                return MARIA_DRIVER;
            case CLICKHOUSE:
                return CLICKHOUSE_DRIVER;
            default:
                break;
        }
        return null;
    }
}
