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
import com.cloudwise.lcap.source.model.Application;
import com.cloudwise.lcap.source.model.Component;
import com.cloudwise.lcap.source.model.ImportResult;
import com.cloudwise.lcap.source.model.Project;
import com.cloudwise.lcap.source.service.dto.Manifest;
import com.cloudwise.lcap.source.service.dto.ResourceImportResult;
import com.google.common.collect.HashMultiset;
import com.google.common.collect.Multiset;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.io.File;
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
     *
     * @param key
     * @param manifest 配置文件
     * @param applications 用户前端传递的参数
     */
    public void importApplications(String key, Manifest manifest, List<ApplicationDto> applications,ResourceImportResult importResult){
        //导入应用
        // 1.优先校验前端传递给后端的应用名称是否存在重复
        List<String> collect = applications.stream().map(ApplicationDto::getName).collect(Collectors.toList());
        List<String> lists = HashMultiset.create(collect).entrySet().stream()
                .filter(t -> t.getCount() > 1).map(Multiset.Entry::getElement).collect(Collectors.toList());
        if (CollectionUtils.isNotEmpty(lists)) {
            throw new BaseException("应用名称" + lists + "存在重复!");
        }

        //导入应用和组件
        Map<String, ComponentDto> componentDtoMap = new HashMap<>();
        Map<String, ObjectId> idMap = new HashMap<>();
        Project project = mongoTemplate.findOne(new Query(Criteria.where("from").is("lcap-init")), Project.class);
        for (ApplicationDto application : applications) {
            Application app = mongoTemplate.findOne(new Query(Criteria.where("name").is(application.getName())), Application.class);
            if (app == null) {
                app = new Application();
                app.setId(ObjectId.get());
            }
            List<ComponentDto> components = application.getComponents();
            if (CollectionUtils.isNotEmpty(components)){
                Set<String> componentNames = components.stream().map(ComponentDto::getName).collect(Collectors.toSet());
                List<Component> componentList = mongoTemplate.find(new Query(Criteria.where("name").in(componentNames)), Component.class);
                Map<String, Component> collect1 = componentList.stream().collect(Collectors.toMap(Component::getName, o -> o));
                for (ComponentDto dto : components) {
                    Component component = collect1.get(dto.getName());
                    if (null == component) {
                        idMap.put(dto.getId(), new ObjectId());
                    }else {
                        idMap.put(dto.getId(), component.getId());
                    }
                    componentDtoMap.putIfAbsent(dto.getId(), dto);
                }
            }

            List<JSONObject> pages = application.getPages();
            if (CollectionUtils.isNotEmpty(pages)) {
                for (JSONObject page : pages) {
                    List<JSONObject> pageComponents = page.getBeanList("components", JSONObject.class);
                    for (JSONObject pageComponent : pageComponents) {
                        String componentId = pageComponent.getStr("type");
                        //组件修改id为对应的ObjectId
                        if (componentDtoMap.containsKey(componentId)){
                            //优先使用用户设置的版本号
                            pageComponent.put("version",componentDtoMap.get(componentId).getVersion());
                            pageComponent.put("type", idMap.get(componentId).toHexString());
                        }
                    }
                    page.put("components", pageComponents);
                }
                application.setPages(pages);
            }

            app.setDevelopStatus("doing");
            app.setCover(application.getCover());
            app.setStatus("valid");
            app.setPages(pages);
            app.setName(application.getName());
            app.setProjectId(project.getId().toHexString());
            app.setIsFromDocc(false);
            app.setIsFromDoma(false);
            app.setType(application.getType());
            app.setIsLib(application.getIsLib());
            app.setIsRecommend(false);
            app.setAccountId("110");
            app.setCreator("110");
            app.setUpdateTime(new Date());
            mongoTemplate.save(app);

            //导入应用文件
            String sourcePath = upload_tmp_basepath + File.separator + key + APPLICATIONS + File.separator + application.getId();
            if (new File(sourcePath).exists()) {
                FileUtils.copyFolder(sourcePath, null, application_baseapth);
            }
            importResult.getApplicationImportSuccess().add(application.getName());
        }
        importComponents(key, manifest, componentDtoMap.values(),idMap, importResult);
    }

    public void importComponents(String key, Manifest manifest, Collection<ComponentDto> componentDtoList,Map<String, ObjectId> idMap, ResourceImportResult importResult) {
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
        Map<String, String> originComponentIdAndVersionMap = manifest.getComponentList().stream().collect(Collectors.toMap(ComponentDto::getId, ComponentDto::getVersion));

        Set<String> componentNames = componentDtoList.stream().map(ComponentDto::getName).collect(Collectors.toSet());
        List<Component> componentList = mongoTemplate.find(new Query(Criteria.where("name").in(componentNames)), Component.class);
        Map<String, Component> collect1 = componentList.stream().collect(Collectors.toMap(Component::getName, o -> o));
        for (ComponentDto originComponent : componentDtoList) {
            String userVersion = originComponent.getVersion();
            String originVersion = originComponentIdAndVersionMap.get(originComponent.getId());
            //用户手动设置的版本号
            String componentId = idMap.get(originComponent.getId()).toString();
            originComponent.setId(componentId);
            Component component = collect1.get(originComponent.getName());
            if (null != component){
                // 获取新平台中组件的版本 versions
                List<JSONObject> versions = component.getVersions();
                if (CollectionUtils.isEmpty(versions)) {
                    versions = new ArrayList<>();
                }
                List<String> componentHistoryVersion = versions.stream().map(obj -> obj.getStr("no")).collect(Collectors.toList());
                if (!componentHistoryVersion.contains(userVersion)) {
                    // 类似于新增 将新增的版本添加到versions中
                    JSONObject jsonObjects = new JSONObject().set("no",userVersion).set("time",new Date()).set("status","valid").set("desc",userVersion);
                    versions.add(jsonObjects);
                }
                originComponent.setVersions(versions);
                originComponent.setName(component.getName());
                originComponent.setType(component.getType());
                originComponent.setProjects(component.getProjects());
                originComponent.setCategory(component.getCategory());
                originComponent.setSubCategory(component.getSubCategory());
                originComponent.setAllowDataSearch(component.getAllowDataSearch());
                originComponent.setFrom(component.getFrom());
                originComponent.setIsLib(component.getIsLib());
                originComponent.setDesc(component.getDesc());
                originComponent.setUpdater(component.getCreator());
            } else {
                //组件为新增
                JSONObject jsonObjects = new JSONObject().set("no",userVersion).set("time",new Date()).set("status","valid").set("desc",userVersion);
                originComponent.setVersions(Collections.singletonList(jsonObjects));
            }
            originComponent.setUpdateTime(new Date());
            originComponent.setUpdateTime(new Date());
            originComponent.setDevelopStatus("online");
            originComponent.setStatus("valid");
            //读取组件信息，导入到新环境的表
            Component comp = new Component();
            comp.setId(new ObjectId(originComponent.getId()));
            comp.setIsLib(originComponent.getIsLib());
            BeanUtils.copyProperties(originComponent, comp);
            componentDao.insert(comp);

            //用户修改了组件版本,则修改待导入文件中的版本信息
            if (!originVersion.equalsIgnoreCase(userVersion)) {
                //导出的文件中的最新版本号
                //替换new cover文件中的version标识
                String releaseMain = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originVersion + RELEASE_MAIN;
                String releaseSetting = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originVersion + RELEASE_SETTING;

                FileUtils.autoReplace(releaseMain, originVersion, userVersion);
                FileUtils.autoReplace(releaseSetting, originVersion, userVersion);
            }

            //先复制对应的版本，因为牵涉到修改最新版的版本名称
            String destFolder = component_basepath + File.separator + componentId + File.separator + userVersion;
            String sourceFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originVersion;
            log.info("新版本release从sourceFolder:{} 复制到destFolder:{}", sourceFolder, destFolder);
            File[] files = new File(sourceFolder).listFiles();
            if (files != null && files.length > 0) {
                for (File file : files) {
                    //2 将包复制到组件文件夹
                    FileUtils.copyFolder(sourceFolder + File.separator + file.getName(), null, destFolder);
                }
            }
            importResult.getComponentImportSuccess().add(component.getName());
        }
    }
}
