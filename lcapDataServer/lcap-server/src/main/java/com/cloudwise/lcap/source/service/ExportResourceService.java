package com.cloudwise.lcap.source.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.BaseResponse;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.exception.ResourceNotFoundException;
import com.cloudwise.lcap.common.utils.Assert;
import com.cloudwise.lcap.common.utils.FileUtils;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.source.dao.*;
import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import com.cloudwise.lcap.source.model.Application;
import com.cloudwise.lcap.source.model.Component;
import com.cloudwise.lcap.source.model.ComponentCategory;
import com.cloudwise.lcap.source.model.Project;
import com.cloudwise.lcap.source.service.dto.ApplicationExportRequest;
import com.cloudwise.lcap.source.service.dto.ComponentExportRequest;
import com.cloudwise.lcap.source.service.dto.ExportResult;
import com.cloudwise.lcap.source.service.dto.Manifest;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.beetl.core.util.ArraySet;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.*;
import static com.cloudwise.lcap.common.contants.Constant.APPLICATIONS;

@Slf4j
@Service
public class ExportResourceService {

    private static final String APPLICATIONS = "/applications";

    private static final String COMPONENTS = "/components";

    private static final String COMPONENT_RELEASE = "/release";

    private static final String V_CURRENT = "/v-current";

    private static final String V_CURRENT_SRC = "/src";
    private static final String V_CURRENT_DEPENDED = "/node_modules";

    private static final String RELEASE_MAIN = "/release/main.js";

    private static final String RELEASE_SETTING = "/release/setting.js";

    /**
     * 原始文件基础路径
     */
    @Value("${file.basepath}")
    private String fileBasepath;

    /**
     * 组件保存位置
     */
    @Value("${component_basepath}")
    private String component_basepath;

    @Value("${application_basepath}")
    private String application_baseapth;

    /**
     * 导出组件时创建临时目录的基础路径
     * 在改基础路径下生成一个个临时目录
     */
    @Value("${component_down_tmp_basepath}")
    private String down_tmp_basepath;

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
    private ComponentDao componentDao;

    @Autowired
    private ApplicationDao applicationDao;

    @Autowired
    private ProjectDao projectDao;

    @Autowired
    private ComponentCategoryDao categoryDao;

    public void exportComponents(Set<String> ids, String folder) {
        // 校验组件个数
        if (CollectionUtils.isNotEmpty(ids)) {
            Assert.assertFalse(ids.size() > 50, "应用和组件不得多于50个!");
            // 需校验创建模块是否存在  若不存在，则直接报错，不需要导出
            Set<String> componentsName = new HashSet<>();
            List<Component> componentsInfo = componentDao.findByIds(ids);
            Map<String, Component> collect = componentsInfo.stream().collect(Collectors.toMap(o -> o.getId().toHexString(), o -> o));
            Map<String, String> componentRecentVersion = new HashMap<>();

            List<ComponentDto> componentDtoList = new ArrayList<>();
            for (String id : ids) {
                Component component = collect.get(id);
                if (null == component) {
                    log.error("组件id:{}不存在，导出资源失败!", id);
                    throw new ResourceNotFoundException("组件不存在，导出资源失败!");
                }
                String recentVersion = getComponentNewestVersion(component.getVersions());
                if (StringUtils.isEmpty(recentVersion)) {
                    log.error("组件最新版本不存在");
                    throw new BaseException("组件无版本信息，导出资源失败!");
                }
                componentRecentVersion.put(id, recentVersion);
                //根据导出类型判断 是否存在 /{recentVersion}/release
                String componentFilePath = fileBasepath + COMPONENTS + File.separator + id + File.separator + recentVersion + COMPONENT_RELEASE;
                if (!new File(componentFilePath).exists()) {
                    log.error("组件:{} 版本:{} 不存在", component.getName(), componentFilePath);
                    componentsName.add(component.getName() + File.separator + recentVersion + COMPONENT_RELEASE);
                }

                ComponentDto dto = new ComponentDto();
                dto.setId(component.getId().toHexString());
                BeanUtils.copyProperties(component, dto);
                componentDtoList.add(dto);
            }
            if (CollectionUtils.isNotEmpty(componentsName)) {
                throw new BaseException("组件" + componentsName + "资源包不存在，导出资源失败!");
            }


            for (String componentId : ids) {
                String recentVersion = componentRecentVersion.get(componentId);
                // 最新版本目录 只需要release目录
                String componentFilePath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + recentVersion;
                String filePath = folder + COMPONENTS + File.separator + componentId;
                log.info("导出组件:{} 的最新版本release文件:{} 到:{}", componentId, componentFilePath, filePath);
                FileUtils.copyFolder(componentFilePath, null, filePath);
            }

            Manifest manifest = Manifest.builder().componentExportType(Collections.singletonList("componentRelease"))
                    .componentList(componentDtoList).time(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).build();
            FileUtils.writeJson(folder, config_filename, new JSONObject(JsonUtils.toJSONString(manifest)));
        }

    }

