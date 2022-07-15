package com.cloudwise.lcap.source.service;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.io.FileUtil;
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
import com.cloudwise.lcap.source.dto.*;
import com.cloudwise.lcap.source.model.*;
import com.cloudwise.lcap.source.request.ApplicationExportRequest;
import com.cloudwise.lcap.source.request.ComponentExportRequest;
import com.cloudwise.lcap.source.response.ExportResourceResponse;
import com.cloudwise.lcap.source.response.ImportResourceResponse;
import com.cloudwise.lcap.source.response.ResourceFileResponse;
import com.google.common.collect.HashMultiset;
import com.google.common.collect.Lists;
import com.google.common.collect.Multiset;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.beetl.core.util.ArraySet;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.*;

@Slf4j
@Service
public class SourceConfigService {

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

    @Autowired
    private ImportResultDao importResultDao;

    /**
     * 导出组件
     *
     * @param flag 2-仅组件 3-应用+组件
     */
    public BaseResponse<ExportResourceResponse> exportComponents(HttpServletRequest requests, HttpServletResponse response, ComponentExportRequest request, String folder, int flag) {
        log.info("exportComponents: request is {}, folder is {}, flag is {}.", JsonUtils.toJSONString(request), folder, flag);
        log.info("components file base path is {}.", fileBasepath + COMPONENTS);
        log.info("download fil path is {}.", down_tmp_basepath);
        Set<String> ids = request.getIds();

        //组件打包参数 源码=componentSource node依赖模块=componentNodeModules 组件安装包=componentRelease
        List<String> componentExportTypes = request.getComponentExportType();
        if (CollectionUtils.isEmpty(componentExportTypes)) {
            log.error("请选择组件的导出方式!");
            throw new BaseException("请选择组件的导出方式!");
        }


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

                if (componentExportTypes.size() == 1 && componentExportTypes.contains(COMPILED_SOURCE_DEPEND)) {
                    //根据导出类型判断 是否存在 /{recentVersion}/release
                    String componentFilePath = fileBasepath + COMPONENTS + File.separator + id + File.separator + recentVersion + COMPONENT_RELEASE;
                    if (!new File(componentFilePath).exists()) {
                        log.error("组件:{} 版本:{} 不存在", component.getName(), componentFilePath);
                        componentsName.add(component.getName() + File.separator + recentVersion + COMPONENT_RELEASE);
                    }
                } else if (componentExportTypes.size() == 2 && componentExportTypes.contains(COMPONENT_SOURCE_COMPILED)) {
                    //根据导出类型判断 是否存在 v-current/src
                    String componentCurrentSrcFilePath = fileBasepath + COMPONENTS + File.separator + id + V_CURRENT + V_CURRENT_SRC;
                    if (!new File(componentCurrentSrcFilePath).exists()) {
                        log.error("组件:{} v-current源码:{} 不存在", component.getName(), componentCurrentSrcFilePath);
                        componentsName.add(component.getName() + V_CURRENT + V_CURRENT_SRC);
                    }
                } else if (componentExportTypes.size() == 3) {
                    //根据导出类型判断 是否存在  v-current/src 和 v-current/node_modules
                    String componentCurrentSrcFilePath = fileBasepath + COMPONENTS + File.separator + id + V_CURRENT + V_CURRENT_SRC;
                    if (!new File(componentCurrentSrcFilePath).exists()) {
                        log.error("组件导出源码+依赖包:{} v-current源码:{} 不存在", component.getName(), componentCurrentSrcFilePath);
                        componentsName.add(component.getName() + V_CURRENT + V_CURRENT_SRC);
                    }

                    String componentCurrentModulesFilePath = fileBasepath + COMPONENTS + File.separator + id + V_CURRENT + V_CURRENT_DEPENDED;
                    if (!new File(componentCurrentModulesFilePath).exists()) {
                        log.error("组件导出源码+依赖包:{} v-current依赖包:{} 不存在", component.getName(), componentCurrentModulesFilePath);
                        componentsName.add(component.getName() + V_CURRENT + V_CURRENT_DEPENDED);
                    }
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
                /**
                 *   v-current目录筛选：
                 *   - 组件安装包                       默认必选 只要 components安装包，（node_modules安装依赖包，不需要导出）
                 *   - 组件源码                        除了 components  node_modules 剩下所有
                 *   - Node 编译源码依赖模块             全部 文件夹下所有
                 */
                String componentCurrentFilePath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + V_CURRENT;
                //String fileCurrentPath = folder + COMPONENTS + File.separator + componentId;
                if (componentExportTypes.size() == 2 && componentExportTypes.contains(COMPONENT_SOURCE_COMPILED)) {
                    // 组件源码
                    String excludeModelPath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + V_CURRENT + V_CURRENT_DEPENDED;
                    String excludeGitPath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + V_CURRENT + V_CURRENT_DEPENDED;
                    String excludeGitIgnorePath = fileBasepath + COMPONENTS + File.separator + componentId + File.separator + V_CURRENT + V_CURRENT_DEPENDED;
                    String[] excludePath = new String[]{excludeModelPath,excludeGitPath,excludeGitIgnorePath};
                    log.info("导出组件:{} 的源码文件:{} 到:{}", componentId, componentCurrentFilePath, filePath);
                    FileUtils.copyFolder(componentCurrentFilePath, excludePath, filePath);
                } else if (componentExportTypes.size() == 3 && (componentExportTypes.contains(COMPONENT_SOURCE_COMPILED) && componentExportTypes.contains(COMPILED_SOURCE_COMPILED_WITH_DEPEND))) {
                    // 组件源码 + 编译源码环境文件
                    log.info("导出组件:{} 的源码+编译文件:{} 到:{}", componentId, componentCurrentFilePath, filePath);
                    FileUtils.copyFolder(componentCurrentFilePath, null, filePath);
                }
            }

            ComponentsListDto dto = ComponentsListDto.builder().components(this.generatorComponent(componentsInfo)).count(componentsInfo.size()).build();
            Manifest manifest = Manifest.builder().components(dto).componentExportType(componentExportTypes)
                    .componentList(componentDtoList).time(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).build();
            if (flag == 0 || flag == 2) {
                manifest.setType(COMPONENT);
            } else {
                manifest.setType(APPLICATION);
            }
            if (flag != 3) {
                log.info("开始写入json file...");
                FileUtils.writeJson(folder, config_filename, JsonUtils.jsonToMap(JsonUtils.toJSONString(manifest)));
            }
        }


