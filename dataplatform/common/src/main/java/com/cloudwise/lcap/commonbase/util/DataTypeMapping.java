package com.cloudwise.lcap.commonbase.util;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
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

    public static Table<String, String,Class> TYPEMAPPING= HashBasedTable.create();
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
        TYPEMAPPING.put(DataTypeMapping.CHAR,DataTypeMapping.CHAR,Character.class);
        TYPEMAPPING.put(DataTypeMapping.VARCHAR,DataTypeMapping.VARCHAR,String.class);
        TYPEMAPPING.put(DataTypeMapping.STRING,DataTypeMapping.VARCHAR,String.class);
        TYPEMAPPING.put(DataTypeMapping.BOOLEAN,DataTypeMapping.BOOLEAN,Boolean.class);
        TYPEMAPPING.put(DataTypeMapping.INT,DataTypeMapping.INTEGER,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.INTEGER,DataTypeMapping.INTEGER,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.TINYINT, DataTypeMapping.TINYINT,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.SMALLINT, DataTypeMapping.SMALLINT,Integer.class);
        TYPEMAPPING.put(DataTypeMapping.BIGINT, DataTypeMapping.BIGINT,Long.class);
        TYPEMAPPING.put(DataTypeMapping.LONG, DataTypeMapping.BIGINT,Long.class);
        TYPEMAPPING.put(DataTypeMapping.DECIMAL, DataTypeMapping.DECIMAL, BigDecimal.class);
        TYPEMAPPING.put(DataTypeMapping.NUMERIC, DataTypeMapping.DECIMAL,Long.class);
        TYPEMAPPING.put(DataTypeMapping.FLOAT, DataTypeMapping.FLOAT,Float.class);
        TYPEMAPPING.put(DataTypeMapping.REAL, DataTypeMapping.REAL,Double.class);
        TYPEMAPPING.put(DataTypeMapping.DOUBLE, DataTypeMapping.DOUBLE,Double.class);
        TYPEMAPPING.put(DataTypeMapping.DATE,DataTypeMapping.DATE,LocalDateTime.class);
        TYPEMAPPING.put(DataTypeMapping.TIME, DataTypeMapping.TIME, Time.class);
        TYPEMAPPING.put(DataTypeMapping.DATETIME, DataTypeMapping.DATE, LocalDateTime.class);
        TYPEMAPPING.put(DataTypeMapping.TIMESTAMP, DataTypeMapping.TIMESTAMP,Long.class);
        TYPEMAPPING.put(DataTypeMapping.ARRAY, DataTypeMapping.ARRAY, List.class);
        TYPEMAPPING.put(DataTypeMapping.MAP, DataTypeMapping.MAP, Map.class);
        TYPEMAPPING.put(DataTypeMapping.ANY, DataTypeMapping.ANY,String.class);
    }
    /**
     * 根据名字获取，对应的java类型
     * */
    public static Class getJavaClassByName(String name){
        Set<Table.Cell<String, String,Class>> table = TYPEMAPPING.cellSet();
        for(Table.Cell<String, String,Class> it:table){
            if(it.getRowKey().equalsIgnoreCase(name)){
                Class value = it.getValue();
                return value;
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
        if (Boolean.class.isAssignableFrom(clazz) || boolean.class.isAssignableFrom(clazz)) {
            return Boolean.valueOf(value);
        } else if (Byte.class.isAssignableFrom(clazz) || byte.class.isAssignableFrom(clazz)) {
            return Byte.valueOf(value);
        } else if (Short.class.isAssignableFrom(clazz) || short.class.isAssignableFrom(clazz)) {
            return Short.valueOf(value);
        } else if (Integer.class.isAssignableFrom(clazz) || int.class.isAssignableFrom(clazz)) {
            return Integer.valueOf(value);
        } else if (Long.class.isAssignableFrom(clazz) || long.class.isAssignableFrom(clazz)){
            return Long.valueOf(value);
        }else if (Float.class.isAssignableFrom(clazz) || float.class.isAssignableFrom(clazz)) {
            return Float.valueOf(value);
        }else if (Double.class.isAssignableFrom(clazz) || double.class.isAssignableFrom(clazz)){
            return Double.valueOf(value);
        }else if (Timestamp.class.isAssignableFrom(clazz)) {
            //return Timestamp.valueOf(value);
            return value;
        } else if (Date.class.isAssignableFrom(clazz)) {
            return Date.valueOf(value);
        } else if (BigDecimal.class.isAssignableFrom(clazz)) {
            return BigDecimal.valueOf(Long.parseLong(value));
        } else if (Array.class.isAssignableFrom(clazz)) {
            return Arrays.asList(value);
        } else if (List.class.isAssignableFrom(clazz)) {
            return Arrays.asList(value);
        } else if (Object.class.isAssignableFrom(clazz)) {
            return value;
        }

        return value;
    }

}