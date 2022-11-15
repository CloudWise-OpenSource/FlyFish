package com.cloudwise.lcap.source.service;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.BaseResponse;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.utils.FileUtils;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.source.dao.ApplicationDao;
import com.cloudwise.lcap.source.dao.ComponentCategoryDao;
import com.cloudwise.lcap.source.dao.ComponentDao;
import com.cloudwise.lcap.source.dao.ProjectDao;
import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import com.cloudwise.lcap.source.model.Application;
import com.cloudwise.lcap.source.model.Component;
import com.cloudwise.lcap.source.model.ComponentCategory;
import com.cloudwise.lcap.source.model.Project;
import com.cloudwise.lcap.source.service.dto.ConfigFileParser;
import com.cloudwise.lcap.source.service.dto.Manifest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.APPLICATION;
import static com.cloudwise.lcap.common.contants.Constant.COMPONENT;

@Slf4j
@Service
public class ConfigFileParseService {
    /**
     * 组件压缩文件包上传时的临时目录
     */
    @Value("${component_upload_tmp_basepath}")
    private String upload_tmp_basepath;
    /**
     * 配置文件名称
     */
    @Value("${config_filename}")
    private String config_filename;

    @Autowired
    private ApplicationDao applicationDao;
    @Autowired
    private ComponentDao componentDao;

    @Autowired
    private ProjectDao projectDao;
    @Autowired
    private ComponentCategoryDao categoryDao;

    public ConfigFileParser parseConfigFile(String key) {
        // 读取配置文件
        String configFilePath = upload_tmp_basepath + File.separator + key + File.separator + config_filename;
        if (!new File(configFilePath).exists()) {
            log.error("导入的压缩包中配置文件:{}不存在", configFilePath);
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }
        Manifest manifest = JsonUtils.parse(FileUtils.readJson(configFilePath), Manifest.class);
        ConfigFileParser response = new ConfigFileParser();
        response.setApplicationExportType(manifest.getApplicationExportType());
        response.setComponentExportType(manifest.getComponentExportType());

        if (APPLICATION.equals(manifest.getType())) {
            List<ApplicationDto> applications = manifest.getApplicationList();
            List<String> applicationNames = applications.stream().map(ApplicationDto::getName).collect(Collectors.toList());
            //为了兼容5.6(转换为mysql后组件id都变化了)，需要根据名字进行判断是新增还是更新
            List<Application> applicationList = applicationDao.findByNames(applicationNames);
            List<String> collect = applicationList.stream().map(Application::getName).collect(Collectors.toList());
            Map<String, Application> applicationMap = applicationList.stream().collect(Collectors.toMap(o->o.getName(),o->o));

            // 获取组件为新增还是修改
            for (ApplicationDto dto : applications) {
                if (collect.contains(dto.getName())) {
                    dto.setUpdate(true);
                    Application app = applicationMap.get(dto.getName());
                    dto.setProjectId(app.getProjectId());
                    Project project = projectDao.findByProjectId(new ObjectId(app.getProjectId()));
                    if (null != project) {
                        dto.setProjectName(project.getName());
                    }
                } else {
                    // 新建 查询project from is lcap-init
                    Project project = projectDao.findByInitProject();
                    if (null != project) {
                        dto.setProjectId(project.getId().toHexString());
                        dto.setProjectName(project.getName());
                    }
                }

                // 应用下存在组件，需要获取组件费否为更新
                List<ComponentDto> components = dto.getComponents();
                if (CollectionUtils.isNotEmpty(components)) {
                    List<String> componentIds = components.stream().map(ComponentDto::getId).collect(Collectors.toList());
                    List<Component> cpList = componentDao.findByIds(componentIds);
                    Map<String, Component> collect1 = cpList.stream().collect(Collectors.toMap(o -> o.getId().toHexString(), o -> o));
                    for (ComponentDto t : components) {
                        Component cp = collect1.get(t.getId());
                        if (null != cp) {
                            t.setUpdate(true);
                            String category = cp.getCategory();
                            String subCategory = cp.getSubCategory();
                            t.setCategory(category);
                            t.setSubCategory(subCategory);
                            t.setCategoryName(this.getSubCategoryName(category, subCategory));
                            t.setType(cp.getType());
                            t.setProjects(cp.getProjects());
                            t.setProjectsName(this.getProjectName(cp.getProjects()));
                        }
                    }
                }
            }
            response.setType(APPLICATION);
            response.setApplications(applications);
        } else {
            // 组件信息
            List<ComponentDto> components = manifest.getComponentList();
            List<String> componentNames = components.stream().map(ComponentDto::getName).collect(Collectors.toList());
            //为了兼容5.6(转换为mysql后组件id都变化了)，需要根据名字进行判断是新增还是更新
            List<Component> componentList = componentDao.findByNames(componentNames);
            Map<String, Component> componentMap = componentList.stream().collect(Collectors.toMap(o->o.getName(),o->o));

            for (ComponentDto dto : components) {
                if (componentMap.containsKey(dto.getName())) {
                    dto.setUpdate(true);
                    Component component = componentMap.get(dto.getName());
                    String category = component.getCategory();
                    String subCategory = component.getSubCategory();
                    dto.setCategory(category);
                    dto.setSubCategory(subCategory);
                    dto.setCategoryName(this.getSubCategoryName(category, subCategory));
                    dto.setType(component.getType());
                    dto.setProjects(component.getProjects());
                    dto.setProjectsName(this.getProjectName(component.getProjects()));
                }
            }
            response.setType(COMPONENT);
            response.setComponents(components);
        }
        return response;
    }

    private List<String> getProjectName(List<String> ids) {
        if (CollectionUtils.isEmpty(ids)) {
            return null;
        }
        List<String> projectsName = null;
        List<Project> projects = projectDao.findByIds(ids);
        if (CollectionUtils.isNotEmpty(projects)) {
            projectsName = projects.stream().map(Project::getName).collect(Collectors.toList());
        }
        return projectsName;
    }


    private String getSubCategoryName(String categoryId, String subCategoryId) {
        if (StringUtils.isBlank(categoryId) || StringUtils.isBlank(subCategoryId)) {
            return null;
        }
        String name = null;
        List<ComponentCategory> categoryList = categoryDao.findCategoryById(categoryId);
        if (CollectionUtils.isNotEmpty(categoryList)) {
            outCycle:
            for (ComponentCategory category : categoryList) {
                if (null == category) {
                    continue;
                }
                if (CollectionUtils.isEmpty(category.getCategories())) {
                    continue;
                }
                List<JSONObject> categories = category.getCategories();
                for (JSONObject cg : categories) {
                    List<JSONObject> children = JsonUtils.parseArray(cg.getStr("children"), JSONObject.class);
                    if (CollectionUtils.isNotEmpty(children)) {
                        for (JSONObject child : children) {
                            String subId = (String) child.get("id");
                            if (subCategoryId.equals(subId)) {
                                name = (String) child.get("name");
                                break outCycle;
                            }
                        }
                    }
                }
            }
        }
        return name;
    }

}
