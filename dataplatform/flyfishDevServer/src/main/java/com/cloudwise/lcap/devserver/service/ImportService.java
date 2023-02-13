package com.cloudwise.lcap.devserver.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.enums.AppDevStatus;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.mapper.*;
import com.cloudwise.lcap.commonbase.service.IAppVarService;
import com.cloudwise.lcap.commonbase.service.IApplicationService;
import com.cloudwise.lcap.commonbase.service.IComponentService;
import com.cloudwise.lcap.commonbase.service.impl.AppVarServiceImpl;
import com.cloudwise.lcap.commonbase.service.impl.ComponentProjectRefServiceImpl;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import com.cloudwise.lcap.devserver.dto.Manifest;
import com.cloudwise.lcap.devserver.dto.ResourceApplicationDto;
import com.cloudwise.lcap.devserver.dto.ResourceComponentDto;
import com.cloudwise.lcap.devserver.dto.ResourceImportResult;
import com.google.common.collect.HashMultiset;
import com.google.common.collect.Multiset;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.*;
import java.util.logging.Handler;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;

/**
 * 导入导出功能之导入逻辑
 */
@Slf4j
@Service
public class ImportService {


    @Value("${portal_web_path}")
    private String portal_web_path;

    @Value("${lcap_www_relative_path}")
    private String lcap_www_relative_path;
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
    private ApplicationMapper applicationMapper;
    @Autowired
    private ProjectMapper projectMapper;
    @Autowired
    private ProjectTradeRefMapper projectTradeRefMapper;
    @Autowired
    private IComponentService componentService;
    @Autowired
    private ComponentMapper componentMapper;
    @Autowired
    private ComponentVersionMapper componentVersionMapper;
    @Autowired
    AppVarServiceImpl iAppVarService;
    @Autowired
    ComponentProjectRefMapper componentProjectRefMapper;

