package com.cloudwise.lcap.test.udf;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.utils.DataUtils;
import com.cloudwise.lcap.test.udf.tablefunc.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.schema.SchemaPlus;
import org.apache.calcite.schema.impl.ScalarFunctionImpl;
import org.apache.calcite.schema.impl.TableFunctionImpl;
import org.apache.calcite.schema.impl.TableMacroImpl;
import org.junit.Before;
import org.junit.Test;

import java.lang.reflect.Method;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;


/**
 * {@link org.apache.calcite.config.CalciteConnectionProperty}
 * {@link org.apache.calcite.sql.fun.SqlStdOperatorTable}
 */
@Slf4j
public class UdfTest {

    public static final Method FIBONACCI_INSTANCE_TABLE_METHOD = org.apache.calcite.linq4j.tree.Types.lookupMethod(FibonacciTableFunction.class, "eval",Integer.class);
    public static final Method MY_TABLE_FUNCTION = org.apache.calcite.linq4j.tree.Types.lookupMethod(MyTableFunction.class, "eval",int.class);
    public static final Method STATIC_TABLE = org.apache.calcite.linq4j.tree.Types.lookupMethod(StaticTableFunction2.class, "create",String.class);
    public static final Method STR_VIEW_METHOD = org.apache.calcite.linq4j.tree.Types.lookupMethod(ViewStrTranslatableTable.class, "strView", String.class);
    public static final Method STR_VIEW_METHOD2 = org.apache.calcite.linq4j.tree.Types.lookupMethod(ViewStrTranslatableTable.class, "strView2", Object.class, Object.class);
    public static final Method VIEW_METHOD = org.apache.calcite.linq4j.tree.Types.lookupMethod(ViewTranslatableTable.class, "view", String.class);


    CalciteConnection calciteConnection = null;
    SchemaPlus rootSchema = null;
    Statement stmt = null;

    @Before
    public void init() throws SQLException, ClassNotFoundException {
        Class.forName("org.apache.calcite.jdbc.Driver");
        Properties info = new Properties();
        info.setProperty("lex", "JAVA");
        info.setProperty("remarks", "true");
        info.setProperty("fun", "standard,mysql,postgresql,spark");
        info.setProperty("calcite.default.charset","utf8");

        Connection connection = DriverManager.getConnection("jdbc:calcite:", info);

//        String path = FileDemo.class.getResource("/example/hr.json").getPath();
//        Connection connection = DriverManager.getConnection("jdbc:calcite:model=" + path, info);
//
        calciteConnection = connection.unwrap(CalciteConnection.class);

        rootSchema = calciteConnection.getRootSchema();
        stmt = calciteConnection.createStatement();
    }


