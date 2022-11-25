package com.cloudwise.lcap.source.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cloudwise.lcap.common.BaseResponse;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.utils.FileUtils;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.source.dao.*;
import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import com.cloudwise.lcap.source.model.*;
import com.cloudwise.lcap.source.service.dto.Manifest;
import com.cloudwise.lcap.source.service.dto.ResourceImportResult;
import com.google.common.collect.HashMultiset;
import com.google.common.collect.Multiset;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileFilter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.*;

@Slf4j
@Service
public class ImportResourceServer {

    /**
     * 组件保存位置
     */
    @Value("${component_basepath}")
    private String component_basepath;
    @Value("${application_basepath}")
    private String application_baseapth;
    @Value("${www_relative_path}")
    private String www_relative_path;

    /**
     * 组件压缩文件包上传时的临时目录
     */
    @Value("${component_upload_tmp_basepath}")
    private String upload_tmp_basepath;

    @Autowired
    private ComponentDao componentDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    /**
     * @param key
     * @param manifest     配置文件
     * @param applications 用户前端传递的参数
     */
    public void importApplications(String key, Manifest manifest, List<ApplicationDto> applications, ResourceImportResult importResult) {
        //导入应用
        // 1.优先校验前端传递给后端的应用名称是否存在重复
        List<String> collect = applications.stream().map(ApplicationDto::getName).collect(Collectors.toList());
        List<String> lists = HashMultiset.create(collect).entrySet().stream()
                .filter(t -> t.getCount() > 1).map(Multiset.Entry::getElement).collect(Collectors.toList());
        if (CollectionUtils.isNotEmpty(lists)) {
            throw new BaseException("应用名称" + lists + "存在重复!");
        }
        //组件信息，用户在前端页面可能勾选导入部分组件
        Map<String, ComponentDto> componentDtoMap = new HashMap<>();
        //导入应用和组件
        User adminUser = mongoTemplate.findOne(new Query(Criteria.where("username").is("admin")), User.class);
        Map<String,Component> idMap = new HashMap<>();
        for (ApplicationDto application : applications) {
            Application app = mongoTemplate.findOne(new Query(Criteria.where("name").is(application.getName())), Application.class);
            if (app == null) {
                app = new Application();
                app.setId(ObjectId.get());
            }
            List<ComponentDto> components = application.getComponents();
            if (CollectionUtils.isNotEmpty(components)) {
                Set<String> componentNames = components.stream().map(ComponentDto::getName).collect(Collectors.toSet());
                List<Component> componentList = mongoTemplate.find(new Query(Criteria.where("name").in(componentNames)), Component.class);
                Map<String, Component> collect1 = componentList.stream().collect(Collectors.toMap(Component::getName, o -> o));
                for (ComponentDto dto : components) {
                    Component component = collect1.get(dto.getName());
                    if (null == component) {
                        component = new Component();
                        component.setId(new ObjectId());
                    }
                    idMap.put(dto.getId(), component);
                    componentDtoMap.putIfAbsent(dto.getId(), dto);
                }
            }

            if (StringUtils.isNotEmpty(application.getPages())) {
                List<JSONObject> pages = JSONUtil.toList(application.getPages(), JSONObject.class);
                for (JSONObject page : pages) {
                    List<JSONObject> pageComponents = page.getBeanList("components", JSONObject.class);
                    for (JSONObject pageComponent : pageComponents) {
                        //组件修改id为对应的ObjectId
                        if (pageComponent.containsKey("type") && componentDtoMap.containsKey(pageComponent.getStr("type"))) {
                            String componentId = pageComponent.getStr("type");
                            //优先使用用户设置的版本号
                            pageComponent.put("version", componentDtoMap.get(componentId).getVersion());
                            pageComponent.put("type", idMap.get(componentId).getId().toHexString());
                        }
                    }
                    //处理大屏背景图
                    JSONObject options = page.getJSONObject("options");
                    if (MapUtils.isNotEmpty(options) && options.containsKey("backgroundImage")){
                        String backgroundImage = options.getStr("backgroundImage");
                        if (StringUtils.isNotBlank(backgroundImage)){
                            backgroundImage = www_relative_path + APPLICATIONS + File.separator + app.getId().toHexString() + backgroundImage.substring(backgroundImage.lastIndexOf("/"));
                            options.put("backgroundImage",backgroundImage);
                        }
                    }
                    page.put("options",options);
                    page.put("components", pageComponents);
                }
                application.setPages(JSONUtil.toJsonStr(pages));
            }

            app.setDevelopStatus("doing");
            app.setCover(application.getCover());
            app.setStatus("valid");
            app.setPages(JSONUtil.toList(application.getPages(), JSONObject.class));
            app.setName(application.getName());
            app.setProjectId(application.getProjectId());
            app.setIsFromDocc(false);
            app.setIsFromDoma(false);
            app.setType(application.getType());
            app.setIsLib(application.getIsLib());
            app.setIsRecommend(false);
            app.setCreator(adminUser.getId().toHexString());
            app.setUpdater(adminUser.getId().toHexString());
            app.setCreateTime(new Date());
            app.setUpdateTime(new Date());
            mongoTemplate.save(app);

            //导入应用文件
            String sourcePath = upload_tmp_basepath + File.separator + key + APPLICATIONS + File.separator + application.getId();
            File[] files = new File(sourcePath).listFiles();
            if (files != null && files.length > 0) {
                for (File file : files) {
                    //2 将包复制到组件文件夹
                    FileUtils.copyFolder(sourcePath + File.separator + file.getName(), null, application_baseapth + File.separator + app.getId().toHexString());
                }
            }
            importResult.getApplicationImportSuccess().add(application.getName());
        }
        Map<String,String> originComponentIdAndVersionMap = new HashMap<>();
        List<ApplicationDto> applicationList = manifest.getApplicationList();
        for (ApplicationDto applicationDto : applicationList) {
            if (CollectionUtils.isNotEmpty(applicationDto.getComponents())){
                List<ComponentDto> components = applicationDto.getComponents();
                originComponentIdAndVersionMap.putAll(components.stream().collect(Collectors.toMap(ComponentDto::getId,ComponentDto::getVersion)));
            }
        }
        importComponents(key,originComponentIdAndVersionMap, componentDtoMap.values(), idMap, importResult);
    }

