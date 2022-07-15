package com.cloudwise.lcap.dataplateform.dto;

import cn.hutool.json.JSONObject;
import lombok.*;

import java.util.Date;

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
public class UnitSettingDto {

    private String settingId;
    private String datasourceId;
    private String datasourceName;
    private String schemaType;
    private String schemaName;
    private String tableId;
    private String tableName;
    /**
     * 组件id
     */
    private String unitId;
    private String queryName;
    private Integer queryType;
    //private String projectId;
    /**
     * 组件配置项：如组件图形样式，x轴 y轴设置等
     */
    private JSONObject setting;
    /**
     * 组件所需的数据用sql从数据源查询（如果是http数据则不需要sql）
     */
    private String sql;

    /**
     * 是否删除 0-未删除 1-已删除
     */
    private Integer deleted = 0;

    private Date createTime = new Date();
    private Date updateTime;
    private String creator;
}
