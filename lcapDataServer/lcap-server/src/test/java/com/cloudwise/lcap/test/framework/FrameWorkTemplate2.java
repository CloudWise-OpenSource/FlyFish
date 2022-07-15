package com.cloudwise.lcap.test.framework;

import cn.hutool.json.JSONArray;
import com.alibaba.druid.pool.DruidDataSource;
import com.cloudwise.lcap.common.utils.DataUtils;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.adapter.jdbc.JdbcConvention;
import org.apache.calcite.adapter.jdbc.JdbcSchema;
import org.apache.calcite.config.Lex;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.jdbc.CalcitePrepare;
import org.apache.calcite.linq4j.tree.Expression;
import org.apache.calcite.plan.ConventionTraitDef;
import org.apache.calcite.rel.RelDistributionTraitDef;
import org.apache.calcite.rel.RelNode;
import org.apache.calcite.rel.RelRoot;
import org.apache.calcite.rel.type.RelDataTypeSystem;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.Schemas;
import org.apache.calcite.server.CalciteServerStatement;
import org.apache.calcite.sql.*;
import org.apache.calcite.sql.dialect.MysqlSqlDialect;
import org.apache.calcite.sql.fun.SqlStdOperatorTable;
import org.apache.calcite.sql.parser.SqlParser;
import org.apache.calcite.sql.parser.SqlParserPos;
import org.apache.calcite.sql.type.*;
import org.apache.calcite.sql.util.ListSqlOperatorTable;
import org.apache.calcite.sql.validate.SqlValidator;
import org.apache.calcite.tools.*;

import java.sql.*;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import static com.cloudwise.lcap.common.contants.Constant.MYSQL_DRIVER;

/**
 * 基于sql语句使用 Planner 分析、校验后得到 RelNode。并且测试了对where filed=xxx 条件查询语句包含中文时的乱码解决方案
 * 解决方式就是在创建 schema时指定SqlDialect，并且这里直接重写了 mysqlSqlDialect 的 quoteStringLiteral 方法。
 * 此外，在 FrameworkConfig 中还加入了自定义算子。
 */
@Slf4j
public class FrameWorkTemplate2 {

    public static final SqlFunction MAP1 = new SqlFunction(
            "MAP1",
            SqlKind.OTHER_FUNCTION,
            ReturnTypes.TO_MAP.andThen(SqlTypeTransforms.FORCE_NULLABLE),
            null,
            OperandTypes.COLLECTION_OR_MAP,
            SqlFunctionCategory.SYSTEM);


