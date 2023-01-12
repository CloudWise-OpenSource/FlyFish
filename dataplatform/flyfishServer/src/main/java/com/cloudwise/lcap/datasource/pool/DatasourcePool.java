package com.cloudwise.lcap.datasource.pool;

import java.sql.*;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class DatasourcePool {
    public BlockingQueue<Connection> blockQueue;
    public DbConnectConfig dbConnectConfig;

    public DatasourcePool(DbConnectConfig dbConnectConfig) throws SQLException {
        int MAX_CONNECT = dbConnectConfig.getMaxConnectionCount();
        this.blockQueue = new ArrayBlockingQueue<>(MAX_CONNECT);
        this.dbConnectConfig = dbConnectConfig;
        for (int loop = 0; loop < MAX_CONNECT; loop++) {
            Connection conn = DriverManager.getConnection(dbConnectConfig.getUrl(),
                dbConnectConfig.getUsername(), dbConnectConfig.getPassword());
            blockQueue.add(conn);
        }
    }

    public Connection getConnection() {
        try {
            Connection connection = blockQueue.take();
            while (connection.isClosed() || !connection.isValid(2000)){
                blockQueue.add(DriverManager.getConnection(dbConnectConfig.getUrl(), dbConnectConfig.getUsername(), dbConnectConfig.getPassword()));
                connection = blockQueue.take();
            }
            return connection;
        } catch (InterruptedException | SQLException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }
        return null;
    }

    public void freeConnection(Connection conn) {
        try {
            blockQueue.put(conn);
        } catch (InterruptedException e) {
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }
    }

    public void freeConnection(Connection conn, Statement stat, ResultSet rs) {
        if (conn != null) {
            try {
                blockQueue.put(conn);
            } catch (InterruptedException e) {
                log.error("");
                e.printStackTrace();
                Thread.currentThread().interrupt();
            }
        }

        if (stat != null) {
            try {
                stat.close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            stat = null;
        }

        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            rs = null;
        }
    }
}