    /**
     * 倒入应用时如果修改了组件版本，则需要在写入数据库和地盘时对组件版本信息进行修改
     *
     * @param key
     * @param applications 来自用户前端设置的参数
     * @param manifest
     * @param result
     */
    public void importApplications(String key, List<ResourceApplicationDto> applications, Manifest manifest, ResourceImportResult result) {
        // 导入应用
        // 1.优先校验前端传递给后端的应用名称是否存在重复
        List<String> applicationNames = applications.stream().map(ResourceApplicationDto::getName).collect(Collectors.toList());
        List<String> lists = HashMultiset.create(applicationNames).entrySet().stream().filter(t -> t.getCount() > 1).map(Multiset.Entry::getElement).collect(Collectors.toList());
        if (CollectionUtils.isNotEmpty(lists)) {
            throw new BaseException("应用名称" + lists + "存在重复!");
        }
        //组件的原始版本号，也是导入的包文件的版本号。如果版本号有变更，需要将包文件变更
        Map<String, String> originComponentIdAndMap = new HashMap<>();
        for (ResourceApplicationDto resourceApplicationDto : manifest.getApplicationList()) {
            List<ResourceComponentDto> components = resourceApplicationDto.getComponents();
            originComponentIdAndMap.putAll(components.stream().collect(Collectors.toMap(ResourceComponentDto::getId, ResourceComponentDto::getVersion)));
        }

        Map<String, ResourceComponentDto> componentList = new HashMap<>();
        // 导入应用和应用文件
        for (ResourceApplicationDto application : applications) {
            String applicationId = application.getId();
            List<ResourceComponentDto> components = application.getComponents();
            if (CollectionUtil.isNotEmpty(components)) {
                componentList.putAll(components.stream().collect(Collectors.toMap(ResourceComponentDto::getId, o -> o)));
                //如果组件修改了版本，则需要对 pages 做相应修改
                List<JSONObject> pages = JSONUtil.toList(application.getPages(), JSONObject.class);
                if (CollectionUtils.isNotEmpty(pages)) {
                    for (JSONObject page : pages) {
                        List<JSONObject> pageComponents = page.getBeanList("components", JSONObject.class);
                        if (CollectionUtils.isNotEmpty(pageComponents)) {
                            for (JSONObject pageComponent : pageComponents) {
                                String componentId = pageComponent.getStr("type");
                                if (componentList.containsKey(componentId)) {
                                    //优先使用用户设置的版本号
                                    pageComponent.put("version", componentList.get(componentId).getVersion());
                                }
                            }
                            page.put("components", pageComponents);
                        }
                    }
                }
                application.setPages(JSONUtil.toJsonStr(pages));
            }

            //appVar(5.6版本导入到5.7时，5.6版本不存在appVar功能)
            List<AppVar> appVars = application.getAppVars();
            if (CollectionUtils.isNotEmpty(appVars)) {
                List<AppVar> appVarList = iAppVarService.getBaseMapper().selectByAppId(applicationId);
                List<String> collect = appVarList.stream().map(AppVar::getId).collect(Collectors.toList());
                List<AppVar> collect1 = appVars.stream().filter(o -> collect.contains(o.getId())).collect(Collectors.toList());
                if (CollectionUtils.isNotEmpty(collect1)) {
                    iAppVarService.updateBatchById(collect1);
                }
                List<AppVar> collect2 = appVars.stream().filter(o -> !collect.contains(o.getId())).collect(Collectors.toList());
                if (CollectionUtils.isNotEmpty(collect2)) {
                    iAppVarService.saveBatch(collect2);
                }
            }
            //大屏所属项目
            String projectId = application.getProjectId();
            if (StringUtils.isEmpty(projectId)) {
                projectId = Snowflake.INSTANCE.nextId().toString();
            }
            projectMapper.revertProject(projectId);
            Project project = projectMapper.selectByProjectId(projectId);
            if (null == project){
                String projectName = application.getProjectName();
                if (StringUtils.isEmpty(projectName)){
                    projectName = application.getName();
                }
                List<Project> projects = projectMapper.selectByName(projectName);
                if (CollectionUtils.isNotEmpty(projects)){
                    project = projects.get(0);
                }else {
                    //新建项目
                    project = Project.builder().id(projectId).name(projectName).deleted(0)
                            .accountId(ThreadLocalContext.getAccountId()).creator(ThreadLocalContext.getUserId())
                            .updater(ThreadLocalContext.getUserId()).build();
                    projectMapper.insert(project);
                    //新建项目，设置行业为"全行业"
                    List<ProjectTradeRef> projectTradeRefs = projectTradeRefMapper.selectByProjectId(projectId);
                    if (CollectionUtils.isEmpty(projectTradeRefs)){
                        ProjectTradeRef build = ProjectTradeRef.builder().id(Snowflake.INSTANCE.nextId().toString()).projectId(projectId).tradeId("1564144977514147842").deleted(0).build();
                        projectTradeRefMapper.insert(build);
                    }
                }
            }

            applicationMapper.revertApplication(applicationId);
            Application app = new Application();
            BeanUtils.copyProperties(application, app);
            app.setId(applicationId);
            app.setDevelopStatus(AppDevStatus.DOING.getType());
            app.setProjectId(project.getId());
            app.setDeleted(0);
            app.setInvalid(0);
            app.setCreator(ThreadLocalContext.getUserId());
            app.setUpdater(ThreadLocalContext.getUserId());
            app.setUpdateTime(new Date());

            if (null == applicationMapper.selectById(applicationId)){
                applicationMapper.insert(app);
            }else {
                applicationMapper.updateById(app);
            }

            //导入应用文件
            String sourcePath = upload_tmp_basepath + File.separator + key + "/applications" + File.separator + applicationId;
            if (new File(sourcePath).exists()) {
                FileUtils.copyFolder(sourcePath, null, application_baseapth);
            }
            result.getApplicationImportSuccess().add(application.getName());
        }

        //导入组件
        importComponents(key, componentList.values(), originComponentIdAndMap, result);
    }