        //打包临时文件夹A
        log.info("temp file path is {}.", folder);
        File zipFile = ZipUtil.zip(folder);

        //下载压缩包A.zip
        response.reset();
        response.setContentType("application/octet-stream;charset=utf-8");
        String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
        log.error("file name is {}.", downFileName);
        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
        response.setContentLength((int) zipFile.length());

        log.info("Start downloading the compressed package, and file name is {}, and size is {}", downFileName, new File(downFileName).length());

        long st = System.currentTimeMillis();
        try {
            InputStream inStream = new FileInputStream(zipFile);
            byte[] b = new byte[1024];
            int len;
            while ((len = inStream.read(b)) > 0) {
                response.getOutputStream().write(b, 0, len);
            }
            inStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        log.info("Compressed package download complete. and cost time is {}.", (System.currentTimeMillis() - st));
        ExportResourceResponse result = new ExportResourceResponse();
        result.setName(downFileName);
        result.setSize(new File(downFileName).length());
        return BaseResponse.success(result);
    }


    public <T> BaseResponse<T> exportApplications(HttpServletRequest requests, HttpServletResponse response, ApplicationExportRequest request) {
        log.info("applications file base path is {}.", fileBasepath + APPLICATIONS);
        log.info("download fil path is {}.", down_tmp_basepath);
        log.info("exportApplications: request is {}.", JsonUtils.toJSONString(request));

        List<String> ids = request.getIds();
        if (CollectionUtils.isEmpty(ids)) {
            log.error("请先选择应用!");
            throw new BizException("请先选择应用!");
        }
        // 校验应用个数
        Assert.assertFalse(ids.size() > 50, "应用和组件不得多于50个!");

        String type = request.getApplicationExportType();
        Assert.isBlank(type, "请选择导出配置!");

        // 获取选择的应用信息
        List<Application> applications = applicationDao.findById(ids);

        List<ApplicationDto> applicationDtoList = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(applications)) {
            applications.forEach(t -> {
                ApplicationDto dto = new ApplicationDto();
                dto.setId(t.getId().toHexString());
                BeanUtils.copyProperties(t, dto);
                applicationDtoList.add(dto);
            });
        }

        if (CollectionUtil.isEmpty(applicationDtoList)) {
            log.error("应用信息获取失败,applications:{}", applications);
            throw new BaseException("请选择组件的导出方式!");
        }

        //临时文件夹的绝对路径A
        String folder = down_tmp_basepath + File.separator + "应用-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        List<String> componentExportType = request.getComponentExportType();
        Set<String> componentIds = this.getComponentIds(applicationDtoList);
        ComponentExportRequest request1 = new ComponentExportRequest().setIds(componentIds).setComponentExportType(componentExportType);

