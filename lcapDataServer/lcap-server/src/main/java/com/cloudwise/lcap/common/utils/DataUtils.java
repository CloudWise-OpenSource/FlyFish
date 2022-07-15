package com.cloudwise.lcap.common.utils;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.avatica.ColumnMetaData;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.sql.*;
import java.sql.Date;
import java.util.*;

import static com.cloudwise.lcap.common.utils.DataTypeMapping.getValue;
import static org.apache.calcite.avatica.ColumnMetaData.Rep.*;

@Slf4j
public class DataUtils {


    public static List<JSONObject> metaDataBuild(DatabaseMetaData databaseMetaData, String schemaName) throws SQLException {
        //获取schema列表
        ResultSet resultSet = databaseMetaData.getSchemas(null, schemaName);
        List<Map<String, Object>> schemas = getResult(resultSet);
        List<JSONObject> schemasMeta = new ArrayList<>();
        for (Map<String, Object> o : schemas) {
            String tableCatalog = (String) o.get("TABLE_CATALOG");
            String schemaName1 = (String) o.get("TABLE_SCHEM");
            if (StringUtils.isNotEmpty(schemaName) && !StringUtils.equalsIgnoreCase(schemaName, schemaName1)) {
                continue;
            }
            //获取表列表
            ResultSet tables = databaseMetaData.getTables(null, schemaName1, null, new String[]{"TABLE", "VIEW"});
            List<Map<String, Object>>  tables1 = getResult(tables);

            JSONArray tableList = new JSONArray();
            for (Map<String, Object> o2 : tables1) {
                String tableName = (String) o2.get("TABLE_NAME");
                //获取表字段
                ResultSet columns = null;
                try {
                    columns = databaseMetaData.getColumns(tableCatalog, schemaName1, tableName, "%");
                } catch (SQLException e) {
                    e.printStackTrace();
                    log.error("获取表结构失败");
                    continue;
                }
                List<Map<String, Object>> columns1 = getResult(columns);
                JSONObject fields = new JSONObject();
                for (Map<String, Object> o4 : columns1) {
                    String fieldName = (String) o4.get("COLUMN_NAME");
                    String fieldType = (String) o4.get("TYPE_NAME");

                    fields.put(fieldName, fieldType);
                }
                JSONObject table = new JSONObject();
                table.put("tableName", tableName);
                table.put("fields", fields);
                tableList.add(table);
            }
            JSONObject schema = new JSONObject();
            schema.put("schemaName", schemaName);
            schema.put("tables", tableList);
            schemasMeta.add(schema);
        }
        return schemasMeta;
    }

    public static JSONObject getTable(DatabaseMetaData databaseMetaData, String schemaName, String tableName) throws SQLException {
        //获取schema列表
        ResultSet resultSet = databaseMetaData.getSchemas(null, schemaName);
        List<Map<String, Object>> schemas = getResult(resultSet);
        JSONObject table = new JSONObject();
        for (Map<String, Object> o : schemas) {
            String tableCatalog = (String) o.get("TABLE_CATALOG");
            if (StringUtils.equalsIgnoreCase(schemaName, (String) o.get("TABLE_SCHEM"))) {
                //获取表
                ResultSet tableSet = databaseMetaData.getTables(tableCatalog, schemaName, "%" + tableName + "%", new String[]{"TABLE", "VIEW"});
                List<Map<String, Object>> tables = getResult(tableSet);

                for (Map<String, Object> o2 : tables) {
                    if (StringUtils.equalsIgnoreCase(tableName, (String) o2.get("TABLE_NAME"))) {
                        //获取表字段
                        ResultSet columns = databaseMetaData.getColumns(tableCatalog, schemaName, tableName, "%");
                        List<Map<String, Object>> columns1 = getResult(columns);
                        JSONObject fields = new JSONObject();
                        for (Map<String, Object> column : columns1) {
                            String fieldName = (String) column.get("COLUMN_NAME");
                            String fieldType = (String) column.get("TYPE_NAME");

                            fields.put(fieldName, fieldType);
                        }
                        table.put("tableName", tableName);
                        table.put("fields", fields);
                        break;
                    }
                }
                break;
            }
        }
        return table;
    }


    public static List<Map<String, Object>> getResult(ResultSet resultSet) {
        List<Map<String, Object>> array = new ArrayList<>();
        try {
            ResultSetMetaData rsmd = resultSet.getMetaData();
            while (resultSet.next()) {
                Map<String, Object> object = new LinkedHashMap<>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    String columnLabel = rsmd.getColumnLabel(i);
                    String columnName = StringUtils.isNotBlank(columnLabel) ? columnLabel : rsmd.getColumnName(i);
                    ColumnMetaData.Rep type = getType(rsmd.getColumnType(i));
                    String o = resultSet.getString(columnName);
                    Object value = getValue(type.clazz, o);
                    object.put(columnName, value);
                }
                if (object.size() > 0) {
                    array.add(object);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return array;
    }

    public static List<Map<String,Object>> getResult2(ResultSet resultSet) {
        List<Map<String,Object>> array = new ArrayList<>();
        try {
            ResultSetMetaData rsmd = resultSet.getMetaData();
            while (resultSet.next()) {
                Map<String,Object> object = new HashMap<>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    String columnLabel = rsmd.getColumnLabel(i);
                    String columnName = StringUtils.isNotBlank(columnLabel) ? columnLabel : rsmd.getColumnName(i);
                    int columnType = rsmd.getColumnType(i);
                    ColumnMetaData.Rep type = getType(columnType);
                    Object o = null;
                    try {
                        o = type.jdbcGet(resultSet, i);
                    } catch (Exception e) {
                        o = resultSet.getString(columnName);
                    }
                    if (null != o && StringUtils.isNotBlank(o.toString())){
                        switch (type){
                            case PRIMITIVE_LONG:
                                o = Long.parseLong(o.toString());
                                break;
                            case PRIMITIVE_DOUBLE:
                                o =Double.parseDouble(o.toString());
                            default:
                                break;
                        }
                    }
                    object.put(columnName, o);
                }
                array.add(object);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return array;
    }

    static ColumnMetaData.Rep[] values = ColumnMetaData.Rep.values();

    static List<ColumnMetaData.Rep> intType = new ArrayList<>();
    static List<ColumnMetaData.Rep> doubleType = new ArrayList<>();
    static {
        intType.add(PRIMITIVE_BYTE);
        intType.add(PRIMITIVE_SHORT);
        intType.add(PRIMITIVE_INT);
        intType.add(PRIMITIVE_LONG);
        intType.add(BYTE);
        intType.add(SHORT);
        intType.add(INTEGER);
        intType.add(LONG);

        doubleType.add(PRIMITIVE_FLOAT);
        doubleType.add(PRIMITIVE_DOUBLE);
        doubleType.add(FLOAT);
        doubleType.add(DOUBLE);
    }

    public static ColumnMetaData.Rep getType(int var) {
        for (ColumnMetaData.Rep value : values) {
            if (value.typeId == var) {
                if (intType.contains(value)){
                    return PRIMITIVE_LONG;
                }else if (doubleType.contains(value)){
                    return PRIMITIVE_DOUBLE;
                }
                return value;
            }
        }

        return ColumnMetaData.Rep.STRING;
    }




}
