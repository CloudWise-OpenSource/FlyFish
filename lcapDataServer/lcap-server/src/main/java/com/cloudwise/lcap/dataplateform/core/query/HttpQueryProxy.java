package com.cloudwise.lcap.dataplateform.core.query;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.SqlExecException;
import com.cloudwise.lcap.common.utils.DataUtils;
import com.cloudwise.lcap.dataplateform.core.calcite.http.HttpSchemaFactory;
import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;
import com.cloudwise.lcap.dataplateform.model.DataTable;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.schema.Schema;
import org.apache.calcite.schema.SchemaPlus;

import java.sql.*;
import java.util.*;

import static com.cloudwise.lcap.common.contants.Constant.SCHEMA_NAME;
import static com.cloudwise.lcap.common.contants.Constant.TABLE_NAME;


@Slf4j
public class HttpQueryProxy {

    /**
     * @param params 参数,如sql占位符参数，http请求占位符参数，jsonpath数据结构等
     * @return Object  查询返回的结果
     */
    public static JSONObject query(ExecuteBean params) throws SQLException, ClassNotFoundException {
        // sql解析及格式优化，如换行符移除，引号替换，分号移除等
        String sql = params.getSql().replaceAll("\\n", "")
                .replaceAll("\"", "'")
                .replaceAll(";", "");

        JSONObject result = new JSONObject();
        CalciteConnection calciteConnection = null;
        Statement statement = null;
        ResultSet resultSet = null;
        String schemaName = params.getSchemaName();
        try {
            Class.forName("org.apache.calcite.jdbc.Driver");
            /**
             * {@link org.apache.calcite.config.CalciteConnectionProperty}
             */
            Properties info = new Properties();
            info.setProperty("lex", "MYSQL");
            info.setProperty("remarks", "true");
            info.setProperty("conformance", "MYSQL_5");
            info.setProperty("calcite.default.charset","utf8");
            //info.setProperty("parserFactory", "org.apache.calcite.sql.parser.ddl.SqlDdlParserImpl#FACTORY");
            Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
            calciteConnection = connection.unwrap(CalciteConnection.class);
            SchemaPlus rootSchema = calciteConnection.getRootSchema();

//            List<String> dbAndTablesAlias = parseFormat(sql);
//            Map<String,String> dbAndTables = new HashMap<>();
//            for (String dbAndTable : dbAndTablesAlias) {
//                String[] split = dbAndTable.split("\\.");
//                if (split.length == 2 && StringUtils.isNotBlank(split[0]) && StringUtils.isNotBlank(split[1])){
//                    dbAndTables.put(split[0],split[1]);
//                }
//            }
//
//            DatabaseMetaData metaData = calciteConnection.getMetaData();
//            checkDbAndTableExists(dbAndTables,metaData);

            List<DataTable> executeBeanTables = params.getTables();
            JSONObject connectMeta = params.getConnectData();
            connectMeta.putIfAbsent(SCHEMA_NAME, schemaName);
            List<Map<String, Object>> tables = new ArrayList<>();
            if (CollectionUtil.isNotEmpty(executeBeanTables)) {
                for (DataTable httpTable : executeBeanTables) {
                    String tableName = httpTable.getTableName();
                    JSONObject tableMeta = httpTable.getTableMeta();

                    Map<String, Object> map1 = new HashMap<>();
                    map1.put(TABLE_NAME, tableName);
                    map1.putAll(tableMeta);
                    tables.add(map1);
                }
                connectMeta.put("tables", tables);
            }

            Schema schema = HttpSchemaFactory.INSTANCE.create(rootSchema, schemaName, connectMeta);
            rootSchema.add(schemaName, schema);

            Long taskId = params.getTaskId();
            log.info("==============数据查询==============");
            statement = calciteConnection.createStatement();
            resultSet = statement.executeQuery(sql);

           // JSONArray data = DataUtils.getResult(resultSet);
            List<Map<String,Object>> data = DataUtils.getResult2(resultSet);
            result.put("data", data);
            result.put("taskId",taskId);
            log.info("taskId:{},sql::{}" ,taskId, sql);
            log.info("==============数据查询结束==============");
        } catch (Exception e) {
            if (e instanceof BaseException) {
                throw new BaseException(e);
            }else if (e.getCause() instanceof BaseException){
                throw (BaseException)e.getCause();
            }

            log.error("http数据查询错误" + e);
            throw new SqlExecException("http数据查询错误");
        } finally {
            if (resultSet != null) {
                try {
                    if (!resultSet.isClosed()){
                        resultSet.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("resultSet close failed");
                }
            }
            if (statement != null) {
                try {
                    if (!statement.isClosed()){
                        statement.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
            if (calciteConnection != null) {
                try {
                    if (!calciteConnection.isClosed()){
                        calciteConnection.close();
                    }
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("statement close fialed");
                }
            }
        }
        return result;
    }


}
