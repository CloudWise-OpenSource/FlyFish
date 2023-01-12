package com.cloudwise.lcap.commonbase.dto;

import cn.hutool.json.JSONObject;
import lombok.*;

/**
 * 可视化组件设置
 * 可视化组件 + 数据源 + sql + jsonpath 定义一个数据模型
 * 当数据源是http类型时，不需要sql
 * @author yinqiqi
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class DataQueryDto {

    private String settingId;
    private String datasourceId;
    private String tableId;
    private String tableName;
    private String queryName;
    /**
     * 1=简单查询（默认类型） 2=单值复合  3=多值按行复合 4=多值按列复合 5=时序值复合
     */
    private Integer queryType;
    /**
     * 复合查询时的配置
     */
    private JSONObject setting;
    /**
     * 组件所需的数据用sql从数据源查询（如果是http数据则不需要sql）
     */
    private String sql;
    private Long accountId;
}
