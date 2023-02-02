package com.cloudwise.lcap.devserver.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.ResourceNotFoundException;
import com.cloudwise.lcap.commonbase.mapper.ImportResultMapper;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.util.Assert;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.devserver.dto.ExportResourceResponse;
import com.cloudwise.lcap.devserver.dto.Manifest;
import com.cloudwise.lcap.devserver.dto.ResourceApplicationDto;
import com.cloudwise.lcap.devserver.dto.ResourceComponentDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;

/**
 * 导入导出功能之导出业务逻辑
 */
@Slf4j
@Service
public class ExportService extends ServiceImpl<ImportResultMapper, ImportResult> {

    @Value("${portal_web_path}")
    private String portal_web_path;

    @Value("${lcap_www_path}")
    private String lcap_www_path;

    @Value("${lcap_www_relative_path}")
    private String lcap_www_relative_path;
    /**
     * 导出组件时创建临时目录的基础路径
     * 在改基础路径下生成一个个临时目录
     */
    @Value("${component_down_tmp_basepath}")
    private String down_tmp_basepath;
    /**
     * 配置文件名称
     */
    @Value("${config_filename}")
    private String config_filename;
    @Autowired
    private IComponentService componentService;
    @Autowired
    private IComponentProjectRefService componentProjectRefService;
    @Autowired
    private IProjectService projectService;
    @Autowired
    private IComponentTagRefService componentTagRefService;
    @Autowired
    private ITagService tagService;
    @Autowired
    private IComponentCategoryService componentCategoryService;
    @Autowired
    IAppVarService iAppVarService;

    /**
     * 导出组件
     *
     * @param componentList 导出的组件列表
     * @param folder        导出到目的文件
     */
    public ExportResourceResponse exportComponents(HttpServletRequest requests, HttpServletResponse response, List<ResourceComponentDto> componentList, String folder, Manifest manifest) {
        Assert.assertFalse(componentList.size() > 50, "应用和组件不得多于50个!");
        // 需校验创建模块是否存在  若不存在，则直接报错，不需要导出
        for (ResourceComponentDto reqDto : componentList) {
            String componentId = reqDto.getId();
            String recentVersion = reqDto.getVersion();
            //根据导出类型判断 是否存在 /{recentVersion}/release
            String componentFilePath = lcap_www_path + COMPONENTS + File.separator + componentId + File.separator + recentVersion + COMPONENT_RELEASE;
            if (!new File(componentFilePath).exists()) {
                log.error("组件:{} 版本:{} 文件资源不存在", reqDto.getName(), componentFilePath);
                throw new BaseException("组件:" + reqDto.getName() + " 版本" + recentVersion + " 文件资源不存在");
            }
        }

        for (ResourceComponentDto reqDto : componentList) {
            String componentId = reqDto.getId();
            String recentVersion = reqDto.getVersion();
            // 最新版本目录 只需要release目录
            String componentFilePath = lcap_www_path + COMPONENTS + File.separator + componentId + File.separator + recentVersion + COMPONENT_RELEASE;
            //导出时校验封面图
            String cover = reqDto.getCover();
            if (StringUtils.isNotBlank(cover)){
                if (!cover.startsWith("/")) {
                    cover += "/" + cover;
                }
                File coverFile = new File(portal_web_path + cover);
                if (coverFile.exists() && coverFile.isFile() && coverFile.length() > 0){
                    String coverFileName = cover.substring(cover.lastIndexOf("/"));
                    try {
                        //优先使用这个封面图
                        IoUtil.copy(new FileInputStream(coverFile.getAbsolutePath()), new FileOutputStream(componentFilePath + coverFileName));
                        //注意targetCover保存的是相对路径
                        String targetCover = lcap_www_relative_path + COMPONENTS + File.separator + componentId + File.separator + recentVersion + COMPONENT_RELEASE;
                        reqDto.setCover(targetCover + coverFileName);
                    } catch (FileNotFoundException e) {
                        log.error("组件封面图复制失败" + e);
                    }
                }
            }

            String destFilePath = folder + COMPONENTS + File.separator + componentId + File.separator + recentVersion;
            log.info("导出组件:{} 的最新版本release文件:{} 到:{}", componentId, componentFilePath, destFilePath);
            FileUtils.copyFolder(componentFilePath, null, destFilePath);
        }
        manifest.setComponentList(componentList);
        FileUtils.writeJson(folder, config_filename, new JSONObject(JsonUtils.toJSONString(manifest)));
        //打包临时文件夹A
        log.info("temp file path is {}.", folder);
        File zipFile = ZipUtil.zip(folder);

        //下载压缩包A.zip
        response.reset();
        response.setContentType("application/octet-stream;charset=utf-8");
        String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
        response.setContentLength((int) zipFile.length());

        log.info("Start downloading the compressed package, and file name is {}, and size is {}", downFileName, new File(downFileName).length());
        ExportResourceResponse result = new ExportResourceResponse();
        InputStream inStream = null;
        try {
            long st = System.currentTimeMillis();
            inStream = Files.newInputStream(zipFile.toPath());
            byte[] b = new byte[1024];
            int len;
            while ((len = inStream.read(b)) > 0) {
                response.getOutputStream().write(b, 0, len);
            }
            log.info("Compressed package download complete. and cost time is {}.", (System.currentTimeMillis() - st));
            result.setName(downFileName);
            result.setSize(new File(downFileName).length());
            return result;
        } catch (IOException e) {
            log.error("文件导出失败,folder:{},zipFile:{}", folder, zipFile);
            throw new BizException("文件导出失败");
        } finally {
            FileUtil.del(zipFile);
            FileUtil.del(folder);
            if (inStream != null){
                try {
                    inStream.close();
                } catch (IOException e) {
                }
            }
        }
    }

