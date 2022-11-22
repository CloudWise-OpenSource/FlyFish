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
    private String name;
    private String type;
    private String version;
    private List<JSONObject> versions;
    private String developStatus;
    private List<String> projects;
    private List<String> projectsName;

    private Boolean isLib;
    private String category;
    private String categoryName;
    private String subCategory;
    private String subCategoryName;
    private boolean update;
    private List<String> tags;
    private List<String> applications;
    private String from;
    private Boolean isLab;
    private Integer allowDataSearch;
    private String desc;
    private String cover;
    private String status;

    private String creator;
    private String updater;
    private Date createTme;
    private Date updateTime;
}