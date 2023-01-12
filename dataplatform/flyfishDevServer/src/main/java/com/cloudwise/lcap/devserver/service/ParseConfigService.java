package com.cloudwise.lcap.devserver.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.entity.Application;
import com.cloudwise.lcap.commonbase.entity.Component;
import com.cloudwise.lcap.commonbase.entity.ComponentCategory;
import com.cloudwise.lcap.commonbase.entity.Project;
import com.cloudwise.lcap.commonbase.mapper.*;
import com.cloudwise.lcap.devserver.dto.ConfigFileParser;
import com.cloudwise.lcap.devserver.dto.Manifest;
import com.cloudwise.lcap.devserver.dto.ResourceApplicationDto;
import com.cloudwise.lcap.devserver.dto.ResourceComponentDto;
import com.google.common.collect.Lists;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.APPLICATION;
import static com.cloudwise.lcap.commonbase.contants.Constant.COMPONENT;

/**
 * 导入导出功能之解析配置文件的逻辑
 */
@Service
public class ParseConfigService {

    @Autowired
    private ApplicationMapper applicationDao;
    @Autowired
    private ComponentMapper componentDao;
    @Autowired
    private ProjectMapper projectDao;
    @Autowired
    private ComponentCategoryMapper categoryDao;
    @Autowired
    private ComponentProjectRefMapper componentProjectMapper;

    public ConfigFileParser parseApplication(Manifest manifest) {
        ConfigFileParser response = new ConfigFileParser();
        response.setType(APPLICATION);
        response.setApplicationExportType(manifest.getApplicationExportType());
        response.setComponentExportType(manifest.getComponentExportType());
        // 应用信息,兼容5.5,解析配置文件用到这个字段（本来可以直接从 manifest.applicationList 获取信息）
        List<ResourceApplicationDto> applications = manifest.getApplicationList();

        // 应用有组件信息
        List<String> applicationIds = applications.stream().map(ResourceApplicationDto::getId).collect(Collectors.toList());
        List<Application> applicationList = applicationDao.selectBatchIds(applicationIds);
        Map<String, Application> collects = applicationList.stream().collect(Collectors.toMap(Application::getId, o -> o));

        // 获取组件为新增还是修改
        List<ResourceApplicationDto> applicationDtoList = new ArrayList<>();
        for (ResourceApplicationDto dto : applications) {
            if (collects.containsKey(dto.getId())) {
                // 更新
                dto.setUpdate(true);
                Application app = collects.get(dto.getId());
                dto.setProjectId(app.getProjectId());
                List<String> projectName = this.getProjectName(Collections.singletonList(app.getProjectId()));
                if (CollectionUtils.isNotEmpty(projectName)) {
                    dto.setProjectName(projectName.get(0));
                }
            }

            List<ResourceComponentDto> components = dto.getComponents();
            if (CollectionUtils.isNotEmpty(components)) {
                //应用下存在重复组件
                Set<String> componentCategoryIds = new HashSet<>();
                Map<String, ResourceComponentDto> componentViewDtoMap = new HashMap<>();
                for (ResourceComponentDto component : components) {
                    if (StringUtils.isNotBlank(component.getId())) {
                        componentViewDtoMap.putIfAbsent(component.getId(), component);
                        componentCategoryIds.add(component.getCategory());
                        componentCategoryIds.add(component.getSubCategory());
                    }
                }
                Set<String> componentIds = CollectionUtil.emptyIfNull(componentViewDtoMap.keySet());

                List<ComponentCategory> componentCategories = categoryDao.selectBatchIds(componentCategoryIds);
                Map<String, String> componentCategoryMap = componentCategories.stream().collect(Collectors.toMap(ComponentCategory::getId, ComponentCategory::getName));
                List<JSONObject> componentProjectRefs = componentProjectMapper.selectByComponentIds(componentIds);

                Map<String, Component> collect1 = componentDao.selectBatchIds(componentIds).stream().collect(Collectors.toMap(o -> o.getId(), o -> o));
                componentViewDtoMap.forEach((k, t) -> {
                    //判断组件费否为更新
                    Component cp = collect1.get(k);
                    if (null != cp) {
                        //为更新
                        t.setUpdate(true);
                        t.setUpdate(true);
                        t.setCategory(cp.getCategoryId());
                        t.setSubCategory(cp.getSubCategoryId());
                        t.setCategoryName(componentCategoryMap.get(t.getCategory()));
                        t.setSubCategoryName(componentCategoryMap.get(t.getSubCategory()));
                        t.setType(cp.getType());
                        List<String> projectIds = componentProjectRefs.stream().filter(o -> o.getStr("componentId").equals(k)).map(o -> o.getStr("projectId")).collect(Collectors.toList());
                        List<String> projectNames = componentProjectRefs.stream().filter(o -> o.getStr("componentId").equals(k)).map(o -> o.getStr("projectName")).collect(Collectors.toList());
                        t.setProjects(projectIds);
                        t.setProjectsName(projectNames);
                    }
                });
                dto.setComponents(Lists.newArrayList(componentViewDtoMap.values()));
            }
            applicationDtoList.add(dto);
        }
        response.setApplications(applicationDtoList);
        return response;
    }

