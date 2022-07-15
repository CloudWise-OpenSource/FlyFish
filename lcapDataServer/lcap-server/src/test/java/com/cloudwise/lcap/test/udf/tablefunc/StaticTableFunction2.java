package com.cloudwise.lcap.test.udf.tablefunc;

import com.cloudwise.lcap.test.udf.hr.Department;
import com.cloudwise.lcap.test.udf.hr.Employee;
import com.cloudwise.lcap.test.udf.hr.HrSchema;
import org.apache.calcite.adapter.java.AbstractQueryableTable;
import org.apache.calcite.adapter.java.JavaTypeFactory;
import org.apache.calcite.linq4j.Enumerator;
import org.apache.calcite.linq4j.Linq4j;
import org.apache.calcite.linq4j.QueryProvider;
import org.apache.calcite.linq4j.Queryable;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.schema.QueryableTable;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.impl.AbstractTableQueryable;

import java.util.Arrays;
import java.util.List;

/** Factory for EMP and DEPT tables. */
public class StaticTableFunction2{

    public QueryableTable create(String name) {
        final Class clazz;
        final Object[] array;
        switch (name) {
            case "EMPLOYEES":
                clazz = Employee.class;
                array = new HrSchema().emps;
                break;
            case "DEPARTMENTS":
                clazz = Department.class;
                array = new HrSchema().depts;
                break;
            default:
                throw new AssertionError(name);
        }
        return new AbstractQueryableTable(clazz) {

            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                return ((JavaTypeFactory) typeFactory).createType(clazz);
            }

            public <T> Queryable<T> asQueryable(QueryProvider queryProvider, SchemaPlus schema, String tableName) {
                return new AbstractTableQueryable<T>(queryProvider, schema, this, tableName) {
                    public Enumerator<T> enumerator() {
                        @SuppressWarnings("unchecked")
                        final List<T> list = (List) Arrays.asList(array);
                        return Linq4j.enumerator(list);
                    }
                };
            }


        };
    }
}