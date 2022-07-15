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
import org.apache.calcite.jdbc.CalciteSchema;
import org.apache.calcite.linq4j.tree.Expression;
import org.apache.calcite.plan.*;
import org.apache.calcite.plan.hep.HepPlanner;
import org.apache.calcite.plan.hep.HepProgramBuilder;
import org.apache.calcite.prepare.CalciteCatalogReader;
import org.apache.calcite.rel.RelDistributionTraitDef;
import org.apache.calcite.rel.RelNode;
import org.apache.calcite.rel.RelRoot;
import org.apache.calcite.rel.core.JoinRelType;
import org.apache.calcite.rel.rel2sql.RelToSqlConverter;
import org.apache.calcite.rel.rel2sql.SqlImplementor;
import org.apache.calcite.rel.rules.PruneEmptyRules;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeSystem;
import org.apache.calcite.rex.RexBuilder;
import org.apache.calcite.schema.Schema;
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
import org.apache.calcite.sql.validate.*;
import org.apache.calcite.sql2rel.RelDecorrelator;
import org.apache.calcite.sql2rel.SqlToRelConverter;
import org.apache.calcite.tools.*;

import java.sql.*;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import static com.cloudwise.lcap.common.contants.Constant.MYSQL_DRIVER;

/**
 * 两种转型：
 * sql -> relNode （relNode 是 prepareContext.getRelRunner().prepareStatement 可执行的）
 * sql -> sqlNode （sqlNode 不能直接执行）
 * 同样：relNode->SQL  sqlNode->sql
 * 那么是否存在转换 sqlNode -> relNode 或者 relNode->sqlNode
 *
 */
@Slf4j
public class FrameWorkTemplate {
    public static final SqlFunction FUNC1 = new SqlFunction(
            "MAP",
            SqlKind.OTHER_FUNCTION,
            ReturnTypes.TO_MAP.andThen(SqlTypeTransforms.FORCE_NULLABLE),
            null,
            OperandTypes.COLLECTION_OR_MAP,
            SqlFunctionCategory.SYSTEM);


