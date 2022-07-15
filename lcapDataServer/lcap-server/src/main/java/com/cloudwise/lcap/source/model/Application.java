package com.cloudwise.lcap.source.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Document("applications")
public class Application {

    @Field("_id")
    private ObjectId id;

    @Field("account_id")
    private String accountId;

    // 标签
    @Field("tags")
    private List<String> tags;
    // 应用开发状态 enum#APP_DEVELOP_STATUS
    @Field("develop_status")
    private String developStatus;
    // 封面 不再存储，就在www/applications/cover.jpeg
    @Field("cover")
    private String cover;
    // 可用状态 enum#COMMON_STATUS
    @Field("status")
    private String status;
    @Field("pages")
    private List<Object> pages;
    @Field("name")
    private String name;
    // 项目
    @Field("project_id")
    private String projectId;
    // 应用类型
    @Field("type")
    private String type;
    @Field("creator")
    private String creator;
    @Field("updater")
    private String updater;
    @Field("create_time")
    private Date createTime;
    @Field("update_time")
    private Date updateTime;
    @Field("is_lib")
    // 模板库
    private Boolean isLib;
    // 工作台
    @Field("is_recommend")
    private Boolean isRecommend;

    private Boolean isUpdate;
}
