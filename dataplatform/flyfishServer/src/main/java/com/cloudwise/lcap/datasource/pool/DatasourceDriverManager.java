package com.cloudwise.lcap.datasource.pool;

import com.cloudwise.lcap.commonbase.exception.DataSourceConnectionException;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class DatasourceDriverManager {
    public volatile static Map<String, DatasourcePool> pools = new HashMap<>();

    private DatasourceDriverManager() {}

    public static DatasourcePool getPool(DbConnectConfig dbConnectConfig) throws SQLException {
        String poolName = dbConnectConfig.getPoolName();
        if (!pools.containsKey(poolName)) {
            synchronized (DatasourcePool.class) {
                if (!pools.containsKey(poolName)) {
                    log.info("连接池:{}中未包含数据源", poolName);
                    try {
                        // 注册数据库驱动
                        Class.forName(dbConnectConfig.getDriver());
                        pools.put(poolName, new DatasourcePool(dbConnectConfig));
                    } catch (Exception e) {
                        log.error("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确" + e);
                        throw new DataSourceConnectionException("数据源连接失败,请检查连接信息、数据库名、用户名密码等配置是否正确");
                    }
                }
            }
        }
        return pools.get(poolName);
    }

    public static DatasourcePool getPool(String poolName) {
        return pools.get(poolName);
    }

}
