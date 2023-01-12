package com.cloudwise.lcap.datasource.model;

import cn.hutool.json.JSONObject;
import lombok.*;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SqlQueryReq {

    private String datasourceId;
    private String sql;
    private String schemaType;
    private String schemaName;
    private Map<String,String> params;
    private Long taskId;
    private Integer pageNo;
    private Integer pageSize;
}
