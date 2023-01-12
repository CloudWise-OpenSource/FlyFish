package com.cloudwise.lcap.devserver.dto;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.entity.Component;
import com.cloudwise.lcap.commonbase.entity.ComponentCategory;
import com.cloudwise.lcap.commonbase.entity.ComponentProjectRef;
import com.cloudwise.lcap.commonbase.entity.Project;
import lombok.*;
import org.apache.commons.collections4.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 大屏、组件导入导出功能的基础类
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResourceComponentDto {
    private String id;
    private String name;
    private String type;
    private Integer isLib;
    private String dataConfig;
    private String initFrom;
    private String category;
    private String categoryName;
    private String subCategory;
    private String subCategoryName;
    private String desc;
    private String cover;
    private Boolean update;
    private String version;
    //如果导入组件时版本号有变化，通过 version 和 versions[1] 比较版本号
    private List<JSONObject> versions;
    private String automaticCover;
    // 组件开发状态 enum#COMPONENT_DEVELOP_STATU
    private Integer allowDataSearch;
    private String developStatus;
    private List<String> projects;
    private List<String> projectsName;
    private Set<String> tags;

    public static List<ResourceComponentDto> beansToDto(List<Component> components, List<ComponentCategory> componentCategories,
                                                        List<ComponentProjectRef> componentProjectRefs, List<Project> projects, Map<String,Set<String>> tagNameMap) {
        Map<String,String> categoryMap = componentCategories.stream().collect(Collectors.toMap(ComponentCategory::getId,ComponentCategory::getName));
        Map<String, List<ComponentProjectRef>> componentProjectMap = componentProjectRefs.stream().collect(Collectors.groupingBy(ComponentProjectRef::getProjectId));
        List<ResourceComponentDto> data = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(components)) {
            for (Component component : components) {
                String id = component.getId();
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("no",component.getLatestVersion());

                ResourceComponentDto build = ResourceComponentDto.builder().id(id)
                        .name(component.getName()).type(component.getType()).isLib(component.getIsLib()).dataConfig(component.getDataConfig())
                        .category(component.getCategoryId()).subCategory(component.getSubCategoryId()).desc(component.getDesc())
                        .version(component.getLatestVersion()).versions(Collections.singletonList(jsonObject)).cover(component.getCover()).tags(tagNameMap.get(id))
                        .automaticCover(component.getAutomaticCover()).developStatus(component.getDevelopStatus()).initFrom(component.getInitFrom())
                        .allowDataSearch(component.getAllowDataSearch()).build();

                if (categoryMap.containsKey(component.getCategoryId())){
                    build.setCategoryName(categoryMap.get(component.getCategoryId()));
                }
                if (categoryMap.containsKey(component.getSubCategoryId())){
                    build.setSubCategoryName(categoryMap.get(component.getSubCategoryId()));
                }
                if ("project".equals(component.getType()) && CollectionUtils.isNotEmpty(componentProjectMap.get(id))){
                    List<String> collect = componentProjectMap.get(id).stream().map(ComponentProjectRef::getProjectId).collect(Collectors.toList());
                    List<String> projectNames = projects.stream().filter(o -> collect.contains(o.getId())).map(Project::getName).collect(Collectors.toList());
                    build.setProjects(collect);
                    build.setProjectsName(projectNames);
                }

                data.add(build);
            }
        }
        return data;
    }



    public static Component dtoToBean(ResourceComponentDto dto) {
        return Component.builder().id(dto.getId()).name(dto.getName()).categoryId(dto.getCategory()).subCategoryId(dto.getSubCategory())
                .isLib(dto.getIsLib()).dataConfig(dto.getDataConfig()).desc(dto.getDesc()).latestVersion(dto.getVersion())
                .automaticCover("custom").allowDataSearch(dto.getAllowDataSearch()).developStatus(dto.getDevelopStatus()).build();
    }
}