    /**
     *
     * @param key 导入的包的key,据此获取导入的组件源码等文件
     * @param originComponentIdAndVersionMap 原始组件的id和版本,导出时的版本号(在导入时可能会修改版本号,导致和原始版本号不一致，此时在配置文件setting.js/main.js中需要修改为正确的版本号)
     * @param componentDtoList 待导入的组件列表
     * @param idMap 组件id映射 (5.6版本切换为mysql存储,组件id生成规则等不同于5.5的mongo)
     * @param importResult
     */
    public void importComponents(String key, Map<String, String> originComponentIdAndVersionMap,Collection<ComponentDto> componentDtoList, Map<String, Component> idMap, ResourceImportResult importResult) {
        // 校验应用名称是否存在重复
        if (CollectionUtils.isEmpty(componentDtoList)) {
            log.error("导入组件时组件列表为空");
            return;
        }
        for (ComponentDto dto : componentDtoList) {
            String sourceFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + dto.getId();
            if (!new File(sourceFolder).exists()) {
                log.error("组件:{} 文件:{} 不存在,导入失败", dto.getName(), sourceFolder);
                importResult.getComponentImportFailed().add(dto.getName());
            }
        }
        //原始的组件版本
        User adminUser = mongoTemplate.findOne(new Query(Criteria.where("username").is("admin")), User.class);
        boolean isUpdate = false;
        for (ComponentDto originComponent : componentDtoList) {
            String userVersion = originComponent.getVersion();
            String originId = originComponent.getId();
            String originVersion = originComponentIdAndVersionMap.get(originId);
            log.info("originId:{},userVersion:{},userVersion:{}",originId,userVersion,originVersion);
            //用户手动设置的版本号
            Component component = idMap.get(originId);
            ObjectId objectId = component.getId();
            if (StringUtils.isNotBlank(component.getName())) {
                // 获取新平台中组件的版本 versions
                List<JSONObject> versions = component.getVersions();
                if (CollectionUtils.isEmpty(versions)) {
                    versions = new ArrayList<>();
                }
                List<String> componentHistoryVersion = versions.stream().map(obj -> obj.getStr("no")).collect(Collectors.toList());
                if (!componentHistoryVersion.contains(userVersion)) {
                    // 类似于新增 将新增的版本添加到versions中
                    JSONObject jsonObjects = new JSONObject().set("no", userVersion).set("time", new Date()).set("status", "valid").set("desc", userVersion);
                    versions.add(jsonObjects);
                }
                component.setVersions(versions);
                isUpdate = true;
            } else {
                //组件为新增
                JSONObject version = new JSONObject().set("no", userVersion).set("time", new Date()).set("status", "valid").set("desc", userVersion);
                component.setVersions(Collections.singletonList(version));
            }
            //先复制对应的版本，因为牵涉到修改最新版的版本名称
            String sourcePath = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + originId + File.separator + originVersion;
            String destFolder = component_basepath + File.separator + objectId.toHexString() + File.separator + userVersion;
            String coverFile = getCover(destFolder);
            if (null != coverFile) {
                String cover = www_relative_path + COMPONENTS + File.separator + objectId.toHexString() + File.separator + userVersion + COMPONENT_RELEASE + coverFile;
                log.info("objectId:{} cover:{}",objectId.toHexString(),cover);
                originComponent.setCover(cover);
            }
            if (isUpdate){
                componentDao.upsert(buildComponent(originComponent, component, adminUser));
            }else {
                componentDao.insert(buildComponent(originComponent, component, adminUser));
            }

            //读取组件信息，导入到新环境的表
            String releaseMain = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + originId + File.separator + originVersion + RELEASE_MAIN;
            String releaseSetting = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + originId + File.separator + originVersion + RELEASE_SETTING;
            if (originVersion.equalsIgnoreCase(userVersion)){
                //用户修改了组件版本,则修改待导入文件中的版本信息
                //导出的文件中的最新版本号
                //替换new cover文件中的version标识
                FileUtils.autoReplace(releaseMain, originVersion, userVersion);
                FileUtils.autoReplace(releaseSetting, originVersion, userVersion);
            }
            //(5.6版本切换为mysql存储,组件id生成规则等不同于5.5的mongo)替换组件的id
            FileUtils.autoReplace(releaseMain, originId, objectId.toHexString());
            FileUtils.autoReplace(releaseSetting, originId, objectId.toHexString());
            File[] files = new File(sourcePath).listFiles();
            if (files != null && files.length > 0) {
                for (File file : files) {
                    //2 将包复制到组件文件夹
                    FileUtils.copyFolder(sourcePath + File.separator + file.getName(), null, destFolder);
                }
            }
            importResult.getComponentImportSuccess().add(component.getName());
        }
    }


