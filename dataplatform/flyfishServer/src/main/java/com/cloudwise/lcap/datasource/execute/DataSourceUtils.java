package com.cloudwise.lcap.datasource.execute;

import cn.hutool.core.map.MapUtil;
import com.cloudwise.lcap.commonbase.dto.DatasourceStatus;
import com.cloudwise.lcap.datasource.query.*;
import lombok.extern.slf4j.Slf4j;

import java.sql.SQLException;
import java.util.Map;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;


@Slf4j
public class DataSourceUtils {
    /**
     * 数据源可用性校验
     * 数据源必须实现该接口并且根据当数据源连接信息返回数据源是否可用
     * @return
     * @throws SQLException
     */
    public static DatasourceStatus available(String schemaType, Map<String, Object> map){
        String username = MapUtil.getStr(map, "username");
        String password = MapUtil.getStr(map, "password");
        String servers = MapUtil.getStr(map, "servers");
        String schemaName = MapUtil.getStr(map, "schemaName");
        String modelName = MapUtil.getStr(map, "modelName");

        switch (schemaType.toLowerCase()) {
            case MYSQL:
                //return MySqlQueryProxy.available(servers,username,password,schemaName);
            case POSTGRES:
                //return PostGresQueryProxy.available(servers,username,password,schemaName,modelName);
            case SQL_SERVER:
            case ORACLE:
            case DAMENG:
            case MARIA:
            case CLICKHOUSE:
                return JDBCQueryProxy.available(servers,username,password,schemaType,schemaName,modelName);
            case HTTP:
                return DatasourceStatus.builder().available(true).build();
            default:
                break;
        }
        return DatasourceStatus.builder().available(true).build();
    }

}