    public static List<JSONObject> getResult2(ResultSet results) {
        List<JSONObject> array = new ArrayList<>();
        try {
            ResultSetMetaData rsmd = results.getMetaData();
            // List<Map<String, String>> list = new ArrayList<>();
            while (results.next()) {
                JSONObject object = new JSONObject();
                // Map<String,String> row = new HashMap<>();
                for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                    String columnName = rsmd.getColumnName(i);
                    object.put(columnName, results.getString(columnName));
                }
                array.add(object);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return array;
    }

    /**
     * 本地动态表
     * @throws SQLException
     */
    @Test
    public void test10() throws SQLException {
        rootSchema.add("processCursor", TableFunctionImpl.create(UdfMethods.PROCESS_CURSOR_METHOD));
        rootSchema.add("processCursors", TableFunctionImpl.create(UdfMethods.PROCESS_CURSORS_METHOD));
        rootSchema.add("GenerateStrings", TableFunctionImpl.create(UdfMethods.GENERATE_STRINGS_METHOD));
        rootSchema.add("multiplicationTable", TableFunctionImpl.create(UdfMethods.MULTIPLICATION_TABLE_METHOD));

        rootSchema.add("dummyTableFuncWithTwoParams", TableFunctionImpl.create(UdfMethods.DUMMY_TABLE_METHOD_WITH_TWO_PARAMS));

        //[{"s":"","n":"0"}, {"s":"a","n":"1"}, {"s":"ab","n":"2"}, {"s":"abc","n":"3"}, {"s":"abcd","n":"4"}]
        String sql1 = "select * from table(GenerateStrings(5))";
        String sql2 = "select * from table(multiplicationTable(2,2,2))";

        String sql3 = "select * from table(processCursor(2," +
                "cursor(select * from table(GenerateStrings(5))) )) as t(u)";

        String sql4 = "select * from table(process(2,cursor(select * from table(multiplication(5,5,0))),"
                + "cursor(select * from table(GenerateStrings(5))))) as t(u)"
                + "where u > 3";
        //[
        //   {"COUNT_ARGS2_test":"2","x":"2","INCREMENTED_SALARY":"12"},
        //   {"COUNT_ARGS2_test":"2","x":"4","INCREMENTED_SALARY":"14"},
        //   {"COUNT_ARGS2_test":"2","x":"7","INCREMENTED_SALARY":"17"}
        //]
        String sql5 = "select * from table(dummyTableFuncWithTwoParams(2,3))";

        //[{"x":"2","EXPR$1":"0"}, {"x":"4","EXPR$1":"0"}]
        String sql6 = "select x,(select * from table(dummyTableFuncWithTwoParams(2,x))) from (values (2), (4)) as t(x)";
        ResultSet resultSet = stmt.executeQuery(sql6);
        List<JSONObject> dataSet111 = getResult2(resultSet);
        for (JSONObject s : dataSet111) {
            log.info("  " + s);
        }
    }


    /**
     *
     * @throws SQLException
     */
    @Test
    public void test02_AbstractSchema() throws SQLException {
        //该方法返回 ScannableTable ，使用 TableFunctionImpl 进行注册
        rootSchema.add("FIBONACCI_INSTANCE_TABLE_METHOD",  TableFunctionImpl.create(FIBONACCI_INSTANCE_TABLE_METHOD));
        //两种注册方式 method 和 class(因为这个类只有一个方法并且该方法返回 QueryableTable 类型)
        //该方法返回 QueryableTable，使用 TableFunctionImpl 进行注册
        rootSchema.add("mytable", TableFunctionImpl.create(MY_TABLE_FUNCTION));
        rootSchema.add("mytable2", TableFunctionImpl.create(MyTableFunction.class));
        rootSchema.add("STATIC_TABLE", TableFunctionImpl.create(STATIC_TABLE));
        //strView方法返回的是 TranslatableTable，只能使用 TableMacroImpl.create(method)注册
        rootSchema.add("strView", TableMacroImpl.create(STR_VIEW_METHOD));
        //strView2方法返回的是 TranslatableTable，只能使用 TableMacroImpl.create(method)注册
        rootSchema.add("strView2",TableMacroImpl.create(STR_VIEW_METHOD2));
        //该方法返回 TranslatableTable，只能使用 TableMacroImpl.create(method)注册
        rootSchema.add("view", TableMacroImpl.create(VIEW_METHOD));

        String sql0 = "select a,x from (values (1,'1,2,3'),(2,'2,4,5')) as t (a,x)";
        String sql1 = "select * from table(FIBONACCI_INSTANCE_TABLE_METHOD(2)) limit 6";
        String sql2 = "select * from table(STATIC_TABLE('EMPLOYEES'))";
        //[{"n":"1"},{"n":"3"},{"n":"10"},{"n":"20"}]
        String sql3 = "select * from table(view('(10), (20)')) as t(n) where n < 30";
        //strView 接受一个字符串 [{"n":"hello"}]
        String sql4 = "select * from table(strView('hello')) as t(n)";
        //strView2 接受两个对象
        String sql5 = "select * from table(strView2(MAP['a', 1, 'baz', 2], ARRAY[3, 4, CAST(null AS INTEGER)])) as t(n)";
        //[{"n":"{'a'=1, 'baz'=2}"},{"n":"true"}]
        String sql6 = "select * from table(strView2(MAP['a', 1, 'baz', 2], true)) as t(n)";
        String sql7 = "select * from table(strView2(MAP['a', 1, 'baz', 2],cast(cast(1 as int) as varchar(1)))) as t(n)";
        String sql8 = "select * from table(strView2(MAP['a', 1, 'baz', 2],cast(cast('2019-10-18 10:35:23' as TIMESTAMP) as BIGINT))) as t(n)";

        //[{"c":"1"}, {"c":"3"}, {"c":"100"}]
        String sql9 = "select * from table(mytable2(100))";
        String sql10 = "select MAP['用户id',user_id,'用户名',user_name,'性别',sex] from (values ('1','anna','male'),('2','mondo','male')) as t(user_id,user_name,sex)";
        String sql11 = "select a,group_concat(x,',') from (values (1,'1,2,3'),(2,'2,4,5')) as t (a,x)";

        ResultSet resultSet4 = stmt.executeQuery(sql10);
        List<Map<String, Object>> result1 = DataUtils.getResult(resultSet4);
        System.out.println(result1);
    }


    @Test
    public void test119() throws SQLException {
        String sql = "select a, a in (2,3,4),MAP['field1',a] as is_in from (values(2),(3),(5),(6)) as t(a)";
        ResultSet resultSet = stmt.executeQuery(sql);
        List<JSONObject> dataSet111 = getResult2(resultSet);
        System.out.println(dataSet111);
    }
}
