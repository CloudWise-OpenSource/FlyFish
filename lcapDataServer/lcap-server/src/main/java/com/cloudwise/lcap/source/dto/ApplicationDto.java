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
public class ApplicationDto {

    private String id;
    private String accountId;

    // 标签
    private List<String> tags;
    private String developStatus;
    // 封面 不再存储，就在www/applications/cover.jpeg
    private String cover;
    private String status;
    private List<JSONObject> pages;
    private String name;
    private String projectId;
    private String projectName;
    private boolean update;
    // 应用类型
    private String type;
    private String creator;
    private String updater;
    private Date createTime;
    private Date updateTime;
    // 模板库
    private Boolean isLib;
    private List<ComponentDto> components;
}
