package com.cloudwise.lcap.commonbase.dto;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationDto implements Serializable {
    private String id;
    private String name;
    private String projectId;
    // 模板库
    private Boolean isLib;
    // 工作台
    private Boolean isRecommend;
    private Boolean isUpdate;
    private String version;
    // 应用开发状态 enum#APP_DEVELOP_STATUS
    private String developStatus;
    // 封面 不再存储，就在www/applications/cover.jpeg
    private String cover;
    // 可用状态 enum#COMMON_STATUS
    private String status;
    private List<Object> pages;
    // 应用类型
    private String type;
    private Long accountId;
    private Long creator;
    private Long updater;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
