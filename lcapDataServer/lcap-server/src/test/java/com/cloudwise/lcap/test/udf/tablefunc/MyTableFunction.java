package com.cloudwise.lcap.test.udf.tablefunc;

import com.google.common.collect.ImmutableList;
import org.apache.calcite.adapter.java.AbstractQueryableTable;
import org.apache.calcite.linq4j.Enumerable;
import org.apache.calcite.linq4j.Linq4j;
import org.apache.calcite.linq4j.QueryProvider;
import org.apache.calcite.linq4j.Queryable;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.schema.QueryableTable;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.sql.type.SqlTypeName;

import java.util.List;

/**
 * A table function that returns a {@link QueryableTable}.
 */
public class MyTableFunction {

    public QueryableTable eval(int latest) {
        // Argument is null in case SQL contains function call with expression.
        // Then the engine calls a function with null arguments to get getRowType.

        return new AbstractQueryableTable(Integer.class) {
            List<Integer> items = ImmutableList.of(1, 3, latest);
            Enumerable<Integer> enumerable = Linq4j.asEnumerable(items);

            @Override
            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                return typeFactory.builder().add("c", SqlTypeName.INTEGER).build();
            }

            @Override
            public <E> Queryable<E> asQueryable(QueryProvider queryProvider, SchemaPlus schema, String tableName) {
                //noinspection unchecked
                return (Queryable<E>) enumerable.asQueryable();
            }
        };

    }
}
