package com.cloudwise.lcap.commonbase.dto;

import cn.hutool.json.JSONObject;
import lombok.*;

import java.io.Serializable;

@Data
@Builder
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class DataTableDto  implements Serializable {
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
