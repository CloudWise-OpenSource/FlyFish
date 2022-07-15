package com.cloudwise.lcap.test.mysql;

import com.alibaba.druid.pool.DruidDataSource;
import com.cloudwise.lcap.common.utils.DataUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.adapter.jdbc.JdbcConvention;
import org.apache.calcite.adapter.jdbc.JdbcSchema;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.linq4j.tree.Expression;
import org.apache.calcite.plan.RelOptPlanner;
import org.apache.calcite.schema.Schema;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.Schemas;
import org.apache.calcite.sql.SqlDialect;
import org.apache.calcite.sql.dialect.MysqlSqlDialect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.List;
import java.util.Map;
import java.util.Properties;

/**
 * inline方式，字段不用转义，因为手动设置了lex
 * 并且可以动态加载模版
 * 注意SchemaFactory 和 TableFactory的区别和使用的地方
 * {@link org.apache.calcite.config.CalciteConnectionProperty}
 */
@Slf4j
public class MysqlCalcite {
    private static final Logger logger = LoggerFactory.getLogger(MysqlCalcite.class.getName());

    public static void main(String[] args) {
        ResultSet results = null;
        try {
            String modelPath = MysqlCalcite.class.getResource("/bak/example/mysql.json").getPath();
            Class.forName("org.apache.calcite.jdbc.Driver");
            Properties info = new Properties();
            /**
             * {@link org.apache.calcite.config.CalciteConnectionProperty}
             */
            info.setProperty("lex", "JAVA");
            info.setProperty("remarks", "true");
            // info.setProperty("spark", "true");
            /**
             * 支持的 SqlOperator 模版，见{@link org.apache.calcite.sql.fun.SqlLibrary}
             * {@link org.apache.calcite.sql.fun.SqlLibraryOperatorTableFactory}
             * {@link org.apache.calcite.config.CalciteConnectionConfigImpl#fun(Class, Object)}
             * {@link org.apache.calcite.sql.fun.SqlLibraryOperatorTableFactory#create}
             * {@link org.apache.calcite.sql.fun.SqlStdOperatorTable} 此处是标准算子
             */
            info.setProperty("fun", "standard,spark");
            //info.put("model", "inline:" + FileUtils.readJsonFile(modelPath));
            Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
            CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
            Statement statement = calciteConnection.createStatement();

            SchemaPlus rootSchema = calciteConnection.getRootSchema();

            //此时再手动注册一个schema会怎样
            String schemaName = "test";
            DruidDataSource basicDataSource2 = new DruidDataSource();
            basicDataSource2.setUrl("jdbc:mysql://10.0.9.204:3306/test?createDatabaseIfNotExist=false&useSSL=false");
            basicDataSource2.setUsername("root");
            basicDataSource2.setPassword("Cloudwise@123");
            basicDataSource2.setDriverClassName("com.mysql.jdbc.Driver");
            /**
             * 从 JdbcSchema进去，其有一个 构造器
             * public JdbcSchema(DataSource dataSource, SqlDialect dialect,
             *       JdbcConvention convention, @Nullable String catalog, @Nullable String schema) {
             *     this(dataSource, dialect, convention, catalog, schema, null);
             *   }
             *   见 {@link JdbcConvention#register(RelOptPlanner)},其方法 JdbcRules.rules(this) 注册了各种rule
             *   如 {JdbcJoinRule}->JdbcConverterRule ->ConverterRule ->RelRule -> RelOptRule-> RelBuilder ->RelBuilderFactory
             */
            //手动设置方言,不然jdbc类数据源条件查询时中文乱码报错
            SqlDialect dialect = new MyJdbcSqlDialect(MysqlSqlDialect.DEFAULT_CONTEXT);
            Expression expression = Schemas.subSchemaExpression(rootSchema, schemaName, JdbcSchema.class);
            JdbcConvention convention = JdbcConvention.of(dialect, expression, schemaName);
            Schema schema = new JdbcSchema(basicDataSource2, dialect, convention, null, schemaName);
            rootSchema.add(schemaName, schema);

            //Schema schema2 = JdbcSchema.create(rootSchema, schemaName, basicDataSource2, null, schemaName);
            //rootSchema.add(schemaName, schema2);


            //single_value 是 udf，重载时只能有限个参数
            String sql = "select  user_id,single_value('c1','c2','c1')  from `test`.user_info";
            //mysql测试 single_value 函数
            String sql2 = "select single_value(distinct a.sex) from (select distinct sex from  `test`.user_info) a";
            String sql3 = "select MAX(user_id) from test.user_info";
            //collect_list(user_name)
            String sql4 = "select sex,COLLECT_LIST(user_name) as user_names from test.user_info group by sex";
            //
            String sql5 = "select sex,CONCAT_WS(',',COLLECT_LIST(user_name)) as user_names from test.user_info group by sex";

            //MAP[key,value] 是SqlStoOperatorTable 中的操作算子,而引擎指定了 info.setProperty("fun", "standard,mysql,postgresql,spark");
            //结果MAP 算子在mysql语句中无效
            String sql10 = "select MAP['用户id',user_id,'用户名',user_name,'性别',sex] from (values ('1','anna','male'),('2','mondo','male')) as t(user_id,user_name,sex)";
            //此时注册的函数则是全局有效的，而 udf 只能重载有限个参数 udf不支持可变参数
            //udf函数名不能与内置的函数名或者算子重名
            String sql12 = "select to_map('user_namexxx',user_name,'性别',sex) from test.user_info";
            String sql13 = "select MEDIAN(salary) as  salary_mid from test.user_info";
            String sql14 = "select MAX (salary) as  salary_mid from test.user_info";
            String sql15 = "select salary   from test.user_info where JOINDATE >= {d '2017-01-01'}";
            String sql16 = "select salary  from test.user_info where {t '08:00:00'} > JOINTIME";

            /**
             * {@link org.apache.calcite.sql.SqlJdbcFunctionCall}
             *  Unsupported conversion from LONG to java.sql.Timestamp
             */
           // String sql17 = "select {fn timestampadd(SQL_TSI_DAY, 1, JOINDATE) }  from test.user_info";

            String asSql = "select channel,count(1)   from test.sales_channel group by channel having count(1)>1";
            results = statement.executeQuery(asSql);
            List<Map<String, Object>> result1 = DataUtils.getResult(results);
            for (Object o : result1) {
                log.info("  " + o.toString());
            }
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
        }
    }

    private static class MyJdbcSqlDialect extends MysqlSqlDialect {
        public MyJdbcSqlDialect(Context context) {
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
