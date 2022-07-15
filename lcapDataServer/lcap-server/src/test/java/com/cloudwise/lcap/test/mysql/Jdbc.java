package com.cloudwise.lcap.test.mysql;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.pool.DruidPooledConnection;
import lombok.extern.slf4j.Slf4j;

import java.sql.*;

/**
 * inline方式，字段不用转义，因为手动设置了lex
 * 并且可以动态加载模版
 * 注意SchemaFactory 和 TableFactory的区别和使用的地方
 * {@link org.apache.calcite.config.CalciteConnectionProperty}
 */
@Slf4j
public class Jdbc {


    static DruidDataSource basicDataSource2 = new DruidDataSource();

    static {
        basicDataSource2.setUrl("jdbc:mysql://10.2.3.56:3306/flyfish");
        basicDataSource2.setUsername("Rootmaster");
        basicDataSource2.setPassword("Rootmaster@777");
        basicDataSource2.setDriverClassName("com.mysql.jdbc.Driver");
    }

    public static void main(String[] args) throws SQLException {

        String sql = "insert into sales(month,channel,type,count,subtype,address,recommand,top,discount,Supplier" +
                ",logistics,stock,ad,adtype) values('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')";

        DruidPooledConnection connection = basicDataSource2.getConnection();

        Statement statement = connection.createStatement();
//        statement.executeQuery()

    }
}