    public static final SqlFunction FUNC1 = new SqlFunction(
            new SqlIdentifier("FUNC1", SqlParserPos.ZERO),
            ReturnTypes.cascade(ReturnTypes.explicit(SqlTypeName.INTEGER), SqlTypeTransforms.TO_NULLABLE),
            InferTypes.VARCHAR_1024,
            OperandTypes.family(SqlTypeFamily.STRING),
            Lists.newArrayList(new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT).createSqlType(SqlTypeName.VARCHAR)),
            SqlFunctionCategory.USER_DEFINED_FUNCTION);

    public static final SqlFunction FUNC2 = new SqlFunction(
            new SqlIdentifier("FUNC2", SqlParserPos.ZERO),
            ReturnTypes.cascade(ReturnTypes.explicit(SqlTypeName.VARCHAR), SqlTypeTransforms.TO_NULLABLE),
            InferTypes.FIRST_KNOWN,
            OperandTypes.family(SqlTypeFamily.INTEGER),
            Lists.newArrayList(new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT).createSqlType(SqlTypeName.INTEGER)),
            SqlFunctionCategory.USER_DEFINED_FUNCTION);

    static ListSqlOperatorTable listSqlOperatorTable = new ListSqlOperatorTable();

    static {
        listSqlOperatorTable.add(MAP1);
        listSqlOperatorTable.add(FUNC1);
        listSqlOperatorTable.add(FUNC2);
        listSqlOperatorTable.getOperatorList().addAll(SqlStdOperatorTable.instance().getOperatorList());
    }

    static SqlParser.Config sqlParserConfig = SqlParser.config().withLex(Lex.JAVA).withCaseSensitive(true);
    static SqlValidator.Config sqlValidatorConfig = SqlValidator.Config.DEFAULT.withIdentifierExpansion(true);


    public static void main(String[] args) throws Exception {

        Class.forName("org.apache.calcite.jdbc.Driver");
        Properties info = new Properties();
        info.setProperty("lex", "JAVA");
        info.setProperty("remarks", "true");
        Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
        CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
        SchemaPlus rootSchema = calciteConnection.getRootSchema();

        Statement statement = calciteConnection.createStatement();
        CalciteServerStatement calciteServerStatement = statement.unwrap(CalciteServerStatement.class);
        CalcitePrepare.Context prepareContext = calciteServerStatement.createPrepareContext();
        //CalcitePrepare.Context prepareContext = calciteConnection.createPrepareContext();

//        DruidDataSource basicDataSource = new DruidDataSource();
//        basicDataSource.setUrl("jdbc:mysql://127.0.0.1:3306/ff_platform?createDatabaseIfNotExist=false&useSSL=false");
//        basicDataSource.setUsername("root");
//        basicDataSource.setPassword("12345678");
//        basicDataSource.setDriverClassName(MYSQL_DRIVER);

//        DruidDataSource basicDataSource = new DruidDataSource();
//        basicDataSource.setUrl("jdbc:mysql://10.0.9.204:3306/ff_platform?createDatabaseIfNotExist=false&useSSL=false&characterEncoding=UTF-8");
//        basicDataSource.setUsername("root");
//        basicDataSource.setPassword("Cloudwise@123");
//        basicDataSource.setDriverClassName(MYSQL_DRIVER);
//        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
//        Expression expression = Schemas.subSchemaExpression(rootSchema, "ff_platform", JdbcSchema.class);
//        JdbcConvention convention = JdbcConvention.of(dialect, expression, "ff_platform");
//        JdbcSchema schema = new JdbcSchema(basicDataSource, dialect, convention, null, "ff_platform");
//        //Schema schema = JdbcSchema.create(rootSchema, "test", basicDataSource, instance,null, "test");
//        rootSchema.add("ff_platform", schema);
//        String sql2 = "select createdate,MAP(channel) as channels from test.sale group by createdate";
//        String sql3 = "select * from test.sale where channel='wechat'";
//        String sql4 = "select * from test.sale  where channel='sql3'";
//        String sql9 = "select MAP['渠道',channel,'标号',id] as info from test.sale";
//        String sql10 = "select DAYOFYEAR(createdate) as info from test.sale";
//        String sql14 = "select * from ff_platform.data_store a where a.name='z2-咨询'";
//        String sql15 = "SELECT `type`, COUNT(1) FROM `ff_platform`.`data_store` GROUP BY `type`";

        DruidDataSource basicDataSource = new DruidDataSource();
        basicDataSource.setUrl("jdbc:mysql://10.2.3.56:3306/test?createDatabaseIfNotExist=false&useSSL=false&characterEncoding=UTF-8");
        basicDataSource.setUsername("Rootmaster");
        basicDataSource.setPassword("Rootmaster@777");
        basicDataSource.setDriverClassName(MYSQL_DRIVER);
        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
        Expression expression = Schemas.subSchemaExpression(rootSchema, "test", JdbcSchema.class);
        JdbcConvention convention = JdbcConvention.of(dialect, expression, "test");
        JdbcSchema schema = new JdbcSchema(basicDataSource, dialect, convention, null, "test");
        rootSchema.add("test", schema);
        String sql15 = "SELECT * from test.sales";

        SqlParser.Config  sqlParserConfig = SqlParser.config().withLex(Lex.JAVA).withCaseSensitive(true);
        SqlValidator.Config sqlValidatorConfig = SqlValidator.Config.DEFAULT.withIdentifierExpansion(true);
        FrameworkConfig frameworkConfig = Frameworks.newConfigBuilder()
                .defaultSchema(rootSchema).parserConfig(sqlParserConfig).sqlValidatorConfig(sqlValidatorConfig)
                // //添加一个专们用于添加函数的 listSqlOperatorTable
                .operatorTable(listSqlOperatorTable)
                .traitDefs(ConventionTraitDef.INSTANCE, RelDistributionTraitDef.INSTANCE).build();

        try {
            //也可以基于  parse->validate->rel 生成 RelRoot
            Planner planner = Frameworks.getPlanner(frameworkConfig);
            SqlNode sqlNodeParser = planner.parse(sql15);
            SqlNode sqlNodeValidate = planner.validate(sqlNodeParser);
            RelRoot relRoot = planner.rel(sqlNodeValidate);
            RelNode relNode = relRoot.project();
            //另一种方式生成RelNode
//            RelBuilder relBuilder = RelBuilder.create(frameworkConfig);
//            RelBuilder project = relBuilder.scan("test", "sale").project(relBuilder.field("date"));
//            RelNode relNode1 = project.build();

            RelRunner relRunner = prepareContext.getRelRunner();
            PreparedStatement prepare = relRunner.prepareStatement(relNode);
            ResultSet resultSet = prepare.executeQuery();
            List<Map<String, Object>> result1 = DataUtils.getResult(resultSet);
            for (Object o : result1) {
                log.info("o=" + o.toString());
            }


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static String sqlNodeToSql(SqlNode sqlNode) {
        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
        return sqlNode.toSqlString(dialect).getSql();
    }


    private static class TestMysqlSqlDialect extends MysqlSqlDialect {
        public TestMysqlSqlDialect(Context context) {
            super(context);
        }

        // 下发sql时，去除编码前缀,直接拼接原字符。·
        @Override
        public void quoteStringLiteral(StringBuilder buf, String charsetName, String val) {
            buf.append(this.literalQuoteString);
            buf.append(val.replace(this.literalEndQuoteString, this.literalEscapedQuote));
            buf.append(this.literalEndQuoteString);
        }
    }

}
