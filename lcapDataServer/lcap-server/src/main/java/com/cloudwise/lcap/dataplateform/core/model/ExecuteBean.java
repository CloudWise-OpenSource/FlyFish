package com.cloudwise.lcap.dataplateform.core.model;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.dataplateform.model.DataTable;
import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExecuteBean {

    private String datasourceId;
    private String sql;
    private String schemaType;
    private String schemaName;
    private List<DataTable> tables;
    private String dbName;
    private String tableName;
    /**
     * 执行http请求时需要设置http连接信息
     */
    private JSONObject connectData;
    private Long taskId;

    private Integer pageNo;
    private Integer pageSize;
}
