package com.cloudwise.lcap.common.utils;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import org.apache.calcite.sql.type.SqlTypeName;
import org.apache.commons.lang3.StringUtils;

import java.math.BigDecimal;
import java.sql.Array;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 这里使用了GUAVA的table 作为存SQL和JAVA数据类型的数据结构
 * 这并不是一个好的设计，而是为了让大家更容易理解而做的设计
 */
public class DataTypeMapping {

    public static Table<String, SqlTypeName,Class> TYPEMAPPING= HashBasedTable.create();
    public static final String CHAR = "char";
    public static final String VARCHAR = "varchar";
    public static final String STRING = "string";
    public static final String BOOLEAN = "boolean";
    public static final String INT = "int";
    public static final String INTEGER = "integer";
    public static final String TINYINT = "tinyint";
    public static final String SMALLINT = "smallint";
    public static final String BIGINT = "bigint";
    public static final String LONG = "long";
    public static final String DECIMAL = "decimal";
    public static final String NUMERIC = "numeric";
    public static final String FLOAT = "float";
    public static final String REAL = "real";
    public static final String DOUBLE = "double";
    public static final String DATE = "date";
    public static final String TIME = "time";
    public static final String DATETIME = "datetime";
    public static final String TIMESTAMP = "timestamp";
    public static final String ARRAY = "array";
    public static final String MAP = "map";
    public static final String ANY = "any";
    static{
        TYPEMAPPING.put(DataTypeMapping.CHAR,SqlTypeName.CHAR,Character.class);
        TYPEMAPPING.put(DataTypeMapping.VARCHAR,SqlTypeName.VARCHAR,String.class);
        TYPEMAPPING.put(DataTypeMapping.STRING,SqlTypeName.VARCHAR,String.class);
        TYPEMAPPING.put(DataTypeMapping.BOOLEAN,SqlTypeName.BOOLEAN,Boolean.class);
        TYPEMAPPING.put(DataTypeMapping.INT,SqlTypeName.INTEGER,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.INTEGER,SqlTypeName.INTEGER,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.TINYINT, SqlTypeName.TINYINT,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.SMALLINT, SqlTypeName.SMALLINT,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.BIGINT, SqlTypeName.BIGINT,Long.class);
        TYPEMAPPING.put(DataTypeMapping.LONG, SqlTypeName.BIGINT,Long.class);
        TYPEMAPPING.put(DataTypeMapping.DECIMAL, SqlTypeName.DECIMAL, BigDecimal.class);
        TYPEMAPPING.put(DataTypeMapping.NUMERIC, SqlTypeName.DECIMAL,Long.class);
        TYPEMAPPING.put(DataTypeMapping.FLOAT, SqlTypeName.FLOAT,Float.class);
        TYPEMAPPING.put(DataTypeMapping.REAL, SqlTypeName.REAL,Double.class);
        TYPEMAPPING.put(DataTypeMapping.DOUBLE, SqlTypeName.DOUBLE,Double.class);
        TYPEMAPPING.put(DataTypeMapping.DATE,SqlTypeName.DATE,LocalDateTime.class);
        TYPEMAPPING.put(DataTypeMapping.TIME, SqlTypeName.TIME, Time.class);
        TYPEMAPPING.put(DataTypeMapping.DATETIME, SqlTypeName.DATE, LocalDateTime.class);
        TYPEMAPPING.put(DataTypeMapping.TIMESTAMP, SqlTypeName.TIMESTAMP,Long.class);
        TYPEMAPPING.put(DataTypeMapping.ARRAY, SqlTypeName.ARRAY, List.class);
        TYPEMAPPING.put(DataTypeMapping.MAP, SqlTypeName.MAP, Map.class);
        TYPEMAPPING.put(DataTypeMapping.ANY, SqlTypeName.ANY,String.class);
    }
    /**
     * 根据名字获取，对应的java类型
     * */
    public static Class getJavaClassByName(String name){
        Set<Table.Cell<String, SqlTypeName,Class>> table = TYPEMAPPING.cellSet();
        for(Table.Cell<String, SqlTypeName,Class> it:table){
            if(it.getRowKey().equalsIgnoreCase(name)){
                Class value = it.getValue();
                return value;
            }
        }
        return null;
    }

    public static SqlTypeName getSqlTypeByName(String name){
        Set<Table.Cell<String, SqlTypeName, Class>> cells = TYPEMAPPING.cellSet();
        for(Table.Cell<String, SqlTypeName,Class> it: cells){
            if(it.getRowKey().equalsIgnoreCase(name)){
                return it.getColumnKey();
            }
        }
        return null;
    }

    public static String getJavaType(Object data){
        if (data instanceof String){
            return VARCHAR;
        }else if (data instanceof Boolean){
            return BOOLEAN;
        }else if (data instanceof Integer){
            return INTEGER;
        }else if (data instanceof Double){
            return DOUBLE;
        }else if (data instanceof Date){
            return DATE;
        }else if (data instanceof Time){
            return TIME;
        }else if (data instanceof BigDecimal){
            return BIGINT;
        } else if (data instanceof Collection){
            return ARRAY;
        } else if (data instanceof Map){
            return MAP;
        }
        return VARCHAR;
    }

    /**
     * @param clazz
     * @param value
     * @return
     */
    public static Object getValue(Class clazz, String value) {
        if (StringUtils.isEmpty(value)) {
            return value;
        }
        if (Boolean.class.getName().equals(clazz.getName()) || "boolean".equals(clazz.getName())) {
            return Boolean.valueOf(value);
        } else if (Byte.class.getName().equals(clazz.getName()) || "byte".equals(clazz.getName())) {
            return Byte.valueOf(value);
        } else if (Short.class.getName().equals(clazz.getName()) || "short".equals(clazz.getName())) {
            return Short.valueOf(value);
        } else if (Integer.class.getName().equals(clazz.getName()) || "int".equals(clazz.getName()) || Long.class.getName().equals(clazz.getName()) || "long".equals(clazz.getName())) {
            return Long.valueOf(value);
        } else if (Float.class.getName().equals(clazz.getName()) || "float".equals(clazz.getName()) || Double.class.getName().equals(clazz.getName()) || "double".equals(clazz.getName())) {
            return Double.valueOf(value);
        } else if (Timestamp.class.getName().equals(clazz.getName())) {
            //return Timestamp.valueOf(value);
            return value;
        } else if (Date.class.getName().equals(clazz.getName())) {
            return Date.valueOf(value);
        } else if (BigDecimal.class.getName().equals(clazz.getName())) {
            return BigDecimal.valueOf(Long.parseLong(value));
        } else if (Array.class.getName().equals(clazz.getName())) {
            return Arrays.asList(value);
        } else if (List.class.getName().equals(clazz.getName())) {
            return Arrays.asList(value);
        } else if (Object.class.getName().equals(clazz.getName())) {
            return value;
        }
        return value;
    }

}