package com.cloudwise.lcap.test.mysql;

import cn.hutool.json.JSONObject;
import com.alibaba.druid.pool.DruidDataSource;
import org.apache.calcite.adapter.jdbc.JdbcSchema;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.schema.Schema;
import org.apache.calcite.schema.SchemaPlus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.Properties;

/**
 * inline方式，字段不用转义，因为手动设置了lex
 * 并且可以动态加载模版
 * 注意SchemaFactory 和 TableFactory的区别和使用的地方
 * {@link org.apache.calcite.config.CalciteConnectionProperty}
 */
public class MysqlCalcite2 {
    private static final Logger logger = LoggerFactory.getLogger(MysqlCalcite2.class.getName());

    public static void main(String[] args)  {
        try {
            Class.forName("org.apache.calcite.jdbc.Driver");
            Properties info = new Properties();
            /**
             * {@link org.apache.calcite.config.CalciteConnectionProperty}
             */
            info.setProperty("lex", "JAVA");
            info.setProperty("remarks", "true");
            Connection connection = DriverManager.getConnection("jdbc:calcite:" ,info);
            CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
            Statement statement = calciteConnection.createStatement();
            SchemaPlus rootSchema = calciteConnection.getRootSchema();
//            DruidDataSource basicDataSource = new DruidDataSource();
//            basicDataSource.setUrl("jdbc:mysql://10.0.9.204:3306/test?createDatabaseIfNotExist=true&useSSL=false");
//            basicDataSource.setUsername("root");
//            basicDataSource.setPassword("Cloudwise@123");
//            basicDataSource.setDriverClassName(MYSQL_DRIVER);
//            Schema schema = JdbcSchema.create(rootSchema, "test", basicDataSource, null, "test");
//            rootSchema.add("test",schema);

            DruidDataSource basicDataSource2 = new DruidDataSource();
            basicDataSource2.setUrl("jdbc:mysql://127.0.0.1:3306/ff_platform");
            basicDataSource2.setUsername("root");
            basicDataSource2.setPassword("12345678");
            basicDataSource2.setDriverClassName("com.mysql.jdbc.Driver");
            Schema schema2 = JdbcSchema.create(rootSchema, "ff_platform", basicDataSource2, null, "ff_platform");
            rootSchema.add("ff_platform",schema2);

            DruidDataSource basicDataSource3 = new DruidDataSource();
            basicDataSource3.setUrl("jdbc:mysql://127.0.0.1:3306/ff_platform");
            basicDataSource3.setUsername("root");
            basicDataSource3.setPassword("12345678");
            basicDataSource3.setDriverClassName("com.mysql.jdbc.Driver");
            Schema schema3 = JdbcSchema.create(rootSchema, "test", basicDataSource2, null, "ff_platform");
            rootSchema.add("ff_platform",schema3);

//            rootSchema.add("TO_ARRAY",  ScalarFunctionImpl.create(_STRUCT.class,"to_array"));
//            rootSchema.add("CONCAT_WS",  ScalarFunctionImpl.create(_VARCHAR.class,"concat_ws"));
//            rootSchema.add("COLLECT_SET", AggregateFunctionImpl.create(_Collect_set.class));
//            rootSchema.add("SUM", AggregateFunctionImpl.create(_SUM.class));
//
//            String sql = "select * from dql2.file_datasource_info";
//            String sql2 = "select * from test.sale where channel='微信'";
//            String sql3 = "select channel,CONCAT_WS(',',COLLECT_SET(total)) as `销售额`,CONCAT_WS(',',COLLECT_SET(`month`)) as `月份` from test.sales_channel group by channel ";
//
//            //MAP[key,value] 是SqlStoOperatorTable 中的操作算子,而引擎指定了 info.setProperty("fun", "standard,mysql,postgresql,spark");
//            //此时注册的函数则是全局有效的，而udf只能重载有限个参数 udf不支持可变参数
//            //udf函数名不能与calcite内置的函数名或者算子重名
//            rootSchema.add("to_map", ScalarFunctionImpl.create(_STRUCT.class, "to_map"));
//            rootSchema.add("TO_STRING", ScalarFunctionImpl.create(_VARCHAR.class,"toString"));
//            String sql9 = "select MAP['渠道',channel,'销售额',TO_STRING(num)] as info,SUBSTRING(channel,1) channel2 from test.sale where channel='微信'";
//            String sql10 = "select MAP['用户id',user_id,'用户名',user_name,'性别',sex] from (values ('1','anna','male'),('2','mondo','male')) as t(user_id,user_name,sex)";
//            String sql12 = "select to_map('渠道',channel,'销售额',num) as info from test.sale";
//            String sql13 = "SELECT CURDATE() as channel1 from test.sale";

            String sql14 = "select * from ff_platform.data_store a where a.name='z2-咨询'";

            ResultSet results = statement.executeQuery(sql14);

            ResultSetMetaData rsmd = results.getMetaData();
            // List<Map<String, String>> list = new ArrayList<>();
            while (results.next()) {
                JSONObject object = new JSONObject();
                // Map<String,String> row = new HashMap<>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    String columnName = rsmd.getColumnName(i);
                    object.put(columnName, results.getString(columnName));
                }
                System.out.println(object);
            }
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
        }
    }

}