    public void exportApplication(List<ApplicationDto> applications, String folder) {
        Manifest manifest = new Manifest();
        manifest.setType(APPLICATION);
        manifest.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 应用详细信息
        manifest.setApplicationList(applications);
        // 组件详细信息
        List<Component> list = componentDao.findByIds(this.getComponentIds(applications));
        List<ComponentDto> componentList = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(list)) {
            list.forEach(t -> {
                ComponentDto componentDto = new ComponentDto();
                componentDto.setId(t.getId().toHexString());
                BeanUtils.copyProperties(t, componentDto);
                componentList.add(componentDto);
            });
        }
        manifest.setComponentList(componentList);

        // 写入配置
        FileUtils.writeJson(folder, config_filename, new JSONObject(JsonUtils.toJSONString(manifest)));

        for (ApplicationDto app : applications) {
            String id = app.getId();
            // 应用cover基础路径 /applications/6209cd83ce4fee178aa18f77/*
            String appBasePath = fileBasepath + APPLICATIONS + File.separator + id;
            File appBaseCoverPath = new File(appBasePath);

            if (!appBaseCoverPath.exists() || Objects.requireNonNull(Objects.requireNonNull(appBaseCoverPath.listFiles())).length == 0) {
                continue;
            }

            // covers拷贝到的目录
            String destFilePath = folder + APPLICATIONS;
            FileUtils.copyFolder(appBasePath, null, destFilePath);
        }

    }

    public Set<String> getComponentIds(List<ApplicationDto> applications) {
        Set<String> ids = new ArraySet<>();
        for (ApplicationDto application : applications) {
            List<JSONObject> pages = application.getPages();
            if (CollectionUtil.isNotEmpty(pages)) {
                for (JSONObject page : pages) {
                    List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                    if (CollectionUtil.isNotEmpty(components)) {
                        for (JSONObject object1 : components) {
                            String componentId = object1.getStr("type");
                            if ("PageLink".equalsIgnoreCase(componentId)){
                                ids.add(object1.getStr("type"));
                            }
                        }
                    }
                }
            }
        }
        return ids;
    }

    private String getComponentNewestVersion(List<JSONObject> versions) {
        if (CollectionUtils.isEmpty(versions)) {
            return null;
        }
        int size = versions.size();
        JSONObject jsonObject = versions.get(size - 1);
        return (String) jsonObject.get("no");
    }

    private List<ComponentDto> generatorComponent(List<Component> components) {
        if (CollectionUtils.isEmpty(components)) {
            return Lists.newArrayList();
        }

        List<ComponentDto> componentViewDtos = new ArrayList<>();
        components.forEach(t -> {
            ComponentDto dto = new ComponentDto();
            dto.setId(t.getId().toHexString());
            dto.setName(t.getName());

            dto.setIsLab(t.getIsLib());
            dto.setFrom(t.getFrom());
            dto.setAllowDataSearch(t.getAllowDataSearch());
            dto.setCreator(t.getCreator());
            dto.setCreateTme(t.getCreateTme());
            dto.setDesc(t.getDesc());

            String categoryId = t.getCategory();
            dto.setCategory(categoryId);
            dto.setSubCategory(t.getSubCategory());

            // version和developStatus
            dto.setDevelopStatus(t.getDevelopStatus());
            dto.setVersion(this.getComponentNewestVersion(t.getVersions()));

            if (StringUtils.isNotBlank(categoryId)) {
                List<ComponentCategory> categoryList = categoryDao.findCategoryById(categoryId);
                if (CollectionUtils.isNotEmpty(categoryList)) {
                    outCycle:
                    for (ComponentCategory category : categoryList) {
                        if (null == category) {
                            continue;
                        }

//                        List<JSONObject> children = JSON.parseArray(category.getCategories().get(0).getStr("children"), JSONObject.class);
                        if (CollectionUtils.isEmpty(category.getCategories())) {
                            continue;
                        }
                        List<JSONObject> categories = category.getCategories();
                        for (JSONObject cg : categories) {
                            List<JSONObject> children = JsonUtils.parseArray(cg.getStr("children"), JSONObject.class);
                            if (CollectionUtils.isNotEmpty(children)) {
                                for (JSONObject child : children) {
                                    String subId = (String) child.get("id");
                                    if (t.getSubCategory().equals(subId)) {
                                        dto.setCategoryName((String) child.get("name"));
                                        break outCycle;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            dto.setProjects(t.getProjects());
            if (CollectionUtils.isNotEmpty(t.getProjects())) {
                Project project = projectDao.findByProjectId(new ObjectId(t.getProjects().get(0)));
                if (null != project) {
                    dto.setProjectsName(Collections.singletonList(project.getName()));
                }
            }

            dto.setType(t.getType());
            componentViewDtos.add(dto);
        });

        return componentViewDtos;
    }
}