    /**
     * @param key                      已经上传的压缩包 key
     * @param importResult             result
     * @param resourceComponentDtoList 待导入的组件信息列表
     */
    public void importComponents(String key, Collection<ResourceComponentDto> resourceComponentDtoList, Map<String, String> originComponentIdAndMap, ResourceImportResult importResult) {
        Long creator = ThreadLocalContext.getUserId();
        // 预先检查资源文件是否存在，不存在则直接报错
        for (ResourceComponentDto component : resourceComponentDtoList) {
            String sourceFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + component.getId();
            if (!new File(sourceFolder).exists()) {
                log.error("组件:{} 临时文件:{} 不存在,导入失败", component.getName(), sourceFolder);
                importResult.getComponentImportFailed().add(component.getName());
            }
        }

        for (ResourceComponentDto dto : resourceComponentDtoList) {
            String componentId = dto.getId();
            dto.setDevelopStatus("online");
            //用户手动设置的版本号
            String version = dto.getVersion();
            //导入包的包文件的版本号
            String originVersion = originComponentIdAndMap.get(componentId);
            //用户手动修改了版本号，则需要对应版本组件的配置文件中的版本标志
            if (!version.equals(originVersion)) {
                String releaseMain = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originVersion + RELEASE_MAIN;
                String releaseSetting = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originVersion + RELEASE_SETTING;
                FileUtils.autoReplace(releaseMain, originVersion, version);
                FileUtils.autoReplace(releaseSetting, originVersion, version);
            }

            // 先复制对应的版本，因为牵涉到修改最新版的版本名称
            String sourceFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originVersion;
            String destFolder = component_basepath + File.separator + componentId + File.separator + version;
            log.info("新版本release从sourceFolder:{} 复制到destFolder:{}", sourceFolder, destFolder);
            File[] files = new File(sourceFolder).listFiles();
            if (files != null && files.length > 0) {
                for (File file : files) {
                    // 2 将包复制到组件文件夹
                    FileUtils.copyFolder(sourceFolder + File.separator + file.getName(), null, destFolder);
                }
            }

            // 1 读取组件信息，导入到新环境的表
            Component comp = Component.builder().id(componentId).name(dto.getName()).categoryId(dto.getCategory()).subCategoryId(dto.getSubCategory())
                    .isLib(dto.getIsLib()).dataConfig(dto.getDataConfig()).desc(dto.getDesc()).latestVersion(dto.getVersion())
                    .automaticCover("custom").allowDataSearch(dto.getAllowDataSearch()).developStatus(dto.getDevelopStatus()).type(dto.getType())
                    .deleted(0).creator(ThreadLocalContext.getUserId()).updater(ThreadLocalContext.getUserId()).accountId(ThreadLocalContext.getAccountId()).build();
            //判断新导入的组件是否存在封面
            File file = new File(destFolder + COMPONENT_RELEASE);
            if (file.exists()) {
                //导入后，强制更新该组件的封面为导入时最新的封面
                File[] covers = file.listFiles(pathname -> pathname.isFile() && pathname.getName().startsWith("cover"));
                if (null != covers && covers.length > 0 && covers[0].length() > 0) {
                    comp.setCover(lcap_www_relative_path + COMPONENTS + File.separator + componentId + File.separator + version + COMPONENT_RELEASE + File.separator + covers[0].getName());
                }else {
                    comp.setCover("");
                }
            }

            componentMapper.revertData(componentId);
            //这里不能用saveOrUpdate,因为就数据存在一旦deleted=1,此时就会走insert逻辑，导致Duplicate entry 错误
            if (null == componentMapper.selectById(componentId)) {
                componentService.save(comp);
            } else {
                componentService.updateById(comp);
            }

            if ("project".equalsIgnoreCase(dto.getType()) && CollectionUtils.isNotEmpty(dto.getProjects())) {
                List<String> projectIds = dto.getProjects();
                List<JSONObject> jsonObjects = componentProjectRefMapper.selectByComponentIds(Arrays.asList(componentId));
                List<String> bindProjectIds = jsonObjects.stream().map(o -> o.getStr("projectId")).collect(Collectors.toList());
                projectIds.removeAll(bindProjectIds);
                if (CollectionUtils.isNotEmpty(projectIds)) {
                    List<ComponentProjectRef> componentProjectRefs = projectIds.stream().map(projectId -> ComponentProjectRef.builder().id(Snowflake.INSTANCE.nextId().toString()).componentId(componentId).projectId(projectId).deleted(0).build()).collect(Collectors.toList());
                    log.info("componentProjectRefs:{}", componentProjectRefs);
                    componentProjectRefMapper.batchSave(componentProjectRefs);
                }
            }

            ComponentVersion componentVersion = ComponentVersion.builder().id(Snowflake.INSTANCE.nextId().toString()).componentId(componentId).no(version).creator(creator).updater(creator).deleted(0).build();
            LambdaQueryWrapper<ComponentVersion> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(ComponentVersion::getComponentId, componentId);
            if (componentVersionMapper.selectOne(queryWrapper) == null) {
                //新组件，版本信息入库
                componentVersionMapper.insert(componentVersion);
            } else {
                queryWrapper.eq(ComponentVersion::getNo, version);
                if (componentVersionMapper.selectOne(queryWrapper) == null) {
                    //新版本,版本信息入库
                    componentVersionMapper.insert(componentVersion);
                }
            }

            importResult.getComponentImportSuccess().add(dto.getName());
        }
    }
}
