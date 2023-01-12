package com.cloudwise.lcap.datasource.engineer;

import org.apache.commons.lang3.StringUtils;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

public class SqlParse {
    public static String getDbAndTable(String sql) {
        String dbAndTable = null;
        sql = sql.replaceAll(" FROM ", " from ");
        if (sql.contains("from")) {
            int fromIndex = sql.indexOf("from");
            while (fromIndex >= 0 && sql.substring(fromIndex + 4).trim().split(" ")[0].contains("(")) {
                fromIndex = sql.indexOf("from", fromIndex + 1);
            }
            dbAndTable = sql.substring(fromIndex + 4).trim().split(" ")[0];
            if (dbAndTable.endsWith(")")) {
                dbAndTable = dbAndTable.replaceAll("\\)", "");
            }
        }
        return dbAndTable;
    }

    static SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    public static Object getValue(Object value) {
        if (null == value || StringUtils.isEmpty(value.toString())){
            return "";
        }else if(value instanceof Date || value instanceof LocalDate || value instanceof LocalDateTime){
            String date = simpleDateFormat.format(value);
            return date;
        }else if (value instanceof Integer || value instanceof Long){
            return Long.valueOf(value.toString());
        }else if(value instanceof Double || value instanceof Float){
            return Double.valueOf(value.toString());
        }else if (value instanceof Boolean){
           return Boolean.valueOf(value.toString());
        }else {
           return value.toString();
        }
    }


}
