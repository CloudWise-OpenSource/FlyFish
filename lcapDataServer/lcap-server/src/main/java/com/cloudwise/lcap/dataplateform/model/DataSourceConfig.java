package com.cloudwise.lcap.dataplateform.model;

import com.cloudwise.lcap.common.contants.Constant;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

/**
 * 接口配置传输
 *
 * @author zhaobo
 * @date 2022/1/13
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("datasource")
public class DataSourceConfig {
    @Field("datasourceId")
    private String datasourceId;
    /**
     * 展示名称，用户设置
     */
    @Field("datasourceName")
    private String datasourceName;
    /**
     * 数据源类型，见 {@link Constant}
     */
    @Field("schemaType")
    private String schemaType;
    /**
     * dbname
     */
    @Field("schemaName")
    private String schemaName;
    /**
     * 数据源连接信息
     */
    @Field("connectData")
    private String connectData;
    @Field("tables")
    private List<DataTable> tables;

    /**
     * 是否删除 0-未删除 1-已删除
     */
    private Integer deleted = 0;
    private Date createTime = new Date();
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
    /**
     * 租户id
     */
    @Field("accountId")
    private String accountId;
}
