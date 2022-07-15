package com.cloudwise.lcap.source.model;

import cn.hutool.json.JSONObject;
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
@Document("components")
public class Component {
    @Field("_id")
    private ObjectId id;
    @Field("account_id")
    private String accountId;
    @Field("create_time")
    private Date createTme;
    @Field("update_time")
    private Date updateTime;
    @Field("name")
    private String name;
    @Field("is_lib")
    private Boolean isLib;
    @Field("category")
    private String category;
    @Field("sub_category")
    private String subCategory;

    @Field("type")
    private String type;
    @Field("projects")
    private List<String> projects;
    @Field("tags")
    private List<String> tags;

    @Field("applications")
    private List<String> applications;
    @Field("desc")
    private String desc;
    @Field("versions")
    private List<JSONObject> versions;
    @Field("cover")
    private String cover;

    @Field("creator")
    private String creator;
    @Field("updater")
    private String updater;

    // 组件开发状态 enum#COMPONENT_DEVELOP_STATU
    @Field("develop_status")
    private String developStatus;
    @Field("status")
    private String status;

    @Field("from")
    private String from;

    @Field("allow_data_search")
    private Integer allowDataSearch;

    //// 文件最后一次更新时间
    private Date lastChangeTime;

    private Boolean isUpdate;

    private String version;
}