    /**
     * 导出应用
     *
     * @param requests
     * @param response
     * @return
     */
    public ExportResourceResponse exportApplications(HttpServletRequest requests, HttpServletResponse response, List<ResourceApplicationDto> applicationList) {
        Map<String, Map<String, String>> appIdAneComponentIdsMap = new HashMap<>();
        for (ResourceApplicationDto application : applicationList) {
            Map<String, String> componentIdAndVersion = new HashMap<>();
            getComponentIdAndVersions(application.getPages()).forEach((componentId, versions) -> {
                if (versions.size() != 1) {
                    //大屏内的组件没有版本号或者使用同一个组件的多个版本
                    log.error("大屏:{}内的组件:{}没有版本号或者使用同一个组件的多个版本:{}", application.getName(), componentId, versions);
                    throw new ResourceNotFoundException("大屏内的组件没有版本号或者使用同一个组件的多个版本号a,暂不支持导出");
                }
                componentIdAndVersion.put(componentId, versions.stream().findFirst().get());
            });
            appIdAneComponentIdsMap.put(application.getId(), componentIdAndVersion);
        }

        Map<String, String> allComponentIdAndVersion = new HashMap<>();
        //导出多个大屏时如果存在相同的组件引用，需要控制组件存在多个版本的情况
        Collection<Map<String, String>> values = appIdAneComponentIdsMap.values();
        Map<String, Set<String>> map = new HashMap<>();
        for (Map<String, String> value : values) {
            value.forEach((componentId, version) -> {
                if (map.containsKey(componentId)) {
                    map.get(componentId).add(version);
                } else {
                    Set<String> versions = new HashSet<>();
                    versions.add(version);
                    map.put(componentId, versions);
                }
            });
        }
        map.forEach((componentId, versions) -> {
            if (versions.size() != 1) {
                log.error("不同大屏使用了组件:{}的多个版本:{}", componentId, versions);
                throw new ResourceNotFoundException("不同大屏使用了同一个组件的多个版本,请逐个导出大屏");
            }
            allComponentIdAndVersion.put(componentId, versions.stream().findFirst().get());
        });
        //导出大屏,则需要导出对应的
        List<ResourceComponentDto> resourceComponentDtos = buildInnerComponent(allComponentIdAndVersion);
        Map<String, ResourceComponentDto> collect = resourceComponentDtos.stream().collect(Collectors.toMap(ResourceComponentDto::getId, o -> o));

        String folder = down_tmp_basepath + File.separator + APPLICATION + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        //构造大屏下的组件列表
        for (ResourceApplicationDto applicationReqDto : applicationList) {
            String applicationId = applicationReqDto.getId();
            String appBasePath = lcap_www_path + APPLICATIONS + File.separator + applicationId;
            if (!new File(appBasePath).exists()) {
                new File(appBasePath).mkdirs();
            }

            //当前这个大屏下的组件和版本map
            Map<String, String> componentIdAndVersion = appIdAneComponentIdsMap.get(applicationId);
            List<ResourceComponentDto> componentList = new ArrayList<>();
            if (MapUtil.isNotEmpty(componentIdAndVersion)) {
                componentIdAndVersion.forEach((componentId, version) -> {
                    ResourceComponentDto e = collect.get(componentId);
                    componentList.add(e);
                });
            }
            //构造大屏下的组件列表
            applicationReqDto.setComponents(componentList);

            // 大屏如果配置了资源
            List<JSONObject> pages = JSONUtil.toList(applicationReqDto.getPages(), JSONObject.class);
            if (CollectionUtils.isNotEmpty(pages)) {
                for (JSONObject page : pages) {
                    if (page.containsKey("components") && CollectionUtil.isNotEmpty(page.getBeanList("components", JSONObject.class))) {
                        List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                        for (JSONObject component : components) {
                            if (component.containsKey("source") && "componentGroup".equalsIgnoreCase(component.getStr("source"))) {
                                //将对应的图片复制到大屏下，并且修改图片保存路径
                                component.set("source", "component");
                                component.set("componentGroupId", "");
                                JSONObject options = component.getBean("options", JSONObject.class);
                                String imagePath = options.getStr("image");
                                if (StringUtils.isNotBlank(imagePath)) {
                                    if (!imagePath.startsWith("/")){
                                        imagePath = "/" + imagePath;
                                    }
                                    File appCoverFile = new File(portal_web_path + imagePath);
                                    if (appCoverFile.exists() && appCoverFile.isFile() && appCoverFile.length() > 0){
                                        try {
                                            String imageName = imagePath.substring(imagePath.lastIndexOf("/"));
                                            IoUtil.copy(new FileInputStream(appCoverFile.getAbsolutePath()), new FileOutputStream(folder + APPLICATIONS + File.separator + applicationId + imageName));
                                            options.put("image", lcap_www_relative_path + APPLICATIONS + File.separator + applicationId + imageName);
                                        } catch (FileNotFoundException e) {
                                            log.error("资源图片复制失败" + e);
                                        }
                                    }
                                }
                            }
                        }
                        page.put("components", JSONUtil.toJsonStr(components));
                    }
                    //dev标准版本,默认该大屏不会引用其他大屏的封面图片等
                }
                applicationReqDto.setPages(JSONUtil.toJsonStr(pages));
            }
            //大屏变量
            LambdaQueryWrapper<AppVar> appVarWrapper = new LambdaQueryWrapper<>();
            appVarWrapper.eq(AppVar::getAppId, applicationId);
            List<AppVar> appVars = iAppVarService.getBaseMapper().selectList(appVarWrapper);
            applicationReqDto.setAppVars(appVars);

            //导出大屏文件
            FileUtils.copyFolder(appBasePath, null, folder + APPLICATIONS);
        }

        //临时文件夹的绝对路径A
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Manifest manifest = Manifest.builder().type(APPLICATION).applicationExportType(APP_AND_COMPONENT).componentExportType(Arrays.asList(COMPILED_SOURCE_DEPEND))
                .applicationList(applicationList).time(time).build();
        //导出组件
        return exportComponents(requests, response, resourceComponentDtos, folder, manifest);
    }

