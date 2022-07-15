package com.cloudwise.lcap.source.dto;

import cn.hutool.json.JSONObject;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ComponentDto {
    private String id;

    @Field("account_id")
    private String accountId;
    @Field("name")
    private String name;
    @Field("is_lib")
    private Boolean isLib;
    @Field("category")
    private String category;
    @Field("sub_category")
    private String subCategory;
    private Boolean isUpdate;
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

    // 组件开发状态 enum#COMPONENT_DEVELOP_STATU
    @Field("develop_status")
    private String developStatus;
    @Field("status")
    private String status;

    @Field("creator")
    private String creator;
    @Field("updater")
    private String updater;

    @Field("from")
    private String from;

    @Field("allow_data_search")
    private Integer allowDataSearch;

    private Date createTme;
    private Date updateTime;
    // gitlab 项目id
    private Integer gitLabProjectId;
    // // 是否需要推送到git 远程
    private boolean needPushGit;
    //// 文件最后一次更新时间
    private Date lastChangeTime;
}