package com.cloudwise.lcap.dataplateform.model;

import cn.hutool.json.JSONObject;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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
@Document("unitsetting")
public class UnitSetting {

    @Field("settingId")
    private String settingId;
    @Field("datasourceId")
    private String datasourceId;
    @Field("tableId")
    private String tableId;
    @Field("tableName")
    private String tableName;
    @Field("queryName")
    private String queryName;
    /**
     * 1=简单查询（默认类型） 2=单值复合  3=多值按行复合 4=多值按列复合 5=时序值复合
     */
    @Field("queryType")
    private Integer queryType;
    /**
     * 复合查询时的配置
     */
    @Field("setting")
    private JSONObject setting;
    /**
     * 组件所需的数据用sql从数据源查询（如果是http数据则不需要sql）
     */
    @Field("sql")
    private String sql;

    /**
     * 是否删除 0-未删除 1-已删除
     */
    @Field("deleted")
    private Integer deleted = 0;
    @Field("createTime")
    private Date createTime = new Date();
    @Field("updateTime")
    private Date updateTime;
    /**
     * 创建者id
     */
    @Field("creator")
    private String creator;
    /**
     * 修改者id
     */
    @Field("updater")
    private String updater;

}
