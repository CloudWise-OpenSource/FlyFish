package com.cloudwise.lcap.devserver.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ZipUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.*;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.mapper.ImportResultMapper;
import com.cloudwise.lcap.commonbase.service.*;
import com.cloudwise.lcap.commonbase.service.impl.ComponentServiceImpl;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.Assert;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.devserver.dto.*;
import com.cloudwise.lcap.devserver.service.ImportService;
import com.cloudwise.lcap.devserver.service.ParseConfigService;
import com.cloudwise.lcap.devserver.service.ExportService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;
import static com.cloudwise.lcap.commonbase.contants.Constant.IMPORT_KEY;

/**
 * 组件/应用导入导出
 */
@Slf4j
@RequestMapping("/resources")
@RestController
public class ResourceImportController {
    @Autowired
    private ExportService sourceConfigService;
    @Autowired
    private IComponentVersionService componentVersionService;
    @Autowired
    private ComponentServiceImpl componentService;

    @Autowired
    private IComponentProjectRefService componentProjectRefService;
    @Autowired
    private IComponentCategoryService componentCategoryService;
    @Autowired
    private IProjectService projectService;

    @Autowired
    private IComponentTagRefService componentTagRefService;
    @Autowired
    private ITagService tagService;
    @Value("${component_down_tmp_basepath}")
    private String component_down_tmp_basepath;
    @Autowired
    private IApplicationService applicationService;
    @Autowired
    private IApplicationTagRefService applicationTagRefService;
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


    @Value("${portal_web_path}")
    private String portal_web_path;

    @Value("${lcap_www_path}")
    private String lcap_www_path;

    @Value("${lcap_www_relative_path}")
    private String lcap_www_relative_path;

    @Autowired
    private ParseConfigService parseConfigService;

