package com.cloudwise.lcap.test.http;

import cn.hutool.json.JSONArray;
import lombok.extern.slf4j.Slf4j;
import org.apache.calcite.avatica.ColumnMetaData;
import org.apache.calcite.jdbc.CalciteConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.*;
import java.util.*;

/**
 * {@link org.apache.calcite.config.CalciteConnectionProperty}
 */
@Slf4j
public class HttpCalciteTest {
    private static final Logger logger = LoggerFactory.getLogger(HttpCalciteTest.class.getName());

   public static void main(String[] args) throws SQLException {

        try {
            String modelPath = HttpCalciteTest.class.getResource("/bak/example/http2.json").getPath();
            Properties info = new Properties();
            info.put("lex", "JAVA");
            info.put("model", modelPath);
            info.setProperty("spark", "true");
            Connection connection = DriverManager.getConnection("jdbc:calcite:", info);
            CalciteConnection calciteConnection = connection.unwrap(CalciteConnection.class);
            Statement statement = calciteConnection.createStatement();

            String sql = "select * from SALES.getPosition";
            ResultSet resultSet = statement.executeQuery(sql);

            JSONArray array = new JSONArray();
            try {
                ResultSetMetaData rsmd = resultSet.getMetaData();
                while (resultSet.next()) {
                    Map<String,Object> object = new LinkedHashMap<>();
                    for (int i = 1; i <= rsmd.getColumnCount(); i++) {
                        String columnName = rsmd.getColumnName(i);
                        int columnType = rsmd.getColumnType(i);
                        Object o = getType(columnType).jdbcGet(resultSet, i);
                        object.put(columnName, o);
                    }
                    array.add(object);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
            log.info("result:{}",array);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    static ColumnMetaData.Rep[] values = ColumnMetaData.Rep.values();
    public static ColumnMetaData.Rep getType(int var){
        for (ColumnMetaData.Rep value : values) {
           if ( value.typeId == var){
               return value;
           }
        }
        return ColumnMetaData.Rep.STRING;
    }

}
