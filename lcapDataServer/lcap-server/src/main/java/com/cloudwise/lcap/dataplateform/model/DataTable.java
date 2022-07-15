package com.cloudwise.lcap.dataplateform.model;

import cn.hutool.json.JSONObject;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DataTable {
    @Field("tableId")
    private String tableId;
    @Field("tableName")
    private String tableName;
    /**
     * 主要包含字段信息，如字段名、别名、字段类型、字段排序、jsonpath等
     * 主要是http redis mongo等自定义数据源用到
     * redis:
     * {
     *             "tableName": "departments:10080",
     *             "dataType": "hash",
     *             "keyDelimiter": ",",
     *             "dataFormat": "kv_raw",
     *             "fields": {
     *               "deptid": "int",
     *               "deptname": "varchar",
     *               "subdept": "object"
     *             }
     * }
     * mongo:
     * {
     *             "tableName": "items",
     *             "fields": {
     *               "_id": "",
     *               "name": "",
     *               "title": "",
     *               "content": ""
     *             }
     * }
     */
    @Field("tableMeta")
    private JSONObject tableMeta;

}
