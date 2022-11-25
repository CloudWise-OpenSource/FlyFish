package com.cloudwise.lcap.dataplateform.core.execute;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.dataplateform.core.query.*;
import com.cloudwise.lcap.dataplateform.dto.DataTableDto;
import com.cloudwise.lcap.dataplateform.model.DataSourceConfig;
import com.cloudwise.lcap.dataplateform.model.DataTable;
import com.cloudwise.lcap.dataplateform.model.DatasourceStatus;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.*;


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

        switch (schemaType.toLowerCase()) {
            case MYSQL:
            case POSTGRES:
            case ORACLE:
            case CLICKHOUSE:
            case DAMENG:
            case MARIA:
            case SQLSERVER:
                return JDBCQueryProxy.available(servers,username,password,schemaType);
            case HTTP:
                return DatasourceStatus.builder().available(true).build();
            default:
                break;
        }
        return DatasourceStatus.builder().available(true).build();
    }

    /**
     * @param dataSourceConfig
     * @param tableName
     * @return
     */
    public static List<DataTableDto> queryTableBasicInfoList(DataSourceConfig dataSourceConfig, String tableName) {
        String datasourceId = dataSourceConfig.getDatasourceId();
        String datasourceName = dataSourceConfig.getDatasourceName();
        String schemaType = dataSourceConfig.getSchemaType();
        String schemaName = dataSourceConfig.getSchemaName();

        switch (schemaType.toLowerCase()) {
            case MYSQL:
            case POSTGRES:
            case ORACLE:
            case CLICKHOUSE:
            case DAMENG:
            case MARIA:
            case SQLSERVER:
                return JDBCQueryProxy.getTableList(dataSourceConfig,schemaType);
            case HTTP:
                List<DataTableDto> returnData = new ArrayList<>();
                List<DataTable> tables1 = dataSourceConfig.getTables();
                if (CollectionUtil.isNotEmpty(tables1)) {
                    returnData = tables1.stream().map(o -> DataTableDto.builder().tableId(o.getTableId()).tableName(o.getTableName()).datasourceId(datasourceId).modelName(schemaName).datasourceName(datasourceName).schemaName(schemaName).schemaType(schemaType).build()).collect(Collectors.toList());
                    if (StringUtils.isNotEmpty(tableName)) {
                        returnData = returnData.stream().filter(tableDto -> tableDto.getTableName().contains(tableName)).collect(Collectors.toList());
                    }
                }
                return returnData;
            default:
                break;
        }
        return null;
    }


    /**
     * 查看某一个表的元数据和样例数据
     * 表的结构，字段，前10条样例数据
     */
    public static DataTableDto queryTableMeta(DataSourceConfig config, String tableName) {
        String schemaName = config.getSchemaName();
        String schemaType = config.getSchemaType();
        DataTableDto dataTableDto = DataTableDto.builder().datasourceId(config.getDatasourceId()).datasourceName(config.getDatasourceName()).schemaName(schemaName)
                .schemaType(schemaType).tableId(tableName).build();

        List<DataTable> tables = config.getTables();
        switch (schemaType.toLowerCase()) {
            case MYSQL:
            case POSTGRES:
            case ORACLE:
            case CLICKHOUSE:
            case DAMENG:
            case MARIA:
            case SQLSERVER:
                return JDBCQueryProxy.getTableDetail(config, tableName, dataTableDto,schemaType);
            case HTTP:
                if (CollectionUtil.isNotEmpty(tables)) {
                    Optional<DataTable> first = tables.stream().filter(table -> table.getTableName().equalsIgnoreCase(tableName)).findFirst();
                    if (first.isPresent()) {
                        DataTable dataTable = first.get();
                        JSONObject tableMeta = dataTable.getTableMeta();

                        dataTableDto.setTableMeta(tableMeta);
                        dataTableDto.setTableId(dataTable.getTableId());
                        if (null != tableMeta && tableMeta.containsKey("fields")) {
                            Object fields = tableMeta.get("fields");
                            dataTableDto.setFields(fields);
                        }
                    }
                }
                //http不需要样例数据
                return dataTableDto;
            default:
                break;
        }
        return dataTableDto;
    }
}
