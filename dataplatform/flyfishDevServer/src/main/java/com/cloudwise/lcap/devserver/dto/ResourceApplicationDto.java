package com.cloudwise.lcap.devserver.dto;

import com.cloudwise.lcap.commonbase.entity.AppVar;
import com.cloudwise.lcap.commonbase.entity.Application;
import lombok.*;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * 大屏、组件导入导出功能的基础类
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResourceApplicationDto implements Serializable {

    private String id;
    private String name;
    private String cover;
    private String pages;
    //3d 2d
    private String type;
    private String developStatus;
    private Integer isLib;
    private Integer isRecommend;
    //大屏被删除，使用 invalid 字段代表是否删除，业务上称作"回收站"
    private Integer invalid;
    private String initFrom;
    private String models;
    private String modelId;
    private String projectId;
    private String projectName;
    private List<String> tags;
    private Boolean update = false;
    private List<ResourceComponentDto> components;
    private List<AppVar> appVars;

    public static ResourceApplicationDto beanToDto(Application application, Map<String, List<String>> appTagNameMap) {
        String appId = application.getId();
        ResourceApplicationDto build = ResourceApplicationDto.builder()
                .id(appId).name(application.getName()).projectId(application.getProjectId())
                .projectName(application.getName()).invalid(0)
                .developStatus(application.getDevelopStatus()).type(application.getType())
                .cover(application.getCover()).pages(application.getPages()).isLib(application.getIsLib())
                .isRecommend(application.getIsRecommend()).initFrom(application.getInitFrom()).tags(appTagNameMap.get(appId))
                .models(application.getModels()).modelId(application.getModelId()).build();
        return build;
    }



}
