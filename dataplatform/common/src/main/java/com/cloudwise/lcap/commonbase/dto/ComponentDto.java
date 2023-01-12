package com.cloudwise.lcap.commonbase.dto;

import cn.hutool.json.JSONObject;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ComponentDto {
    private String id;
    private Long accountId;
    private String name;
    private String componentType;
    private Integer isLib;
    private String categoryId;
    private String subCategoryId;
    private String categoryName;
    private Boolean isUpdate;
    private String version;
    private List<String> projects;
    private List<String> projectsName;
    private List<String> tags;
    private List<String> applications;
    private String desc;
    private List<JSONObject> versions;
    private String cover;

    // 组件开发状态 enum#COMPONENT_DEVELOP_STATU
    private String developStatus;
    private String status;
    private Long creator;
    private Long updater;
    private String from;
    private Integer allowDataSearch;

    private Date createTme;
    private Date updateTime;
}