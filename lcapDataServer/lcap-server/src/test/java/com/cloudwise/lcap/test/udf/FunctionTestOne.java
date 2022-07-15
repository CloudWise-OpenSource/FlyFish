package com.cloudwise.lcap.test.udf;

import com.google.common.collect.Lists;
import org.apache.calcite.avatica.util.Casing;
import org.apache.calcite.jdbc.CalciteSchema;
import org.apache.calcite.plan.RelOptUtil;
import org.apache.calcite.rel.RelRoot;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.rel.type.RelDataTypeSystem;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.impl.AbstractTable;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.sql.parser.SqlParser;
import org.apache.calcite.sql.parser.SqlParserPos;
import org.apache.calcite.sql.type.*;
import org.apache.calcite.sql.util.ChainedSqlOperatorTable;
import org.apache.calcite.sql.util.ListSqlOperatorTable;
import org.apache.calcite.tools.FrameworkConfig;
import org.apache.calcite.tools.Frameworks;
import org.apache.calcite.tools.Planner;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import static org.apache.calcite.sql.SqlExplainLevel.ALL_ATTRIBUTES;

/**
 * Author yuqi
 * Time 11/5/19 09:35
 **/
public class FunctionTestOne {
    public static final SqlTypeFactoryImpl TYPE_FACTORY = new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT);
    public static final RelDataTypeSystem TYPE_SYSTEM = RelDataTypeSystem.DEFAULT;

    public static final SqlFunction FUNC1 = new SqlFunction(
            new SqlIdentifier("FUNC1", SqlParserPos.ZERO),
            ReturnTypes.cascade(ReturnTypes.explicit(SqlTypeName.INTEGER), SqlTypeTransforms.TO_NULLABLE),
            InferTypes.VARCHAR_1024,
            OperandTypes.family(SqlTypeFamily.STRING),
            Lists.newArrayList(TYPE_FACTORY.createSqlType(SqlTypeName.VARCHAR)),
            SqlFunctionCategory.USER_DEFINED_FUNCTION);

    public static final SqlFunction FUNC2 = new SqlFunction(
            new SqlIdentifier("FUNC2", SqlParserPos.ZERO),
            ReturnTypes.cascade(ReturnTypes.explicit(SqlTypeName.VARCHAR), SqlTypeTransforms.TO_NULLABLE),
            InferTypes.FIRST_KNOWN,
            OperandTypes.family(SqlTypeFamily.INTEGER),
            Lists.newArrayList(TYPE_FACTORY.createSqlType(SqlTypeName.INTEGER)),
            SqlFunctionCategory.USER_DEFINED_FUNCTION);

    public static void main(String[] args) {
        CalciteSchema rootSchema = CalciteSchema.createRootSchema(false, false);

        //添加表Test
        rootSchema.add("test", new AbstractTable() {
            @Override
            public RelDataType getRowType(RelDataTypeFactory typeFactory) {
                RelDataTypeFactory.Builder builder = new RelDataTypeFactory
                        .Builder(TYPE_FACTORY);
                //列id, 类型int
                builder.add("id", new BasicSqlType(TYPE_SYSTEM, SqlTypeName.INTEGER));
                //列name, 类型为varchar
                builder.add("name", new BasicSqlType(TYPE_SYSTEM, SqlTypeName.VARCHAR));
                builder.add("time_str", new BasicSqlType(TYPE_SYSTEM, SqlTypeName.VARCHAR));
                return builder.build();
            }
        });

        SqlParser.ConfigBuilder builder = SqlParser.configBuilder();
        //以下需要设置成大写并且忽略大小写
        builder.setQuotedCasing(Casing.TO_UPPER);
        builder.setUnquotedCasing(Casing.TO_UPPER);
        builder.setCaseSensitive(false);

        //now test func
        ListSqlOperatorTable listSqlOperatorTable = new ListSqlOperatorTable();
        listSqlOperatorTable.add(FUNC1);
        listSqlOperatorTable.add(FUNC2);
        List<SqlOperatorTable> tableList = new ArrayList<>();
        tableList.add(listSqlOperatorTable);
        tableList.add(SqlStdOperatorTable.instance());
        final FrameworkConfig frameworkConfig = Frameworks.newConfigBuilder()
                .defaultSchema(rootSchema.plus())
                .parserConfig(builder.build())
                //添加一个专们用于添加函数的 listSqlOperatorTable
                .operatorTable(new ChainedSqlOperatorTable(tableList))
                .build();
        SchemaPlus defaultSchema = frameworkConfig.getDefaultSchema();

        Set<String> functionNames = defaultSchema.getFunctionNames();

        Planner planner = Frameworks.getPlanner(frameworkConfig);

        //now start to parser

        try {
            Planner planner1 = Frameworks.getPlanner(frameworkConfig);
            SqlNode originSqlNode = planner1.parse("select name, timestr2long(time_str) from test where id < 5");
            SqlNode sqlNode = planner1.validate(originSqlNode);
            RelRoot root = planner1.rel(sqlNode);
            System.out.println(RelOptUtil.toString(root.rel, ALL_ATTRIBUTES));

            Planner planner2 = Frameworks.getPlanner(frameworkConfig);
            SqlNode func1SqlNodeOrg = planner2.parse("select func1(name) from test where id > 4");
            SqlNode func1SqlNode = planner2.validate(func1SqlNodeOrg);
            RelRoot func1Root = planner2.rel(func1SqlNode);
            System.out.println("-------- func1 test -------");
            System.out.println(RelOptUtil.toString(func1Root.rel, ALL_ATTRIBUTES));

            Planner planner3 = Frameworks.getPlanner(frameworkConfig);
            SqlNode func2SqlNodeOrg = planner3.parse("select func2(id) from test where id > 4");
            SqlNode func2SqlNode = planner3.validate(func2SqlNodeOrg);
            RelRoot func2Root = planner3.rel(func2SqlNode);
            System.out.println("-------- func2 test -------");
            System.out.println(RelOptUtil.toString(func2Root.rel, ALL_ATTRIBUTES));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
