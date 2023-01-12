package com.cloudwise.lcap.datasource.model;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.entity.DataTable;
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
    private String directory;
    private String dbName;
    private String tableName;
    /**
     * 执行http请求时需要设置http连接信息
     */
    private JSONObject connectData;
    private Long taskId;

    /**
     * 测试sql时传的替换参数
     */
    private Map<String,String> params;

    //不同的数据源分页查询逻辑不一样，比如spark只有 limit N 取前N条,此时需要先对数据进行subList()截取
    private Integer pageNo;
    private Integer pageSize;
}
