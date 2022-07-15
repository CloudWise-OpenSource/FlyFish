package com.cloudwise.lcap.test.http;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.dataplateform.core.calcite.http.HttpSchemaFactory;
import com.cloudwise.lcap.common.utils.DataUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.jdbc.CalciteConnection;
import org.apache.calcite.schema.Schema;
import org.apache.calcite.schema.SchemaPlus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.*;

/**
 * {@link org.apache.calcite.config.CalciteConnectionProperty}
 */
@Slf4j
public class HttpCalciteTest2 {
    private static final Logger logger = LoggerFactory.getLogger(HttpCalciteTest2.class.getName());

    public static void main(String[] args) throws SQLException {

        try {
            Class.forName("org.apache.calcite.jdbc.Driver");
            Properties info = new Properties();
            /**
             * {@link org.apache.calcite.config.CalciteConnectionProperty}
             */
            info.put("lex", "JAVA");

            Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
            CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
            SchemaPlus rootSchema = calciteConnection.getRootSchema();

            List<Map<String, Object>> tables = getTables();
            Map<String, Object> operand = new HashMap<>();
            operand.put("tables",tables);
            Schema schema = HttpSchemaFactory.INSTANCE.create(rootSchema, "myhttp", operand);
            rootSchema.add("myhttp",schema);

            Statement statement = calciteConnection.createStatement();
            String sql = "select * from myhttp.there";
            ResultSet resultSet = statement.executeQuery(sql);

            log.info("result:{}",DataUtils.getResult(resultSet));
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
    public static List<Map<String,Object>> getTables() {
        Map map = new JSONObject(model1);
        List<Map<String,Object>> data = new ArrayList<>();
        data.add(map);
        return data;
    }

    static String model1 = "{\"tableName\":\"there\",\"method\":\"post\",\"requestBody\":{\"id\":35,\"address\":\"长沙\",\"latitude\":\"25.67\",\"longtitude\":\"42.18\"},\"header\":{\"content-type\":\"application/json\",\"token\":\"saaehajfnmfhsjt\"},\"params\":null,\"fields\":[{\"fieldName\":\"id\",\"fieldAliasName\":\"序号\",\"fieldType\":\"int\",\"jsonpath\":\"$.data.id\",\"sort\":1},{\"fieldName\":\"address\",\"fieldAliasName\":\"地址\",\"fieldType\":\"int\",\"jsonpath\":\"$.data.address\",\"sort\":2},{\"fieldName\":\"latitude\",\"fieldAliasName\":\"经度\",\"fieldType\":\"double\",\"jsonpath\":\"$.data.latitude\",\"sort\":3},{\"fieldName\":\"longtitude\",\"fieldAliasName\":\"纬度\",\"fieldType\":\"double\",\"jsonpath\":\"$.data.longtitude\",\"sort\":4}],\"url\":\"http://localhost:8089/h2/addPosition\",\"table\":\"增加位置\"}";
}