    @Autowired
    private ImportService importService;
    @Autowired
    private ImportResultMapper importResultMapper;
    /**
     * 导出组件
     */
    @PostMapping("/export/components")
    public ExportResourceResponse exportComponents(HttpServletRequest requests, HttpServletResponse response, @RequestBody ComponentExportRequest componentExportRequest) {
        Set<String> ids = componentExportRequest.getIds();
        if (CollectionUtils.isEmpty(ids)) {
            log.error("请先选择导出的组件");
            throw new BizException("请先选择待导出的组件");
        }
        List<Component> components = componentService.listByIds(ids);

        Set<String> componentIds = new HashSet<>();
        Set<String> componentCategoryId = new HashSet<>();
        for (Component component : components) {
            componentIds.add(component.getId());
            componentCategoryId.add(component.getCategoryId());
            componentCategoryId.add(component.getSubCategoryId());
        }
        List<ComponentCategory> componentCategories = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(componentCategoryId)){
            componentCategories = componentCategoryService.getBaseMapper().selectBatchIds(componentCategoryId);
        }
        LambdaQueryWrapper<ComponentProjectRef> objectLambdaQueryWrapper = new LambdaQueryWrapper<>();
        objectLambdaQueryWrapper.in(ComponentProjectRef::getComponentId,componentIds);
        List<ComponentProjectRef> componentProjectRefs = componentProjectRefService.getBaseMapper().selectList(objectLambdaQueryWrapper);
        List<Project> projects = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(componentProjectRefs)){
            Set<String> projectIds = componentProjectRefs.stream().map(ComponentProjectRef::getProjectId).collect(Collectors.toSet());
            projects = projectService.getBaseMapper().selectBatchIds(projectIds);
        }

        List<ComponentTagRef> componentTagRefsByComponentIds = componentTagRefService.getComponentTagRefsByComponentIds(new ArrayList<>(componentIds));
        Set<String> tagIds = componentTagRefsByComponentIds.stream().map(ComponentTagRef::getTagId).collect(Collectors.toSet());

        Map<String,Set<String>> tagIdMap = new HashMap<>();
        Map<String,Set<String>> tagNameMap = new HashMap<>();
        if (CollectionUtils.isNotEmpty(tagIds)){
            LambdaQueryWrapper<Tag> tagQuery = new LambdaQueryWrapper<>();
            tagQuery.in(Tag::getId,tagIds);
            Map<String, String> collect = tagService.getBaseMapper().selectList(tagQuery).stream().collect(Collectors.toMap(Tag::getId, Tag::getName));

            for (ComponentTagRef i : componentTagRefsByComponentIds) {
                String componentId = i.getComponentId();
                String tagId = i.getTagId();
                if (!tagIdMap.containsKey(componentId)){
                    tagIdMap.put(componentId,new HashSet<>());
                }
                tagIdMap.get(componentId).add(tagId);
            }
            tagIdMap.forEach((k,v)->{
                Set<String> tagNames = new HashSet<>();
                for (String tagId : v) {
                    if (StringUtils.isNotBlank(collect.get(tagId))){
                        tagNames.add(collect.get(tagId));
                    }
                }
                tagNameMap.put(k,tagNames);
            });
        }

        List<ResourceComponentDto> componentList = ResourceComponentDto.beansToDto(components,componentCategories,componentProjectRefs,projects,tagNameMap);

        for (ResourceComponentDto reqDto : componentList) {
            String componentId = reqDto.getId();
            String recentVersion = reqDto.getVersion();
            String cover = reqDto.getCover();
            if (StringUtils.isNotBlank(cover) && !cover.startsWith("/")){
                cover += "/" + cover;
                //还需要对组件封面图做复制，从 lcapWeb/www/components/605787603835518976/v-current/components/cover.jpeg 复制到
                ///lcapWeb/www/components/605787603835518976/{recentVersion}/release/cover.jpeg
                String sourceCover = portal_web_path + cover;
                if (new File(sourceCover).exists() && new File(sourceCover).isFile()){
                    String targetCover = lcap_www_relative_path + COMPONENTS + File.separator + componentId + File.separator + recentVersion + COMPONENT_RELEASE;
                    FileUtils.copyFolder(sourceCover, null, portal_web_path + targetCover);
                    //注意targetCover保存的是相对路径
                    reqDto.setCover(targetCover + cover.substring(cover.lastIndexOf("/")));
                }
            }
        }
        String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Manifest manifest = Manifest.builder().type(COMPONENT)
                .componentExportType(Arrays.asList("componentRelease")).componentList(componentList).time(time).creator(ThreadLocalContext.getUserId()).build();
        String folder = component_down_tmp_basepath + File.separator + COMPONENT + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        //flag 2-仅组件 3-应用+组件
        return sourceConfigService.exportComponents(requests, response, componentList, folder, manifest);
    }

    /**
     * 导出应用
     * applicationExportRequest: {
     * "applicationIds": ['111', '222'. ''333],     // 应用id
     * "applicationExportType": "appOnly"           //appAndComponent
     * "componentExportType": ["componentRelease"]
     * }
     */
    @PostMapping("/export/applications")
    public ExportResourceResponse exportApplications(HttpServletRequest requests, HttpServletResponse response, @RequestBody ApplicationExportRequest applicationExportRequest) {
        List<String> applicationIds = applicationExportRequest.getIds();
        if (CollectionUtils.isEmpty(applicationIds)) {
            log.error("请先选择应用!");
            throw new BizException("请先选择应用!");
        }
        // 校验应用个数
        Assert.assertFalse(applicationIds.size() > 50, "应用和组件不得多于50个!");
        List<Application> applications = applicationService.listByIds(applicationIds);
        if (CollectionUtil.isEmpty(applications)) {
            log.error("应用信息获取失败,applications:{}", applications);
            throw new BaseException("应用信息获取失败!");
        }
        //appTag
        LambdaQueryWrapper<ApplicationTagRef> appTagQuery = new LambdaQueryWrapper<>();
        appTagQuery.in(ApplicationTagRef::getApplicationId, applicationIds);
        List<ApplicationTagRef> appTags = applicationTagRefService.list(appTagQuery);
        Map<String, List<String>> appTagNameMap = new HashMap<>();
        if (CollectionUtils.isNotEmpty(appTags)) {
            List<String> collect = appTags.stream().map(ApplicationTagRef::getTagId).collect(Collectors.toList());
            LambdaQueryWrapper<Tag> objectLambdaQueryWrapper = new LambdaQueryWrapper<>();
            objectLambdaQueryWrapper.in(Tag::getId, collect);
            List<Tag> list = tagService.list(objectLambdaQueryWrapper);
            Map<String, String> collect1 = list.stream().collect(Collectors.toMap(Tag::getId, Tag::getName));
            for (ApplicationTagRef appTag : appTags) {
                String applicationId = appTag.getApplicationId();
                String tagId = appTag.getTagId();
                if (!appTagNameMap.containsKey(applicationId)) {
                    appTagNameMap.put(applicationId, new ArrayList<>());
                }
                appTagNameMap.get(applicationId).add(collect1.get(tagId));
            }
        }
        List<ResourceApplicationDto> applicationList = applications.stream().map(o -> ResourceApplicationDto.beanToDto(o, appTagNameMap)).collect(Collectors.toList());

        return sourceConfigService.exportApplications(requests, response, applicationList);
    }

    /**
     * 导入：应用和组件
     * 请求参数来自前端,前端数据来自配置文件 Manifest 的解析
     */
    @PostMapping("/import")
    public ResourceImportResult importResources(@RequestBody ResourceImportRequest request) {
        String importType = request.getImportType();
        String key = request.getKey();
        ResourceImportResult result = ResourceImportResult.builder().key(key).type(importType).applicationImportSuccess(new ArrayList<>())
                .applicationImportFailed(new ArrayList<>()).componentImportFailed(new ArrayList<>()).componentImportSuccess(new ArrayList<>()).build();

        String zipFolder = upload_tmp_basepath + File.separator + key;
        String configFilePath = zipFolder + File.separator + config_filename;
        if (!new File(configFilePath).exists()) {
            log.error("导入的压缩包中配置文件不存在");
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }
        Manifest manifest;
        try {
            manifest = JsonUtils.parse(FileUtils.readJson(configFilePath), Manifest.class);
        } catch (Exception e) {
            log.error("配置文件内容解析为Manifest失败");
            throw new BaseException("配置文件内容解析失败!");
        }

        List<ResourceComponentDto> components = request.getComponents();
        List<ResourceApplicationDto> applications = request.getApplications();
        if (APPLICATION.equals(importType) && CollectionUtils.isNotEmpty(applications)) {
            importService.importApplications(key, applications, manifest, result);
        } else if (COMPONENT.equals(importType) && CollectionUtils.isNotEmpty(components)) {
            //导入组件
            Map<String, String> originComponentIdAndMap = manifest.getComponentList().stream().collect(Collectors.toMap(ResourceComponentDto::getId, ResourceComponentDto::getVersion));
            importService.importComponents(key, components, originComponentIdAndMap, result);
        }

        // 记录配置导入结果
        Long userId = ThreadLocalContext.getUserId();
        ImportResult importResult = new ImportResult();
        importResult.setCreator(userId);
        importResult.setUpdater(userId);
        importResult.setKey(key);
        importResult.setType(importType);

        if (CollectionUtils.isEmpty(result.getApplicationImportSuccess()) && CollectionUtils.isEmpty(result.getComponentImportSuccess())) {
            importResult.setStatus(0);
        } else {
            importResult.setStatus(1);
        }
        importResultMapper.insert(importResult);
        FileUtil.del(zipFolder);
        return result;
    }

    /**
     * 解析配置文件config_file, 返回给前端展示列表
     */
    @GetMapping("/parse/config")
    public ConfigFileParser parseConfigFile(@RequestParam(value = "key") String key) {
        // 读取配置文件
        String configFilePath = upload_tmp_basepath + File.separator + key + File.separator + config_filename;
        if (!new File(configFilePath).exists()) {
            log.error("导入的压缩包中配置文件:{}不存在", configFilePath);
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }
        Manifest manifest = JsonUtils.parse(FileUtils.readJson(configFilePath), Manifest.class);

        if (APPLICATION.equals(manifest.getType())) {
            return parseConfigService.parseApplication(manifest);
        } else {
            return parseConfigService.parseComponent(manifest);
        }
    }

    /**
     * 上传zip文件
     */
    @PostMapping("/upload")
    public String uploadFile(@RequestPart MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (StringUtils.isBlank(fileName) || !fileName.endsWith(".zip")) {
            throw new BaseException("文件格式错误，当前仅支持zip压缩文件!");
        }
        // 上传之前需要清空文件保存目录
        FileUtil.del(upload_tmp_basepath);
        // 如果临时目录不存在 则需要创建
        if (!new File(upload_tmp_basepath).exists()) {
            new File(upload_tmp_basepath).mkdirs();
        }
        //指定文件临时存储位置
        String savePath = upload_tmp_basepath + File.separator + fileName;
        long st = System.currentTimeMillis();
        File dest = new File(savePath);
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            e.printStackTrace();
        }

        log.info("file upload successfully, and cost time is {}.", (System.currentTimeMillis() - st));
        //解压文件
        File unzip = ZipUtil.unzip(dest);
        log.info("unzip is:{}", unzip.getAbsolutePath());
        FileUtil.del(dest);
        return fileName.split("\\.zip")[0];
    }
    /**
     * 校验文件是否存在
     */
    @GetMapping("/check")
    public ResourceFileResponse checkFileExists() {
        File uploadTmpFilePath = new File(upload_tmp_basepath);
        ResourceFileResponse response = new ResourceFileResponse();
        if (!uploadTmpFilePath.exists()) {
            uploadTmpFilePath.mkdirs();
            return response;
        }

        File[] files = uploadTmpFilePath.listFiles();
        if (null == files || files.length == 0) {
            return response;
        }
        boolean flag = false;
        for (File file : files) {
            if (file.isDirectory()) {
                // 先判断文件资源是否已导入
                LambdaQueryWrapper<ImportResult> queryWrapper = new LambdaQueryWrapper<>();
                queryWrapper.eq(ImportResult::getKey, file.getName());
                List<ImportResult> importResults = sourceConfigService.getBaseMapper().selectList(queryWrapper);
                if (CollectionUtils.isEmpty(importResults)) {
                    response.setExist(true);
                }
                response.setFileName(file.getName());
                flag = true;
                break;
            }
        }

        if (!flag) {
            for (File file : files) {
                if (file.getName().endsWith(".zip")) {
                    ZipUtil.unzip(file);
                    // 先判断文件资源是否已导入
                    LambdaQueryWrapper<ImportResult> queryWrapper = new LambdaQueryWrapper<>();
                    queryWrapper.eq(ImportResult::getKey, file.getName());
                    List<ImportResult> importResults = sourceConfigService.getBaseMapper().selectList(queryWrapper);
                    if (CollectionUtils.isEmpty(importResults)) {
                        response.setExist(true);
                    }
                    response.setFileName(file.getName().split("\\.zip")[0]);
                    break;
                }
            }
        }

        log.info("get file name is {}.", response.getFileName());
        return response;
    }

    @GetMapping("/check/version")
    public Boolean checkVersion(@RequestParam("id") String id, @RequestParam("version") String version) {
        boolean flag = false;
        ComponentVersion componentVersion = componentVersionService.getComponentVersion(id, version);
        if (null != componentVersion) {
            flag = true;
        }
        return flag;
    }
}
