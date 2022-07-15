package com.cloudwise.lcap.test.udf;

import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class SqlStdOperatorTableTest {

    static Map<String,Object> fieldTypes = new HashMap<>();
    List<Class<?>> Tables= new ArrayList<>();
    List<Class<?>> Functions= new ArrayList<>();
    List<Class<?>> Lattices = new ArrayList<>();
    List<Class<?>> RelProtoDataTypes = new ArrayList<>();
    public static void main(String[] args) {
        Class<SqlStdOperatorTable> sqlStdOperatorTableClass = SqlStdOperatorTable.class;

        Field[] declaredFields = sqlStdOperatorTableClass.getDeclaredFields();
        for (Field declaredField : declaredFields) {
            List<Class<?>> clazzs= new ArrayList<>();
            Class suCl = declaredField.getClass().getSuperclass();
            while(suCl!=null){
                clazzs.add(suCl);
                suCl=suCl.getSuperclass();
            }
            fieldTypes.put(declaredField.getName(),clazzs);
        }
//        log.info("fieldTypes " + fieldTypes);
//        void add(String var1, Table var2);
//        void add(String var1, Function var2);
//        void add(String var1, RelProtoDataType var2);
//        void add(String var1, Lattice var2);
    }
}