    public static final SqlFunction FUNC2 = new SqlFunction(
            new SqlIdentifier("FUNC1", SqlParserPos.ZERO),
            ReturnTypes.cascade(ReturnTypes.explicit(SqlTypeName.INTEGER), SqlTypeTransforms.TO_NULLABLE),
            InferTypes.VARCHAR_1024,
            OperandTypes.family(SqlTypeFamily.STRING),
            Lists.newArrayList(new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT).createSqlType(SqlTypeName.VARCHAR)),
            SqlFunctionCategory.USER_DEFINED_FUNCTION);

    public static final SqlFunction FUNC3 = new SqlFunction(
            new SqlIdentifier("FUNC2", SqlParserPos.ZERO),
            ReturnTypes.cascade(ReturnTypes.explicit(SqlTypeName.VARCHAR), SqlTypeTransforms.TO_NULLABLE),
            InferTypes.FIRST_KNOWN,
            OperandTypes.family(SqlTypeFamily.INTEGER),
            Lists.newArrayList(new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT).createSqlType(SqlTypeName.INTEGER)),
            SqlFunctionCategory.USER_DEFINED_FUNCTION);

    static ListSqlOperatorTable listSqlOperatorTable = new ListSqlOperatorTable();
    static {
        listSqlOperatorTable.add(FUNC1);
        listSqlOperatorTable.add(FUNC2);
        listSqlOperatorTable.getOperatorList().addAll(SqlStdOperatorTable.instance().getOperatorList());
    }


    /**
     * 此处，sql转换为 RelNode，然后 RelNode 被 RelRunner 执行
     * @param args
     * @throws Exception
     */
    public static void main(String[] args) throws Exception {
        //TODO this
        Class.forName("org.apache.calcite.jdbc.Driver");
        Properties info = new Properties();
        info.setProperty("lex", "JAVA");
        info.setProperty("remarks", "true");
        info.setProperty("fun", "standard,mysql,postgresql,spark");
        Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
        CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
        SchemaPlus rootSchema = calciteConnection.getRootSchema();

        Statement statement = calciteConnection.createStatement();
        CalciteServerStatement calciteServerStatement = statement.unwrap(CalciteServerStatement.class);
        CalcitePrepare.Context prepareContext = calciteServerStatement.createPrepareContext();
        //CalcitePrepare.Context prepareContext = calciteConnection.createPrepareContext();

        DruidDataSource basicDataSource = new DruidDataSource();
        basicDataSource.setUrl("jdbc:mysql://127.0.0.1:3306/test?createDatabaseIfNotExist=true&useSSL=false");
        basicDataSource.setUsername("root");
        basicDataSource.setPassword("12345678");
        basicDataSource.setDriverClassName(MYSQL_DRIVER);
        //这是默认创建 Schema 的方式，会导致查询条件中文乱码
        //Schema schema = JdbcSchema.create(rootSchema, "test", basicDataSource, instance,null, "test");
        //默认情况下会查询条件中文乱码，所以重写 MysqlSqlDialect 的 quoteStringLiteral 方法
        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
        Expression expression = Schemas.subSchemaExpression(rootSchema, "test", JdbcSchema.class);
        JdbcConvention convention = JdbcConvention.of(dialect, expression, "test");
        JdbcSchema schema = new JdbcSchema(basicDataSource, dialect, convention, null, "test");
        rootSchema.add("test", schema);

        SqlParser.Config  sqlParserConfig = SqlParser.config().withLex(Lex.JAVA).withCaseSensitive(true);
        SqlValidator.Config sqlValidatorConfig = SqlValidator.Config.DEFAULT.withIdentifierExpansion(true);
        FrameworkConfig frameworkConfig = Frameworks.newConfigBuilder()
                .defaultSchema(rootSchema)
                .parserConfig(sqlParserConfig)
                .sqlValidatorConfig(sqlValidatorConfig)
                // //添加一个专们用于添加函数的 listSqlOperatorTable
                .operatorTable(listSqlOperatorTable)
                .traitDefs(ConventionTraitDef.INSTANCE, RelDistributionTraitDef.INSTANCE).build();

        try {

            //RelRoot 的获取方式有三种，sql->RelNode sqlNode->relNode 手动构建RelNode(见 example4)
            //也可以基于  parse->validate->rel 生成 RelRoot
            String sql = "select * from test.sale";
            Planner planner = Frameworks.getPlanner(frameworkConfig);
            SqlNode parseSqlNode = planner.parse(sql);
            SqlNode validateSqlNode = planner.validate(parseSqlNode);
            RelRoot relRoot = planner.rel(validateSqlNode);
            //System.out.println(RelOptUtil.toString(relRoot.rel, ALL_ATTRIBUTES));
            RelNode relNode = relRoot.project();

            ////////////////////////////运行 relNode////////////////////////////////////////////
            PreparedStatement prepare = prepareContext.getRelRunner().prepareStatement(relNode);
            ResultSet resultSet = prepare.executeQuery();
            List<Map<String, Object>> result1 = DataUtils.getResult(resultSet);
            for (Object o : result1) {
                log.info("o=" + o.toString());
            }


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * sql -> SqlNode，而sqlNode 不能被执行
     * @param sql
     * @return
     * @throws Exception
     */
    public static SqlNode sqlToSqlNode(String sql) throws Exception {
        //TODO this
        Class.forName("org.apache.calcite.jdbc.Driver");
        Properties info = new Properties();
        info.setProperty("lex", "JAVA");
        info.setProperty("remarks", "true");
        info.setProperty("fun", "standard,mysql,postgresql,spark");
        Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
        CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
        SchemaPlus rootSchema = calciteConnection.getRootSchema();

        //Statement statement = calciteConnection.createStatement();
//        CalciteServerStatement calciteServerStatement = statement.unwrap(CalciteServerStatement.class);
//        CalcitePrepare.Context prepareContext = calciteServerStatement.createPrepareContext();
        CalcitePrepare.Context prepareContext = calciteConnection.createPrepareContext();

        DruidDataSource basicDataSource = new DruidDataSource();
        basicDataSource.setUrl("jdbc:mysql://127.0.0.1:3306/test?createDatabaseIfNotExist=true&useSSL=false");
        basicDataSource.setUsername("root");
        basicDataSource.setPassword("12345678");
        basicDataSource.setDriverClassName(MYSQL_DRIVER);
        Schema schema = JdbcSchema.create(rootSchema, "test", basicDataSource, null, "test");
        rootSchema.add("test", schema);

        SqlTypeFactoryImpl sqlTypeFactory = new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT);
        CalciteCatalogReader calciteCatalogReader = new CalciteCatalogReader(prepareContext.getRootSchema(), prepareContext.getDefaultSchemaPath(), sqlTypeFactory, calciteConnection.config());
        // sql解析器
        SqlParser parser = SqlParser.create(sql, SqlParser.Config.DEFAULT);
        SqlValidator sqlValidator = SqlValidatorUtil.newValidator(SqlStdOperatorTable.instance(), calciteCatalogReader, sqlTypeFactory, SqlValidator.Config.DEFAULT.withIdentifierExpansion(true));
        SqlNode validated = sqlValidator.validate(parser.parseStmt());
        return validated;
    }

    /**
     * sqlNode 要想被执行，还是要转换为 RelNode，
     * 所以绕了一圈后 sql-> SqlNode -> RelNode ，等同于 sql -> RelNode
     * @param sqlNode
     * @return
     * @throws Exception
     */
    public static RelNode sqlNodeToRelNode(SqlNode sqlNode) throws Exception{
        Class.forName("org.apache.calcite.jdbc.Driver");
        Properties info = new Properties();
        info.setProperty("lex", "JAVA");
        info.setProperty("remarks", "true");
        info.setProperty("fun", "standard,mysql,postgresql,spark");
        Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
        CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
        SchemaPlus rootSchema = calciteConnection.getRootSchema();

        SqlParser.ConfigBuilder sqlParserBuilder = SqlParser.configBuilder().setLex(Lex.JAVA).setCaseSensitive(true);
        FrameworkConfig frameworkConfig = Frameworks.newConfigBuilder().defaultSchema(rootSchema).parserConfig(sqlParserBuilder.build())
                // //添加一个专们用于添加函数的 listSqlOperatorTable
                .operatorTable(listSqlOperatorTable)
                .traitDefs(ConventionTraitDef.INSTANCE, RelDistributionTraitDef.INSTANCE).build();

        //这个不能执行 org.apache.calcite.rel.logical.LogicalCalc cannot be cast to org.apache.calcite.adapter.enumerable.EnumerableRel
        //sqlNode -> RelNode，所以需要 RelOptPlanner, todo 非RelOptPlanner类型的planner 是否可以
        // HepPlanner RBO优化
        HepProgramBuilder builder = new HepProgramBuilder().addRuleInstance(PruneEmptyRules.PROJECT_INSTANCE);
        HepPlanner planner = new HepPlanner(builder.build());
        SqlTypeFactoryImpl factory = new SqlTypeFactoryImpl(RelDataTypeSystem.DEFAULT);
        //RexBuilder, 注意,不同于 RelBuilder
        final RelOptCluster cluster = RelOptCluster.create(planner, new RexBuilder(factory));


        // sqlNode->RelNode 转换器配置
        final SqlToRelConverter.Config sqlToRelConverterConfig = SqlToRelConverter.config();
        final RelBuilder relBuilder = sqlToRelConverterConfig.getRelBuilderFactory().create(cluster, null);
        CalciteCatalogReader calciteCatalogReader = new CalciteCatalogReader(CalciteSchema.from(rootSchema), CalciteSchema.from(rootSchema).path(null), factory,calciteConnection.config());
        //转换器转换sql时需要校验sql，所以需要sql校验器 SqlValidator
        SqlValidator sqlValidator = SqlValidatorUtil.newValidator(SqlStdOperatorTable.instance(), calciteCatalogReader, factory, SqlValidator.Config.DEFAULT);
        SqlToRelConverter sqlToRelConverter = new SqlToRelConverter(new ViewExpanderImpl(), sqlValidator, calciteCatalogReader, cluster, frameworkConfig.getConvertletTable(), sqlToRelConverterConfig);
        //此处进行真正的转换
        RelRoot root = sqlToRelConverter.convertQuery(sqlNode, true, true);
        //逻辑执行计划不能转换为物理执行计划
//org.apache.calcite.rel.logical.LogicalCalc cannot be cast to org.apache.calcite.adapter.enumerable.EnumerableRel
        root = root.withRel(sqlToRelConverter.flattenTypes(root.rel, true));
        root = root.withRel(RelDecorrelator.decorrelateQuery(root.rel, relBuilder));
        RelNode relNode = root.rel;
        // 寻找优化路径
        planner.setRoot(relNode);
        relNode = planner.findBestExp();

        return relNode;
    }

    public static SqlNode RelNodeToSqlNode(RelNode relNode) {
        // //SqlDialect dialect = MysqlSqlDialect.DEFAULT;
        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
        // 转换为需要的数据库类型的sql
        RelToSqlConverter relToSqlConverter = new RelToSqlConverter(dialect);
        SqlImplementor.Result visit = relToSqlConverter.visitRoot(relNode);
        SqlNode sqlNode = visit.asStatement();
        return sqlNode;
    }

    public static String sqlNodeToSql(SqlNode sqlNode) {
        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
        return sqlNode.toSqlString(dialect).getSql();
    }

    //https://bbs.huaweicloud.com/blogs/261477
    static String relNodeToSql(RelNode root) {
        // 根据对应数据库类型决定dialect ,注意这里, TestMysqlSqlDialect 不会导致中文乱码
        SqlDialect dialect = new TestMysqlSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);

        // 逻辑计划转sql语法树的转换器
        final RelToSqlConverter converter = new RelToSqlConverter(dialect);
        // 把relNode转成sqlNode（sql语法树）
        final SqlNode sqlNode = converter.visitRoot( root).asStatement();
        // 把sqlNode转成sql语句
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


    private static class ViewExpanderImpl implements RelOptTable.ViewExpander {
        public ViewExpanderImpl() {
        }

        @Override
        public RelRoot expandView(RelDataType rowType, String queryString, List<String> schemaPath, List<String> viewPath) {
            return null;
        }
    }

    /**
     * Creates a relational expression for a table scan, aggregate, filter.
     * It is equivalent to
     *
     * <blockquote><pre>SELECT deptno, count(*) AS c, sum(sal) AS s
     * FROM emp
     * GROUP BY deptno
     * HAVING count(*) &gt; 10</pre></blockquote>
     */
    private static RelBuilder example3(RelBuilder builder) {
        return builder.scan("EMP")
                .aggregate(builder.groupKey("DEPTNO"),
                        builder.count(false, "C"),
                        builder.sum(false, "S", builder.field("SAL")))
                .filter(builder.call(SqlStdOperatorTable.GREATER_THAN, builder.field("C"), builder.literal(10)));
    }

    /**
     * Sometimes the stack becomes so deeply nested it gets confusing. To keep
     * things straight, you can remove expressions from the stack. For example,
     * here we are building a bushy join:
     *
     * <blockquote><pre>
     *                join
     *              /      \
     *         join          join
     *       /      \      /      \
     * CUSTOMERS ORDERS LINE_ITEMS PRODUCTS
     * </pre></blockquote>
     *
     * <p>We build it in three stages. Store the intermediate results in variables
     * `left` and `right`, and use `push()` to put them back on the stack when it
     * is time to create the final `Join`.
     */
    private static RelBuilder example4(RelBuilder builder) {
        final RelNode left = builder.scan("CUSTOMERS").scan("ORDERS")
                .join(JoinRelType.INNER, "ORDER_ID")
                .build();

        final RelNode right = builder
                .scan("LINE_ITEMS")
                .scan("PRODUCTS")
                .join(JoinRelType.INNER, "PRODUCT_ID")
                .build();

        return builder.push(left).push(right).join(JoinRelType.INNER, "ORDER_ID");
    }


}
