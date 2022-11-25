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
    /**
     * 是否自动生成封面图，0-否 1-是
     */
    @Field("automatic_cover")
    private Integer automatic_cover;

    /**
     * 组件开发状态 doing-开发中 online-已上线
      */
    @Field("develop_status")
    private String developStatus;
    /**
     * 组件状态 invalid=已删除(回收站中) valid=正常状态
     */
    @Field("status")
    private String status;

    @Field("from")
    private String from;
    @Field("creator")
    private String creator;
    @Field("updater")
    private String updater;
    @Field("create_time")
    private Date createTme;
    @Field("update_time")
    private Date updateTime;

}