package com.cloudwise.lcap.datasource.pool;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class DbConnectConfig {
    private String type;
    private String poolName;
    private String driver;
    private String url;
    private String username;
    private String password;
    private int maxConnectionCount;
}
