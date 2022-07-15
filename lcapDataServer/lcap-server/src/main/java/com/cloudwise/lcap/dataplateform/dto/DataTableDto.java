package com.cloudwise.lcap.dataplateform.dto;

import cn.hutool.json.JSONObject;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DataTableDto {
    /**
     * 数据源id
     */
    private String datasourceId;
    private String datasourceName;
    private String schemaName;
    private String schemaType;
    private String modelName;
    private String tableId;
    private String tableName;
    private String exampleSql;
    private JSONObject tableMeta;
    private Object fields;
    private Object exampleData;

}