    /**
     * 导出大屏，需要导出对应版本的组件
     *
     * @param allComponentIdAndVersion 大屏中使用的版本组件
     * @return
     */
    public List<ResourceComponentDto> buildInnerComponent(Map<String, String> allComponentIdAndVersion) {
        if (MapUtil.isEmpty(allComponentIdAndVersion)) {
            return new ArrayList<>();
        }
        Collection<String> componentIds = allComponentIdAndVersion.keySet();
        List<Component> components = componentService.listByIds(componentIds);
        Set<String> componentCategoryId = new HashSet<>();
        for (Component component : components) {
            // 在这里是导出大屏，需要将组件的最新版本改成大屏正在使用的版本
            String currentVersion = allComponentIdAndVersion.get(component.getId());
            if (StringUtils.isNotBlank(currentVersion)) {
                //组件版本
                component.setLatestVersion(currentVersion);
            }
            componentCategoryId.add(component.getCategoryId());
            componentCategoryId.add(component.getSubCategoryId());
        }

        List<ComponentCategory> componentCategories = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(componentCategoryId)) {
            componentCategories = componentCategoryService.getBaseMapper().selectBatchIds(componentCategoryId);
        }
        LambdaQueryWrapper<ComponentProjectRef> objectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        objectLambdaQueryWrapper.in(ComponentProjectRef::getComponentId, componentIds);
        List<ComponentProjectRef> componentProjectRefs = componentProjectRefService.getBaseMapper().selectList(objectLambdaQueryWrapper);
        List<Project> projects = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(componentProjectRefs)) {
            Set<String> projectIds = componentProjectRefs.stream().map(ComponentProjectRef::getProjectId).collect(Collectors.toSet());
            projects = projectService.getBaseMapper().selectBatchIds(projectIds);
        }

        //组件tag处理
        List<ComponentTagRef> componentTagRefsByComponentIds = componentTagRefService.getComponentTagRefsByComponentIds(new ArrayList<>(componentIds));
        Set<String> tagIds = componentTagRefsByComponentIds.stream().map(ComponentTagRef::getTagId).collect(Collectors.toSet());

        Map<String, Set<String>> tagIdMap = new HashMap<>();
        Map<String, Set<String>> tagNameMap = new HashMap<>();
        if (CollectionUtils.isNotEmpty(tagIds)) {
            LambdaQueryWrapper<Tag> tagQuery = new LambdaQueryWrapper<>();
            tagQuery.in(Tag::getId, tagIds);
            Map<String, String> collect = tagService.getBaseMapper().selectList(tagQuery).stream().collect(Collectors.toMap(Tag::getId, Tag::getName));

            for (ComponentTagRef i : componentTagRefsByComponentIds) {
                String componentId = i.getComponentId();
                String tagId = i.getTagId();
                if (!tagIdMap.containsKey(componentId)) {
                    tagIdMap.put(componentId, new HashSet<>());
                }
                tagIdMap.get(componentId).add(tagId);
            }
            tagIdMap.forEach((k, v) -> {
                Set<String> tagNames = new HashSet<>();
                for (String tagId : v) {
                    if (StringUtils.isNotBlank(collect.get(tagId))) {
                        tagNames.add(collect.get(tagId));
                    }
                }
                tagNameMap.put(k, tagNames);
            });
        }
        return ResourceComponentDto.beansToDto(components, componentCategories, componentProjectRefs, projects, tagNameMap);
    }

    private Map<String, Set<String>> getComponentIdAndVersions(String pageStr) {
        List<JSONObject> pages = JSONUtil.toList(pageStr, JSONObject.class);
        Map<String, Set<String>> componentIdAndVersionMap = new HashMap<>();
        if (CollectionUtils.isNotEmpty(pages)) {
            for (JSONObject page : pages) {
                List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                if (CollectionUtil.isNotEmpty(components)) {
                    for (JSONObject object1 : components) {
                        //历史数据问题,用type字段表示componentId
                        //大屏可能有多个页面，多个页面间可以通过一个 PageLink 插件跳转/翻页，所以需要将该插件排除
                        String componentId = object1.getStr("type");
                        if ("PageLink".equalsIgnoreCase(componentId)) {
                            continue;
                        }
                        String version = object1.getStr("version");
                        if (componentIdAndVersionMap.containsKey(componentId)) {
                            componentIdAndVersionMap.get(componentId).add(version);
                        } else {
                            //重复的版本去重
                            Set<String> versionSet = new HashSet<>();
                            versionSet.add(version);
                            componentIdAndVersionMap.put(componentId, versionSet);
                        }
                    }
                }
            }
        }
        return componentIdAndVersionMap;
    }
}
