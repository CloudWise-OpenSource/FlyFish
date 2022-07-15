package com.cloudwise.lcap.test.udf.tablefunc;

import com.google.common.collect.ImmutableList;
import org.apache.calcite.schema.TranslatableTable;
import org.apache.calcite.schema.impl.ViewTable;
import org.apache.calcite.sql.type.SqlTypeName;

import java.util.Arrays;

public class ViewTranslatableTable {
    public static TranslatableTable view(String s) {
        return new ViewTable(Object.class,
                typeFactory -> typeFactory.builder().add("c", SqlTypeName.INTEGER).build(),
                "values (1), (3), " + s,
                ImmutableList.of(),
                Arrays.asList("view"));
    }
}
