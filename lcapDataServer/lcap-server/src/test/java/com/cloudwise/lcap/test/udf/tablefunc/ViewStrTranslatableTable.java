package com.cloudwise.lcap.test.udf.tablefunc;

import com.google.common.collect.ImmutableList;
import org.apache.calcite.schema.TranslatableTable;
import org.apache.calcite.schema.impl.ViewTable;
import org.apache.calcite.sql.dialect.CalciteSqlDialect;
import org.apache.calcite.sql.type.SqlTypeName;

import java.util.Arrays;

public class ViewStrTranslatableTable {
    public static TranslatableTable strView(String s) {
        return new ViewTable(Object.class,
                typeFactory -> typeFactory.builder().add("c", SqlTypeName.VARCHAR, 100).build(),
                "values (" + CalciteSqlDialect.DEFAULT.quoteStringLiteral(s) + ")",
                ImmutableList.of(),
                Arrays.asList("view"));

    }

    public static TranslatableTable strView2(Object o, Object p) {
        return new ViewTable(Object.class, typeFactory -> typeFactory.builder().add("c", SqlTypeName.VARCHAR, 100).build(),
                "values " + CalciteSqlDialect.DEFAULT.quoteStringLiteral(o.toString()) + ", " + CalciteSqlDialect.DEFAULT.quoteStringLiteral(p.toString()),
                ImmutableList.of(),
                Arrays.asList("view"));
    }
}
