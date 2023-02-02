package com.cloudwise.lcap.commonbase.util;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.sql.*;
import java.sql.Date;
import java.util.*;

import static com.cloudwise.lcap.commonbase.util.DataTypeMapping.getValue;

@Slf4j
public class DataUtils {

    public static List<Map<String, Object>> getResult(ResultSet resultSet) {
        List<Map<String, Object>> array = new ArrayList<>();
        try {
            ResultSetMetaData rsmd = resultSet.getMetaData();
            while (resultSet.next()) {
                Map<String, Object> object = new LinkedHashMap<>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    String columnLabel = rsmd.getColumnLabel(i);
                    String columnName = StringUtils.isNotBlank(columnLabel) ? columnLabel : rsmd.getColumnName(i);
                    int columnType = rsmd.getColumnType(i);
                    Object value = getValue(columnType, resultSet, columnName);
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

    public static List<Map<String, Object>> getColumns(ResultSet resultSet) {
        List<Map<String, Object>> array = new ArrayList<>();
        try {
            ResultSetMetaData rsmd = resultSet.getMetaData();
            while (resultSet.next()) {
                Map<String, Object> object = new LinkedHashMap<>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    String columnLabel = rsmd.getColumnLabel(i);
                    String columnName = StringUtils.isNotBlank(columnLabel) ? columnLabel : rsmd.getColumnName(i);
                    if (columnName.equals("COLUMN_NAME")||columnName.equals("TYPE_NAME")) {
                        int columnType = rsmd.getColumnType(i);
                        Object value = getValue(columnType, resultSet, columnName);
                        object.put(columnName, value);
                    }
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

    public static Object getValue(int var, ResultSet rsmd, String columnName) {
        try {
            if (var == Types.VARBINARY || var == Types.VARCHAR || var == Types.CHAR
                    || var == Types.LONGVARCHAR || var == Types.BINARY || var == Types.LONGVARBINARY) {
                return rsmd.getString(columnName);
            } else if (var == Types.DATE) {
                return Objects.isNull(rsmd.getDate(columnName)) ? null : rsmd.getDate(columnName).toString();
            } else if (var == Types.TIME) {
                return Objects.isNull(rsmd.getTime(columnName)) ? null : rsmd.getTime(columnName).toString();
            } else if (var == Types.TIMESTAMP) {
                return Objects.isNull(rsmd.getTimestamp(columnName)) ? null : rsmd.getTimestamp(columnName).toString();
            } else if (var == Types.TINYINT || var == Types.SMALLINT || var == Types.INTEGER) {
                return rsmd.getInt(columnName);
            } else if (var == Types.BIGINT) {
                return rsmd.getInt(columnName);
            } else if (var == Types.FLOAT || var == Types.DOUBLE) {
                return rsmd.getDouble(columnName);
            } else if (var == Types.REAL) {
                return rsmd.getBoolean(columnName);
            }else {
                return rsmd.getString(columnName);
            }
        } catch (SQLException e) {
            log.error("数据从ResultSet中获取解析错误:{}",e);
            return null;
        }
    }


}