    public ConfigFileParser parseComponent(Manifest manifest) {
        ConfigFileParser response = new ConfigFileParser();
        response.setType(COMPONENT);
        response.setApplicationExportType(manifest.getApplicationExportType());
        response.setComponentExportType(manifest.getComponentExportType());
        //组件信息,兼容5.5,解析配置文件用到这个字段（本来可以直接从 manifest.componentList 获取信息）
        List<ResourceComponentDto> components = manifest.getComponentList();
        Set<String> componentIds = new HashSet<>();
        Set<String> componentCategoryIds = new HashSet<>();
        for (ResourceComponentDto component : components) {
            componentIds.add(component.getId());
            componentCategoryIds.add(component.getCategory());
            componentCategoryIds.add(component.getSubCategory());
        }

        List<ComponentCategory> componentCategories = categoryDao.selectBatchIds(componentCategoryIds);
        Map<String, String> componentCategoryMap = componentCategories.stream().collect(Collectors.toMap(ComponentCategory::getId, ComponentCategory::getName));
        List<JSONObject> componentProjectRefs = componentProjectMapper.selectByComponentIds(componentIds);


        Map<String, Component> collects = componentDao.selectBatchIds(componentIds).stream().collect(Collectors.toMap(Component::getId, o -> o));
        for (ResourceComponentDto dto : components) {
            String id = dto.getId();
            if (collects.containsKey(id)) {
                Component component = collects.get(id);

                dto.setUpdate(true);
                dto.setUpdate(true);
                dto.setCategory(component.getCategoryId());
                dto.setSubCategory(component.getSubCategoryId());
                dto.setCategoryName(componentCategoryMap.get(component.getCategoryId()));
                dto.setSubCategoryName(componentCategoryMap.get(component.getSubCategoryId()));
                dto.setType(component.getType());
                List<String> projectIds = componentProjectRefs.stream().filter(o -> o.getStr("componentId").equals(id)).map(o -> o.getStr("projectId")).collect(Collectors.toList());
                List<String> projectNames = componentProjectRefs.stream().filter(o -> o.getStr("componentId").equals(id)).map(o -> o.getStr("projectName")).collect(Collectors.toList());
                dto.setProjects(projectIds);
                dto.setProjectsName(projectNames);
            }
        }
        response.setComponents(components);
        return response;
    }

    private List<String> getProjectName(List<String> ids) {
        List<String> projectsName = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(ids)) {
            List<Project> projects = projectDao.selectBatchIds(ids);
            projectsName = projects.stream().map(Project::getName).collect(Collectors.toList());
        }
        return projectsName;
    }
}