    public String getCover(String sourceFolder) {
        String coverFile = null;
        File file = new File(sourceFolder + COMPONENT_RELEASE);
        if (file.exists() && file.isDirectory()) {
            File[] covers = file.listFiles(pathname -> pathname.isFile() && pathname.getName().startsWith("cover"));
            if (null != covers && covers.length > 0) {
                coverFile = File.separator + covers[0].getName();
            }
        }
        return coverFile;
    }

    public static Component buildComponent(ComponentDto originComponent, Component component, User adminUser) {
        List<String> projects = component.getProjects();
        if (null == projects) {
            projects = new ArrayList<>();
        }
        if (CollectionUtils.isNotEmpty(originComponent.getProjects())) {
            projects.addAll(originComponent.getProjects());
        }
        component.setProjects(projects);

        List<String> applications = component.getApplications();
        if (null == applications) {
            applications = new ArrayList<>();
        }
        if (CollectionUtils.isNotEmpty(originComponent.getApplications())) {
            applications.addAll(originComponent.getApplications());
        }
        component.setApplications(applications);
        component.setTags(new ArrayList<>());

        component.setName(originComponent.getName());
        component.setType(originComponent.getType());
        component.setCover(originComponent.getCover());
        component.setCategory(originComponent.getCategory());
        component.setSubCategory(originComponent.getSubCategory());
        component.setStatus(originComponent.getStatus());
        component.setDevelopStatus(originComponent.getDevelopStatus());
        component.setStatus("valid");
        component.setDevelopStatus("online");
        component.setAutomatic_cover(1);
        component.setFrom(originComponent.getFrom());
        component.setIsLib(originComponent.getIsLib());
        component.setDesc(originComponent.getDesc());
        component.setIsLib(originComponent.getIsLib());
        component.setCreator(adminUser.getId().toHexString());
        component.setUpdater(adminUser.getId().toHexString());
        component.setCreateTme(new Date());
        component.setUpdateTime(new Date());
        return component;
    }

    public static void main(String[] args) {

        String configFilePath = "/Users/yinqiqi/Downloads/application20221121182106/config_filename";
        Manifest manifest = JsonUtils.parse(FileUtils.readJson(configFilePath), Manifest.class);

        Map<String,String> originComponentIdAndVersionMap = new HashMap<>();
        List<ApplicationDto> applicationList = manifest.getApplicationList();
        for (ApplicationDto applicationDto : applicationList) {
            if (CollectionUtils.isNotEmpty(applicationDto.getComponents())){
                List<ComponentDto> components = applicationDto.getComponents();
                originComponentIdAndVersionMap.putAll(components.stream().collect(Collectors.toMap(ComponentDto::getId,ComponentDto::getVersion)));
            }
        }

        log.info("originComponentIdAndVersionMap:{}",originComponentIdAndVersionMap);
    }
}