        JSONObject configInfo = new JSONObject();
        if (type.equalsIgnoreCase(APP_ONLY)) {
            // 应用信息
            this.exportApp(requests,response,configInfo, applicationDtoList, folder, null, false, type, null,true);
            //this.exportComponents(requests, response, new ComponentExportRequest(), folder, 1);
        } else if (type.equalsIgnoreCase(APP_COMPONENT)) {
            //仅导出应用的组件
            Assert.notEmptyList(componentExportType, "未选择组件的导出方式!");
            this.exportComponents(requests, response, request1, folder, 2);
        } else if (type.equalsIgnoreCase(APP_AND_COMPONENT)) {
            //导出组件和应用
            Assert.notEmptyList(componentExportType, "未选择组件的导出方式!");
            // 应用信息
            this.exportApp(requests,response,configInfo, applicationDtoList, folder, null, true, type, componentExportType,false);
            this.exportComponents(requests, response, request1, folder, 3);
        }
        return BaseResponse.success("导出成功!");
    }


    public BaseResponse<ResourceFileResponse> checkFileExists() {
        // 先校验临时目录中是否存在文件
        File uploadTmpFilePath = new File(upload_tmp_basepath);

        log.info("upload file path is {}.", uploadTmpFilePath);
        ResourceFileResponse response = new ResourceFileResponse();
        if (!uploadTmpFilePath.exists()) {
            uploadTmpFilePath.mkdirs();

            return BaseResponse.success(response);
        }

        File[] files = uploadTmpFilePath.listFiles();
        boolean flag = false;
        for (File file : files) {
            if (file.isDirectory()) {
                // 先判断文件资源是否已导入
                List<ImportResult> importResults = importResultDao.findByKey(file.getName());
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
                    List<ImportResult> importResults = importResultDao.findByKey(file.getName());
                    if (CollectionUtils.isEmpty(importResults)) {
                        response.setExist(true);
                    }
                    response.setFileName(file.getName().split("\\.zip")[0]);
                    break;
                }
            }
        }

        log.info("get file name is {}.", response.getFileName());
        return BaseResponse.success(response);
    }

    public BaseResponse<String> importSourceConfig(MultipartFile file) {

        log.info("upload file path is {}.", upload_tmp_basepath);

        log.info("upload file name is {}.", file.getOriginalFilename());
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
        ZipUtil.unzip(upload_tmp_basepath + File.separator + fileName);

        return BaseResponse.success(fileName.split("\\.zip")[0]);
    }

    public BaseResponse<ImportResourceResponse> parseConfigFile(String key) {

        log.info("parseConfigFile: key is {}.", key);
        // 读取配置文件
        String configFilePath = upload_tmp_basepath + File.separator + key + File.separator + config_filename;
        if (!new File(configFilePath).exists()) {
            log.error("导入的压缩包中配置文件:{}不存在", configFilePath);
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }
        String configInfo = FileUtils.readJson(configFilePath);
        Manifest manifest;
        try {
            manifest = JsonUtils.parse(configInfo, Manifest.class);
        } catch (Exception e) {
            log.error("配置文件内容:{}解析为Manifest失败", configInfo);
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }

        String type = manifest.getType();

        ImportResourceResponse response = new ImportResourceResponse();
        response.setApplicationExportType(manifest.getApplicationExportType());
        response.setComponentExportType(manifest.getComponentExportType());

        if (APPLICATION.equals(type)) {
            // 应用信息
            List<ApplicationViewDto> applications = manifest.getApplications().getApplications();

            // 应用有组件信息
            List<String> applicationIds = applications.stream().map(ApplicationViewDto::getId).collect(Collectors.toList());
            List<Application> applicationList = applicationDao.findById(applicationIds);
            List<String> collect = applicationList.stream().map(Application::getId).map(ObjectId::toHexString).collect(Collectors.toList());

            Map<ObjectId, List<Application>> collects = applicationList.stream().collect(Collectors.groupingBy((Application::getId)));

            // 获取组件为新增还是修改
            List<ApplicationViewDto> applicationDtoList = new ArrayList<>();
            for (ApplicationViewDto dto : applications) {
                if (collect.contains(dto.getId())) {
                    // 更新
                    dto.setUpdate(true);

                    Application app = collects.get(new ObjectId(dto.getId())).get(0);
                    dto.setProjectId(app.getProjectId());
                    List<String> projectName = this.getProjectName(Collections.singletonList(app.getProjectId()));
                    if (CollectionUtils.isNotEmpty(projectName)) {
                        dto.setProjectName(projectName.get(0));
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
                List<ComponentViewDto> components = dto.getComponents();
                if (CollectionUtils.isNotEmpty(components)) {
                    Map<String, ComponentViewDto> componentViewDtoMap = new HashMap<>();
                    for (ComponentViewDto component : components) {
                        if (StringUtils.isNotBlank(component.getId())) {
                            componentViewDtoMap.putIfAbsent(component.getId(), component);
                        }
                    }

                    List<Component> cpList = componentDao.findByIds(Arrays.asList(componentViewDtoMap.keySet().toArray(new String[]{})));
                    Map<String, Component> collect1 = cpList.stream().collect(Collectors.toMap(o -> o.getId().toHexString(), o -> o));
                    componentViewDtoMap.forEach((k, t) -> {
                        Component cp = collect1.get(k);
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
                    });
                    dto.setComponents(Arrays.asList(componentViewDtoMap.values().toArray(new ComponentViewDto[]{})));
                }
                applicationDtoList.add(dto);
            }
            response.setType(APPLICATION);
            response.setApplications(applicationDtoList);
        } else {
            // 组件信息
            List<ComponentViewDto> components = manifest.getComponents().getComponents();
            List<String> componentIds = components.stream().map(ComponentViewDto::getId).collect(Collectors.toList());

            List<Component> componentList = componentDao.findByIds(componentIds);
            List<String> collect = componentList.stream().map(Component::getId).map(ObjectId::toHexString).collect(Collectors.toList());
            Map<ObjectId, List<Component>> collects = componentList.stream().collect(Collectors.groupingBy((Component::getId)));

            //List<ComponentViewDto> componentDtoList = new ArrayList<>();
            Map<String, ComponentViewDto> componentDtoMap = new HashMap<>();
            for (ComponentViewDto dto : components) {
                if (collect.contains(dto.getId())) {
                    dto.setUpdate(true);

                    Component component = collects.get(new ObjectId(dto.getId())).get(0);
                    String category = component.getCategory();
                    String subCategory = component.getSubCategory();
                    dto.setCategory(category);
                    dto.setSubCategory(subCategory);
                    dto.setCategoryName(this.getSubCategoryName(category, subCategory));
                    dto.setType(component.getType());
                    dto.setProjects(component.getProjects());
                    dto.setProjectsName(this.getProjectName(component.getProjects()));
                }
                componentDtoMap.putIfAbsent(dto.getId(), dto);
            }
            response.setType(COMPONENT);
            response.setComponents(Arrays.asList(componentDtoMap.values().toArray(new ComponentViewDto[]{})));
        }
        return BaseResponse.success(response);
    }


    public BaseResponse<Boolean> checkVersion(String id, String version) {

        Assert.isBlank(id, "组件id不能为空!");
        Assert.isBlank(version, "组件版本不能为空!");

        boolean flag = false;

        /**
         * {
         *     "no": "V1.0.1",
         *     "time": {
         *       "$date": "2022-05-30T08:48:51.486Z"
         *     },
         *     "status": "valid"
         *   }
         */
        List<Component> components = componentDao.findByIds(Collections.singletonList(id));

        if (CollectionUtils.isEmpty(components)) return BaseResponse.success(flag);

        List<JSONObject> versions = components.get(0).getVersions();
        if (CollectionUtils.isNotEmpty(versions)) {
            for (JSONObject obj : versions) {
                String no = (String) obj.get("no");
                if (version.trim().equals(no.trim())) {
                    flag = true;
                    break;
                }
            }
        }
        return BaseResponse.success(flag);
    }

    /**
     * 导入资源
     *
     * @param importType           导入类型 application 或者 component
     * @param key                  已经上传的压缩包 key
     * @param componentViewDtoList 导入类型为 component 时的组件信息
     * @param applications         导入类型为 application 时的应用信息
     * @return
     */
    public BaseResponse<ResourceImportResult> importResources(String importType, String key, List<ComponentViewDto> componentViewDtoList, List<ApplicationViewDto> applications) {
        ResourceImportResult result = new ResourceImportResult();

        String configFilePath = upload_tmp_basepath + File.separator + key + File.separator + config_filename;
        if (!new File(configFilePath).exists()) {
            log.error("导入的压缩包中配置文件不存在");
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }
        String configInfo = FileUtils.readJson(configFilePath);
        Manifest manifest;
        try {
            manifest = JsonUtils.parse(configInfo, Manifest.class);
        } catch (Exception e) {
            log.error("配置文件内容:{}解析为Manifest失败", configInfo);
            throw new BaseException("配置文件内容解析失败!");
        }

        if (APPLICATION.equals(importType)) {
            //导入应用
            // 1.优先校验前端传递给后端的应用名称是否存在重复
            List<String> collect = applications.stream().map(ApplicationViewDto::getName).collect(Collectors.toList());
            List<String> lists = HashMultiset.create(collect).entrySet().stream()
                    .filter(t -> t.getCount() > 1).map(Multiset.Entry::getElement).collect(Collectors.toList());
            if (CollectionUtils.isNotEmpty(lists)) {
                throw new BaseException("应用名称" + lists + "存在重复!");
            }

            // 2.再和库中已存在的名称进行校验
            List<String> names = new ArrayList<>();
            applications.forEach(t -> {
                Application application;
                if (t.isUpdate()) {
                    // 为更新时 排除掉id=t.getId() (自己)
                    application = applicationDao.findByNameAndId( t.getName(), t.getId());
                } else {
                    // 为新增时 进行全局名称校验
                    application = applicationDao.findByName(t.getName());
                }
                if (null != application) {
                    names.add(t.getName());
                }
            });
            if (CollectionUtils.isNotEmpty(names)) {
                throw new BaseException("应用" + names + "名称已存在!");
            }
            String applicationOnly = manifest.getApplicationExportType();
            importApplications(key, APP_ONLY.equals(applicationOnly), applications, manifest, result);
        } else if (COMPONENT.equals(importType)) {
            //导入组件
            importComponents(key, manifest, componentViewDtoList, result);
        }

        // 记录配置导入结果
        ImportResult importResult = new ImportResult();
        importResult.setKey(key);
        importResult.setCreateTime(new Date());
        importResult.setType(importType);
        importResult.setUpdateTime(new Date());

        if (CollectionUtils.isEmpty(result.getApplicationImportSuccess()) && CollectionUtils.isEmpty(result.getComponentImportSuccess())) {
            importResult.setStatus("0");
        } else {
            importResult.setStatus("1");
        }
        importResultDao.upsert(importResult);
        result.setKey(key);
        result.setType(importType);
        return BaseResponse.success(result);
    }


    private Set<String> getComponentIds(List<ApplicationDto> applications) {
        Set<String> ids = new ArraySet<>();
        for (ApplicationDto application : applications) {
            List<Object> pages = application.getPages();
            if (CollectionUtil.isNotEmpty(pages)) {
                for (Object page : pages) {
                    LinkedHashMap object = (LinkedHashMap) page;
                    List<Map> components = (List<Map>) object.get("components");
                    if (CollectionUtil.isNotEmpty(components)) {
                        for (Map object1 : components) {
                            ids.add((String) object1.get("type"));
                        }
                    }
                }
            }
        }
        return ids;
    }

    /**
     * 仅导出应用
     * @param requests
     * @param response
     * @param configInfo
     * @param applications
     * @param folder
     * @param creator 操作者
     * @param isContainComponent
     * @param applicationType
     * @param componentType 导出类型
     * @param packaged 是否打包,仅导出应用时需要在此打包，如果同时导出应用+组件，则在导出组件的方法里打包
     */
    private void exportApp(HttpServletRequest requests, HttpServletResponse response,
            JSONObject configInfo, List<ApplicationDto> applications, String folder, String creator, boolean isContainComponent,
                           String applicationType, List<String> componentType,boolean packaged) {
        //仅导出应用
        configInfo.put("application", applications);

        Manifest manifest = new Manifest();
        ApplicationsListDto dto = new ApplicationsListDto();
        dto.setApplications(this.generatorApplication(applications, isContainComponent));
        dto.setCount(applications.size());

        manifest.setApplications(dto);
        manifest.setType(APPLICATION);
        manifest.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        manifest.setCreator(creator);
        manifest.setApplicationExportType(applicationType);
        manifest.setComponentExportType(componentType);

        // 应用详细信息
        manifest.setApplicationList(applications);
        // 组件详细信息
        if (isContainComponent) {
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
        }

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
        if (packaged){
            //打包临时文件夹A
            log.info("temp file path is {}.", folder);
            File zipFile = ZipUtil.zip(folder);

            //下载压缩包A.zip
            response.reset();
            response.setContentType("application/octet-stream;charset=utf-8");
            String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
            log.error("file name is {}.", downFileName);
            response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
            response.setContentLength((int) zipFile.length());

            log.info("Start downloading the compressed package, and file name is {}, and size is {}", downFileName, new File(downFileName).length());

            long st = System.currentTimeMillis();
            try {
                InputStream inStream = new FileInputStream(zipFile);
                byte[] b = new byte[1024];
                int len;
                while ((len = inStream.read(b)) > 0) {
                    response.getOutputStream().write(b, 0, len);
                }
                inStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
            log.info("Compressed package download complete. and cost time is {}.", (System.currentTimeMillis() - st));
            ExportResourceResponse result = new ExportResourceResponse();
            result.setName(downFileName);
            result.setSize(new File(downFileName).length());
        }
    }

    private List<ApplicationViewDto> generatorApplication(List<ApplicationDto> applications, boolean isContainComponent) {
        if (CollectionUtils.isEmpty(applications)) {
            return Lists.newArrayList();
        }

        List<String> applicationIds = applications.stream().map(t -> t.getProjectId()).collect(Collectors.toList());

        List<Project> projects = projectDao.findByIds(applicationIds);
        Map<String, Project> projectMap = projects.stream().collect(Collectors.toMap(o -> o.getId().toHexString(), o -> o));
        List<ApplicationViewDto> applicationViewDtos = new ArrayList<>();
        applications.forEach(t -> {
            ApplicationViewDto dto = new ApplicationViewDto();
            dto.setId(t.getId());
            dto.setName(t.getName());
            dto.setProjectId(t.getProjectId());
            Project project = projectMap.get(t.getProjectId());
            if (null != project) {
                dto.setProjectName(project.getName());
            }

            if (isContainComponent) {
                List<ComponentViewDto> componentViewDtos = new ArrayList<>();
                List<Object> pages = t.getPages();
                if (CollectionUtils.isNotEmpty(pages)) {
                    for (Object page : pages) {
                        Map<String, Object> object = (Map<String, Object>) page;
                        List<Map<String, Object>> components = (List<Map<String, Object>>) object.get("components");
                        if (CollectionUtil.isNotEmpty(components)) {
                            List<String> componentIds = components.stream().map(component -> String.valueOf(component.get("type"))).collect(Collectors.toList());
                            List<Component> componentList = componentDao.findByIds(componentIds);
                            Map<String, Component> collect = componentList.stream().collect(Collectors.toMap(o -> o.getId().toHexString(), o -> o));
                            for (Map<String, Object> object1 : components) {
                                String id = String.valueOf(object1.get("type"));
                                Component component1 = collect.get(id);
                                if (null != component1) {
                                    ComponentViewDto dto1 = new ComponentViewDto();
                                    dto1.setId(component1.getId().toHexString());

                                    // 设置组件所属项目信息
                                    List<String> ids = component1.getProjects();
                                    dto1.setProjects(component1.getProjects());
                                    if (CollectionUtils.isNotEmpty(ids)) {
                                        List<String> projectsName = null;
                                        List<Project> projectList = projectDao.findByIds(ids);
                                        if (CollectionUtils.isNotEmpty(projectList)) {
                                            projectsName = projectList.stream().map(Project::getName).collect(Collectors.toList());
                                        }
                                        dto1.setProjectsName(projectsName);
                                    }

                                    dto1.setType(component1.getType());
                                    dto1.setName(component1.getName());
                                    dto1.setVersion(this.getComponentNewestVersion(component1.getVersions()));
                                    dto1.setDevelopStatus(component1.getDevelopStatus());

                                    dto1.setIsLab(component1.getIsLib());
                                    dto1.setFrom(component1.getFrom());
                                    dto1.setAllowDataSearch(component1.getAllowDataSearch());
                                    dto1.setCreator(component1.getCreator());
                                    dto1.setCreateTme(component1.getCreateTme());
                                    dto1.setDesc(component1.getDesc());

                                    String categoryId = component1.getCategory();
                                    if (StringUtils.isNotBlank(categoryId)) {
                                        dto1.setCategory(component1.getCategory());
                                        List<ComponentCategory> categoryList = categoryDao.findCategoryById(categoryId);
                                        if (CollectionUtils.isNotEmpty(categoryList)) {
                                            outCycle:
                                            for (ComponentCategory category : categoryList) {
                                                if (null == category) {
                                                    continue;
                                                }

                                                List<JSONObject> categories = category.getCategories();
                                                if (CollectionUtils.isEmpty(categories)) {
                                                    continue;
                                                }
                                                for (JSONObject cg : categories) {
                                                    List<Map<String, Object>> children = JsonUtils.jsonToListMap(cg.getStr("children"));
                                                    if (CollectionUtils.isNotEmpty(children)) {
                                                        for (Map<String, Object> child : children) {
                                                            String subId = (String) child.get("id");
                                                            if (component1.getSubCategory().equals(subId)) {
                                                                dto1.setCategoryName((String) child.get("name"));
                                                                break outCycle;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    dto1.setSubCategory(component1.getSubCategory());
                                    componentViewDtos.add(dto1);
                                }
                            }
                        }
                    }
                }
                dto.setComponents(componentViewDtos);
            }

            applicationViewDtos.add(dto);
        });

        return applicationViewDtos;
    }

    private String getComponentNewestVersion(List<JSONObject> versions) {

        if (CollectionUtils.isEmpty(versions)) {
            return null;
        }
        int size = versions.size();
        JSONObject jsonObject = versions.get(size - 1);
        return (String) jsonObject.get("no");
    }


    private List<ComponentViewDto> generatorComponent(List<Component> components) {
        if (CollectionUtils.isEmpty(components)) {
            return Lists.newArrayList();
        }

        List<ComponentViewDto> componentViewDtos = new ArrayList<>();
        components.forEach(t -> {
            ComponentViewDto dto = new ComponentViewDto();
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

    /**
     * 导入应用
     */
    public void importApplications(String key, boolean applicationOnly, List<ApplicationViewDto> applications, Manifest manifest, ResourceImportResult result) {

        List<ApplicationDto> applicationList = manifest.getApplicationList();
        Map<String, ApplicationDto> collect = applicationList.stream().collect(Collectors.toMap(ApplicationDto::getId, Function.identity()));

        if (applicationOnly) {
            //仅导入应用 ，读取应用信息,导入到新环境的应用表
            for (ApplicationViewDto application : applications) {
                String id = application.getId();
                ApplicationDto originApplication = collect.get(id);
                this.importApplicationOnly(key, application, originApplication, result);
            }
        } else {
            //导入应用和组件
            for (ApplicationViewDto application : applications) {
                String id = application.getId();
                ApplicationDto originApplication = collect.get(id);
                //1 读取应用信息,导入到新环境的应用表
                importApplicationOnly(key, application, originApplication, result);
            }

            Map<String, ComponentViewDto> componentViewDtoMap = new HashMap<>();
            for (ApplicationViewDto application : applications) {
                List<ComponentViewDto> components = application.getComponents();
                if (CollectionUtil.isNotEmpty(components)){
                    for (ComponentViewDto component : components) {
                        if (!componentViewDtoMap.containsKey(component.getName())){
                            componentViewDtoMap.put(component.getName(),component);
                        }
                    }
                }
            }
            List<ComponentViewDto> componentViewDtoList = Arrays.asList(componentViewDtoMap.values().toArray(new ComponentViewDto[]{}));
            importComponents(key, manifest, componentViewDtoList, result);
        }
    }


    /**
     * @param key         已经上传的压缩包 key
     * @param application
     * @param application 前端传递过来的参数封装
     */
    public void importApplicationOnly(String key, ApplicationViewDto application, ApplicationDto originApplication, ResourceImportResult result) {
        originApplication.setId(application.getId());
        originApplication.setName(application.getName());
        originApplication.setProjectId(application.getProjectId());

        originApplication.setUpdateTime(new Date());
        if (!application.isUpdate()) {
            originApplication.setCreateTime(new Date());
        }

        originApplication.setStatus("valid");

        Application app = new Application();
        app.setId(new ObjectId(originApplication.getId()));
        BeanUtils.copyProperties(originApplication, app);
        app.setIsUpdate(null);
        log.info("3223,app:{}", app);
        applicationDao.insert(app);

        //应用所属封面信息 cover 覆盖
        // /Users/edz/Documents/lcap/upload_tmp_basepath/applications_6246998c4af211725370430f_20220511181533/applications/61bc02c7e47520420c337d57/*
        String sourcePath = upload_tmp_basepath + File.separator + key + APPLICATIONS + File.separator + application.getId();
        String destPath = application_baseapth;
        if (new File(sourcePath).exists()) {
            // 2.拷贝文件covers
            FileUtils.copyFolder(sourcePath, null, destPath);
        }
        result.getApplicationImportSuccess().add(application.getName());
    }

    /**
     * @param key                  已经上传的压缩包 key
     * @param manifest             导入时的配置文件信息
     * @param importResult         result
     * @param componentViewDtoList 待导入的组件信息列表
     */
    public void importComponents(String key, Manifest manifest, List<ComponentViewDto> componentViewDtoList, ResourceImportResult importResult) {
        // 校验应用名称是否存在重复
        if (CollectionUtils.isEmpty(componentViewDtoList)) {
            log.error("导入组件时组件列表为空");
           return;
        }
        checkComponentsNameExists(componentViewDtoList);
        List<Component> components = componentViewDtoList.stream().map(t -> Component.builder().id(new ObjectId(t.getId())).category(t.getCategory()).type(t.getType()).subCategory(t.getSubCategory())
                .name(t.getName()).projects(t.getProjects()).isUpdate(t.isUpdate()).version(t.getVersion())
                .from(t.getFrom()).isLib(t.getIsLab()).allowDataSearch(t.getAllowDataSearch()).creator(t.getCreator())
                .createTme(t.getCreateTme()).desc(t.getDesc()).build()).collect(Collectors.toList());

        List<ComponentDto> components1 = manifest.getComponentList();
        Map<String, ComponentDto> collect = components1.stream().collect(Collectors.toMap(ComponentDto::getId, Function.identity()));
        //预先检查资源文件是否存在，不存在则直接报错
        for (Component component : components) {
            String componentId = component.getId().toHexString();
            String sourceFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId;
            if (!new File(sourceFolder).exists()) {
                log.error("组件:{} 临时文件:{} 不存在,导入失败", component.getName(), sourceFolder);
                importResult.getComponentImportFailed().add(component.getName());
            }
        }


        for (Component component : components) {
            String componentId = component.getId().toHexString();
            ComponentDto originComponent = collect.get(componentId);
            originComponent.setName(component.getName());
            originComponent.setType(component.getType());
            originComponent.setProjects(component.getProjects());
            originComponent.setCategory(component.getCategory());
            originComponent.setSubCategory(component.getSubCategory());
            originComponent.setAllowDataSearch(component.getAllowDataSearch());
            originComponent.setFrom(component.getFrom());
            originComponent.setIsLib(component.getIsLib());
            originComponent.setDesc(component.getDesc());
            originComponent.setUpdateTime(new Date());
            originComponent.setDevelopStatus("online");
            originComponent.setStatus("valid");
            originComponent.setUpdater(component.getCreator());
            originComponent.setUpdateTime(new Date());
            //用户手动设置的版本号
            String version = component.getVersion();
            List<JSONObject> manifestComponentVersions = originComponent.getVersions();
            boolean componentVersionNew = false;

            if (component.getIsUpdate()) {
                // 组件为更新
                Component components2 = componentDao.findById(componentId);
                if (null != components2) {
                    // 获取新平台中组件的版本 versions
                    List<JSONObject> versions = components2.getVersions();
                    if (CollectionUtils.isEmpty(versions)) {
                        versions = new ArrayList<>();
                    }

                    List<String> componentHistoryVersion = versions.stream().map(obj -> obj.getStr("no")).collect(Collectors.toList());
                    if (componentHistoryVersion.contains(version)) {
                        //此时时修改组件，并且组件的版本已存在， 直接替换文件 ，更新version中的time字段
                        for (JSONObject ve : versions) {
                            if (version.equals(ve.getStr("no"))) {
                                ve.put("time", new Date());
                            }
                        }
                    } else {
                        componentVersionNew = true;
                        // 类似于新增 将新增的版本添加到versions中
                        JSONObject jsonObjects = new JSONObject();
                        jsonObjects.put("no", version);
                        jsonObjects.put("time", new Date());
                        jsonObjects.put("status", "valid");
                        jsonObjects.put("desc", version);
                        versions.add(jsonObjects);
                    }
                    originComponent.setVersions(versions);
                } else {
                    //组件为新增
                    componentVersionNew = true;
                    originComponent.setCreateTme(new Date());
                    JSONObject js = new JSONObject();
                    js.put("no", version);
                    js.put("time", new Date());
                    js.put("status", "valid");
                    js.put("desc", version);
                    originComponent.setVersions(Collections.singletonList(js));
                }
            } else {
                //组件为新增
                componentVersionNew = true;
                originComponent.setCreateTme(new Date());
                JSONObject js = new JSONObject();
                js.put("no", version);
                js.put("time", new Date());
                js.put("status", "valid");
                js.put("desc", version);
                originComponent.setVersions(Collections.singletonList(js));
            }

            String originComponentNewestVersion = this.getComponentNewestVersion(manifestComponentVersions);
            // 为新创建的version
            if (componentVersionNew) {
                //导出的文件中的最新版本号
                // 替换new cover文件中的version标识
                String releaseMain = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originComponentNewestVersion + RELEASE_MAIN;
                String releaseSetting = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originComponentNewestVersion + RELEASE_SETTING;

                FileUtils.autoReplace(releaseMain, originComponentNewestVersion, version);
                FileUtils.autoReplace(releaseSetting, originComponentNewestVersion, version);
            }

            //先复制copy对应的版本，因为牵涉到修改最新版的版本名称
            String destFolder = component_basepath + File.separator + componentId + File.separator + version;
            //备份旧数据
//            String destFolderBak = component_basepath + File.separator + componentId + File.separator + version + "_bak";
//            File file1 = new File(destFolder);
//            if (file1.exists()){
//                file1.renameTo(new File(destFolderBak));
//            }
            String sourceFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + originComponentNewestVersion;
            log.info("新版本release从sourceFolder:{} 复制到destFolder:{}",sourceFolder,destFolder);
            File[] files = new File(sourceFolder).listFiles();
            if (files != null && files.length > 0) {
                for (File file : files) {
                    //2 将包复制到组件文件夹
                    FileUtils.copyFolder(sourceFolder + File.separator + file.getName(), null, destFolder);
                }
            }
            //再复制其他文件
            String destCurFolder = component_basepath + File.separator + componentId + File.separator + V_CURRENT;
//            String destCurFolderBak = component_basepath + File.separator + componentId + File.separator + V_CURRENT + "_bak";
//            File file2 = new File(destCurFolder);
//            if (file2.exists()){
//                file2.renameTo(new File(destCurFolderBak));
//            }
            String sourceCurFolder = upload_tmp_basepath + File.separator + key + COMPONENTS + File.separator + componentId + File.separator + V_CURRENT;
            log.info("v-current从sourceFolder:{} 复制到destFolder:{}",sourceCurFolder,destCurFolder);
            File[] curFiles = new File(sourceCurFolder).listFiles();
            if (curFiles != null && curFiles.length > 0) {
                for (File file : curFiles) {
                    //2 将包复制到组件文件夹
                    FileUtils.copyFolder(sourceCurFolder + File.separator + file.getName(), null, destCurFolder);
                }
            }

            //1 读取组件信息，导入到新环境的表
            Component comp = new Component();
            comp.setId(new ObjectId(originComponent.getId()));
            comp.setIsLib(originComponent.getIsLib());
            BeanUtils.copyProperties(originComponent, comp);
            componentDao.insert(comp);

            importResult.getComponentImportSuccess().add(component.getName());
        }
    }


    /**
     * 获取list集合中的重复元素 只针对基本数据类型和string
     */
    private List<?> getRepeatElementsForList(List<?> list) {
        if (CollectionUtils.isEmpty(list)) {
            return Lists.newArrayList();
        }

        return HashMultiset.create(list).entrySet().stream()
                .filter(t -> t.getCount() > 1)
                .map(Multiset.Entry::getElement)
                .collect(Collectors.toList());
    }

    private void checkComponentsNameExists(List<ComponentViewDto> components) {
        List<String> names = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(components)) {
            // 1.优先校验前端传递给后端的应用名称是否存在重复
            List<String> collect = components.stream().map(ComponentViewDto::getName).collect(Collectors.toList());
            List<?> lists = this.getRepeatElementsForList(collect);
            if (CollectionUtils.isNotEmpty(lists)) {
                throw new BaseException("组件名称" + lists + "存在重复!");
            }
            // 2.再和库中已存在的名称进行校验
            components.forEach(t -> {
                if (null != t && null != t.getName()) {
                    List<Component> component;
                    if (t.isUpdate()) {
                        // 为更新时 排除掉id=t.getId() (自己)
                        component = componentDao.findByNameAndId(t.getName(), t.getId());
                        log.info("更新组件id:{},name:{},component:{}",t.getId(), t.getName(),component);
                    } else {
                        // 为新增时 进行全局名称校验
                        component = componentDao.findByName(t.getName());
                        log.info("新增组件id:{},name:{},component:{}",t.getId(), t.getName(),component);
                    }
                    if (CollectionUtils.isNotEmpty(component)) {
                        names.add(t.getName());
                    }
                }
            });
        }

        if (CollectionUtils.isNotEmpty(names)) {
            throw new BaseException("组件" + names + "名称已存在!");
        }
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

}
