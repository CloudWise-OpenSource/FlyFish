package com.cloudwise.lcap.devserver.controller;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.entity.AppVar;
import com.cloudwise.lcap.commonbase.entity.Application;
import com.cloudwise.lcap.commonbase.exception.BaseException;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.mapper.*;
import com.cloudwise.lcap.commonbase.mapstruct.StructUtil;
import com.cloudwise.lcap.commonbase.service.IAppVarService;
import com.cloudwise.lcap.commonbase.service.IApplicationService;
import com.cloudwise.lcap.commonbase.util.FileUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.commonbase.vo.AppVarListResVo;
import com.cloudwise.lcap.commonbase.vo.ApplicationCopyReqVo;
import com.cloudwise.lcap.commonbase.vo.ApplicationCreateReqVo;
import com.cloudwise.lcap.commonbase.vo.IdRespVo;
import com.cloudwise.lcap.devserver.dto.ExportResourceResponse;
import com.cloudwise.lcap.devserver.service.ApplicationService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import static com.cloudwise.lcap.commonbase.contants.Constant.APPLICATIONS;

/**
 * <p>
 *
 * </p>
 *
 * @author ethan.du
 * @since 2022-08-01
 */
@Slf4j
@RestController
@RequestMapping("/applications")
public class ApplicationController {
    @Autowired
    private IAppVarService iAppVarService;

    @Autowired
    private StructUtil structUtil;

    @Autowired
    private IApplicationService iApplicationService;

    @Autowired
    private ApplicationMapper applicationMapper;
    @Resource
    private DataQueryMapper dataQueryMapper;

    @Resource
    private DataCombineQueryMapper dataCombineQueryMapper;

    @Resource
    private DataSourceMapper dataSourceMapper;

    @Resource
    private DataTableMapper dataTableMapper;
    @Value("${portal_web_path}")
    private String portalWebPath;

    @Value("${lcap_www_path}")
    private String lcap_www_path;

    @Value("${lcap.application.build_path}")
    private String appBuildPath;

    @Value("${lcap_www_relative_path}")
    private String wwwRelativePath;

    @Value("${lcap.component.path}")
    private String componentPath;

    @Value("${lcap.application.tpl_path}")
    private String appTplPath;

    @Value("${lcap.component.common_path}")
    private String commonPath;

    @Value("${lcap.application.path}")
    private String applicationPath;

    @Value("${app_base_path}")
    private String appBasePath;

    @Value("${db_bathpath}")
    private String dbBathPath;

    @Autowired
    private ApplicationService applicationService;

    /**
     * 新建大屏,两个问题：
     * 1.新建大屏时应该创建对应的大屏文件夹
     * 2.大屏封面图 /lcapWeb/www/application_tpl/public/cover.jpeg 应复制一份到对应的大屏文件夹下
     * @param basicInfo
     * @return
     */
    @PostMapping("")
    public IdRespVo create(@Validated @RequestBody ApplicationCreateReqVo basicInfo) {
        return applicationService.create(basicInfo);
    }

    @PostMapping("/copy/{id}")
    public IdRespVo copyApp(@PathVariable String id, @Validated @RequestBody ApplicationCopyReqVo appInfo) {
        return applicationService.copyApp(id, appInfo);
    }

    /**
     * 导出应用部署包：包括前端大屏包和后端jar包
     *
     * @param id
     * @param requests
     * @param response
     * @return
     */
    @GetMapping("/export/{id}")
    public ExportResourceResponse export(@PathVariable String id, HttpServletRequest requests,
                                         HttpServletResponse response) {
        LambdaQueryWrapper<Application> appWrapper = new LambdaQueryWrapper<>();
        appWrapper.eq(Application::getId, id);
        Application application = iApplicationService.getBaseMapper().selectOne(appWrapper);
        Path targetAppPath = Paths.get(appBuildPath, id);
        Path configPath = Paths.get(appBuildPath, id, "config");

        List<JSONObject> pageList = JsonUtils.parseArray(application.getPages(), JSONObject.class);

        HashMap mergedOption = new HashMap();
        if (pageList != null) {
            for (JSONObject page : pageList) {
                JSONObject options = page.getJSONObject("options");
                if (options != null) {
                    String backgroundImage = options.getStr("backgroundImage");
                    if (backgroundImage != null) {
                        if (!backgroundImage.startsWith("/")){
                            backgroundImage = "/" + backgroundImage;
                        }
                        backgroundImage = backgroundImage.replace(wwwRelativePath + "/", "");
                        options.set("backgroundImage", backgroundImage);
                    }

                    String envGlobalOptions = options.getStr("ENVGlobalOptions");
                    HashMap envGlobalOptionMap = JsonUtils.jsonToMap(envGlobalOptions);
                    if (envGlobalOptionMap != null)
                        mergedOption.putAll(envGlobalOptionMap);

                }

                List<JSONObject> components = page.getBeanList("components", JSONObject.class);
                for (JSONObject component : components) {
                    JSONObject componentOption = component.getJSONObject("options");
                    if (componentOption != null) {
                        String image = componentOption.getStr("image");
                        if (image != null) {
                            if (!image.startsWith("/")){
                                image = "/" + image;
                            }
                            image = image.replace(wwwRelativePath + "/", "");
                            componentOption.set("image", image);
                        }
                    }
                    String type = component.getStr("type");
                    if ("PageLink".equals(type)) {
                        continue;
                    }
                    Path sourceComponentPath = Paths.get(componentPath, type, component.getStr("version"), "release");
                    Path targetComponentPath =
                            Paths.get(targetAppPath.toString(), "components", type, component.getStr("version"), "release");
                    FileUtils.copyFolderWithDepth(sourceComponentPath.normalize().toString(), null,
                            targetComponentPath.normalize().toString(), null);
                }
            }
        }

        HashMap<String, Object> envConf = new HashMap<>();
        envConf.put("id", id);
        envConf.put("pages", pageList);
        FileUtils.writeJson(configPath.normalize().toString(), "env.conf.json", envConf);

        Path envTplPath = Paths.get(appTplPath, "config/env.js");
        String envTplStr = FileUtils.readJsonFile(envTplPath.toString());
        String envStr = String.format(envTplStr, JsonUtils.toJSONString(mergedOption));
        FileUtils.writeStr(targetAppPath.toString() + "/config", "env.production.js", envStr);

        FileUtils.copyFolderWithDepth(commonPath, null, targetAppPath + "/public", null);
        FileUtil.copy(appTplPath + "/public/cover.jpeg", targetAppPath + "/public/cover.jpeg",true);
        FileUtil.copy(appTplPath + "/index.html", targetAppPath + "/index.html",true);

        // 图片下载
        FileUtils.copyFolderWithDepth(applicationPath + "/" + id, null, targetAppPath + "/applications/" + id, null);

        File zipFile = ZipUtil.zip(targetAppPath.toString());
        response.reset();
        response.setContentType("application/octet-stream;charset=utf-8");
        String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
        response.setContentLength((int)zipFile.length());

        long st = System.currentTimeMillis();
        try {
            InputStream inStream = Files.newInputStream(zipFile.toPath());
            byte[] b = new byte[1024];
            int len;
            while ((len = inStream.read(b)) > 0) {
                response.getOutputStream().write(b, 0, len);
            }
            inStream.close();

            log.info("Compressed package download complete. and cost time is {}.", (System.currentTimeMillis() - st));
            ExportResourceResponse result = new ExportResourceResponse();
            result.setName(downFileName);
            result.setSize(new File(downFileName).length());
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            FileUtils.delFolder(targetAppPath.toString());
            zipFile.delete();

        }

        return null;
    }

//    @GetMapping("/export/{id}")
//    public ExportResourceResponse export(@PathVariable String id, HttpServletRequest requests, HttpServletResponse response) {
//        LambdaQueryWrapper<Application> appWrapper = new LambdaQueryWrapper<>();
//        appWrapper.eq(Application::getId, id);
//        Application application = iApplicationService.getBaseMapper().selectOne(appWrapper);
//        Path targetAppPath = Paths.get(appBuildPath, id, "web");
//        Path configPath = Paths.get(targetAppPath.normalize().toString(), "config");
//
//        HashMap<String, Object> mergedOption = new HashMap<>();
//        Set<String> dataQueryIds = new HashSet<>();
//        List<JSONObject> pageList = JsonUtils.parseArray(application.getPages(), JSONObject.class);
//        if (CollectionUtil.isNotEmpty(pageList)) {
//            JSONObject jsonObject = buildPages(pageList, targetAppPath);
//            mergedOption.putAll(jsonObject.getJSONObject("mergedOption"));
//            dataQueryIds.addAll(jsonObject.getBeanList("dataQueryIds", String.class));
//        }
//
//        // 获取变量相关信息
//        LambdaQueryWrapper<AppVar> appVarWrapper = new LambdaQueryWrapper<>();
//        appVarWrapper.eq(AppVar::getAppId, id);
//        List<AppVar> appVars = iAppVarService.getBaseMapper().selectList(appVarWrapper);
//        ArrayList<AppVarListResVo> appVarListResVos = new ArrayList<>();
//        appVars.forEach(var -> {
//            AppVarListResVo appVarListResVo = structUtil.convertAppVarRespVo(var);
//            appVarListResVos.add(appVarListResVo);
//        });
//
//        HashMap<String, Object> envConf = new HashMap<>();
//        envConf.put("id", id);
//        envConf.put("pages", pageList);
//        envConf.put("variables", appVarListResVos);
//        FileUtils.writeJson(configPath.normalize().toString(), "env.conf.json", envConf);
//
//        Path envTplPath = Paths.get(appTplPath, "config/env.js");
//        String envTplStr = FileUtils.readJsonFile(envTplPath.toString());
//        String envStr = String.format(envTplStr, JsonUtils.toJSONString(mergedOption));
//        FileUtils.writeStr(targetAppPath.toString() + "/config", "env.production.js", envStr);
//
//        FileUtils.copyFolderWithDepth(commonPath, null, targetAppPath + "/public", null);
//        FileUtil.copy(appTplPath + "/public/cover.jpeg", targetAppPath + "/public/cover.jpeg", true);
//        FileUtil.copy(appTplPath + "/index.html", targetAppPath + "/index.html", true);
//
//        // 图片下载
//        FileUtils.copyFolderWithDepth(applicationPath + "/" + id, null, targetAppPath + "/applications/" + id, null);
//
//
//        if (!CollectionUtils.isEmpty(dataQueryIds)) {
//            //创建路径 复制jar包
//            Path serverPath = Paths.get(appBuildPath, id, "server");
//            File serverFileDir = new File(serverPath.toString());
//            if (!serverFileDir.exists()) {
//                serverFileDir.mkdirs();
//            }
//            try {
//                //复制文件
//                IoUtil.copy(new FileInputStream(appBasePath + "/lcapDevServer/export/server.jar"),
//                        new FileOutputStream(serverPath + "/server.jar"));
//            } catch (FileNotFoundException e) {
//                log.error("文件夹复制失败" + e);
//                throw new BizException("文件夹复制失败");
//            }
//
//            List<DataQuery> byQueryIds = dataQueryMapper.getListByIds(dataQueryIds);
//            List<String> combineIds = new LinkedList<>();
//            Map<String, DataQuery> dataQueryMap = new HashMap<>();
//            Set<String> dataSourceIds = new HashSet<>();
//            for (DataQuery dataQuery : byQueryIds) {
//                String queryId = dataQuery.getId();
//                Integer queryType = dataQuery.getQueryType();
//                String dataSourceId = dataQuery.getDataSourceId();
//                dataQueryMap.put(queryId, dataQuery);
//                dataSourceIds.add(dataSourceId);
//                if (null == queryType || queryType.equals(SIMPLE)) {
//                    continue;
//                }
//                combineIds.add(queryId);
//            }
//            Map<String, List<String>> combineIdsMap = new HashMap<>();
//            if (!CollectionUtils.isEmpty(combineIds)) {
//                List<DataCombineQuery> combineQueries = dataCombineQueryMapper.getListByCombineQueryIds(combineIds);
//                Set<String> refQueryIds = new HashSet<>();
//                for (DataCombineQuery query : combineQueries) {
//                    String combineQueryId = query.getCombineQueryId();
//                    String refQueryId = query.getRefQueryId();
//                    refQueryIds.add(refQueryId);
//                    List<String> strings = combineIdsMap.get(combineQueryId);
//                    if (strings == null) {
//                        strings = new LinkedList<>();
//                    }
//                    strings.add(refQueryId);
//                    combineIdsMap.put(combineQueryId, strings);
//                }
//                List<DataQuery> byRefQueryIds = dataQueryMapper.getListByIds(refQueryIds);
//                for (DataQuery dataQuery : byRefQueryIds) {
//                    String dataSourceId = dataQuery.getDataSourceId();
//                    String queryId = dataQuery.getId();
//                    dataQueryMap.put(queryId, dataQuery);
//                    dataSourceIds.add(dataSourceId);
//                }
//            }
//            //获取数据源信息
//            List<DataSource> byDatasourceIds = dataSourceMapper.getListByIds(dataSourceIds);
//
//            Map<String, DataSource> dataSourceMap = byDatasourceIds.stream().collect(Collectors.toMap(DataSource::getDatasourceId, d -> d));
//            //获取数据表
//            List<DataTable> tables = dataTableMapper.getListByDataSourceIds(new LinkedList<>(dataSourceIds));
//            Map<String, List<DataTable>> tablesMap = new HashMap<>();
//            for (DataTable dataTable : tables) {
//                String dataSourceId = dataTable.getDataSourceId();
//                List<DataTable> dataTables = tablesMap.get(dataSourceId);
//                if (dataTables == null) {
//                    dataTables = new LinkedList<>();
//                }
//                dataTables.add(dataTable);
//                tablesMap.put(dataSourceId, dataTables);
//            }
//
//            HashMap<String, Object> serverJsonData = new HashMap<>();
//            serverJsonData.put(ExportConstant.DATA_QUERY, dataQueryMap);
//            serverJsonData.put(ExportConstant.DATA_SOURCE, dataSourceMap);
//            serverJsonData.put(ExportConstant.DATA_TABLE, tablesMap);
//            serverJsonData.put(ExportConstant.COMBINE_QUERY_IDS, combineIdsMap);
//            FileUtils.writeJson(serverPath.normalize().toString(), ExportConstant.JSON_DATA_FILE_NAME, serverJsonData);
//        }
//
//        Path zipPath = Paths.get(appBuildPath, id);
//
//        try {
//            //复制readme过去
//            IoUtil.copy(new FileInputStream(appBasePath + "/lcapDevServer/export/README.md"),
//                    new FileOutputStream(zipPath + "/README.md"));
//        } catch (FileNotFoundException e) {
//            log.error("文件夹复制失败" + e);
//            throw new BizException("文件夹复制失败");
//        }
//
//        File zipFile = ZipUtil.zip(zipPath.toString());
//        response.reset();
//        response.setContentType("application/octet-stream;charset=utf-8");
//        String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
//        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
//        response.setContentLength((int) zipFile.length());
//
//        long st = System.currentTimeMillis();
//        InputStream inStream = null;
//        try {
//            inStream = Files.newInputStream(zipFile.toPath());
//            byte[] b = new byte[1024];
//            int len;
//            while ((len = inStream.read(b)) > 0) {
//                response.getOutputStream().write(b, 0, len);
//            }
//
//            log.info("Compressed package download complete. and cost time is {}.", (System.currentTimeMillis() - st));
//            ExportResourceResponse result = new ExportResourceResponse();
//            result.setName(downFileName);
//            result.setSize(new File(downFileName).length());
//            return result;
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            FileUtils.delFolder(targetAppPath.toString());
//            if (!zipFile.delete()){
//                throw new BizException("文件删除失败");
//            }
//            if (inStream != null){
//                try {
//                    inStream.close();
//                } catch (IOException e) {
//                }
//            }
//        }
//
//        return null;
//    }


    private JSONObject buildPages(List<JSONObject> pageList, Path targetAppPath) {
        HashMap<String, Object> mergedOption = new HashMap<>();
        Set<String> dataQueryIds = new HashSet<>();

        for (JSONObject page : pageList) {
            List<JSONObject> components = page.getBeanList("components", JSONObject.class);
            if (components != null) {
                for (JSONObject component : components) {
                    JSONObject dataSource = component.getJSONObject("dataSource");
                    if (dataSource != null && "dataSearch".equalsIgnoreCase(dataSource.getStr("type"))) {
                        String dataSearch = dataSource.getJSONObject("options").getStr("dataSearch");
                        if (StringUtils.isNotBlank(dataSearch)) {
                            dataQueryIds.add(dataSearch);
                        }
                    }
                }
            }
            List<JSONObject> dataSources = page.getBeanList("dataSources", JSONObject.class);
            if (dataSources != null) {
                for (JSONObject dataSource : dataSources) {
                    JSONObject options = dataSource.getJSONObject("options");
                    if (options != null) {
                        String dataSearch = options.getStr("dataSearch");
                        if (StringUtils.isNotBlank(dataSearch)) {
                            dataQueryIds.add(dataSearch);
                        }
                    }
                }
            }
            //////////////////////////////////////////////////////////
            JSONObject options = page.getJSONObject("options");
            if (options != null) {
                String backgroundImage = options.getStr("backgroundImage");
                if (StringUtils.isNotBlank(backgroundImage)) {
                    if (!backgroundImage.startsWith("/")) {
                        backgroundImage = "/" + backgroundImage;
                    }
                    backgroundImage = backgroundImage.replace(wwwRelativePath, "");
                    options.set("backgroundImage", backgroundImage);
                }

                String faviconIocImage = options.getStr("faviconIocImage");
                if (StringUtils.isNotBlank(faviconIocImage)) {
                    if (!faviconIocImage.startsWith("/")){
                        faviconIocImage = "/" + faviconIocImage;
                    }
                    faviconIocImage = faviconIocImage.replace(wwwRelativePath, "");
                    options.set("faviconIocImage", faviconIocImage);
                }

                String envGlobalOptions = options.getStr("ENVGlobalOptions");
                HashMap envGlobalOptionMap = JsonUtils.jsonToMap(envGlobalOptions);
                if (envGlobalOptionMap != null) {
                    mergedOption.putAll(envGlobalOptionMap);
                }
            }

            if (!CollectionUtils.isEmpty(components)) {
                for (JSONObject component : components) {
                    String type = component.getStr("type");
                    if (!"PageLink".equalsIgnoreCase(type)) {
                        JSONObject componentOption = component.getJSONObject("options");
                        if (componentOption != null) {
                            String beforeImagePath = componentOption.getStr("image");
                            String image = beforeImagePath;
                            if (image != null) {
                                if (!image.startsWith("/")) {
                                    image = "/" + image;
                                }
                                image = image.replace(wwwRelativePath, "");
                                componentOption.set("image", image);
                            }

                            if (Objects.equals(component.getStr("source"), "componentGroup")) {
                                FileUtil.copy(portalWebPath + beforeImagePath, targetAppPath + "/" + image, true);
                            }
                        }
                        Path sourceComponentPath = Paths.get(componentPath, type, component.getStr("version"), "release");
                        Path targetComponentPath = Paths.get(targetAppPath.toString(), "components", type, component.getStr("version"), "release");
                        FileUtils.copyFolderWithDepth(sourceComponentPath.normalize().toString(), null, targetComponentPath.normalize().toString(), null);
                    }
                }
            }
        }
        return new JSONObject().set("mergedOption", mergedOption).set("dataQueryIds", dataQueryIds);
    }

    /**
     * 导出大屏源码
     *
     * @param requests
     * @param response
     * @param applicationId
     */
    @GetMapping("/exportSource")
    public void exportSource(HttpServletRequest requests, HttpServletResponse response, @RequestParam String applicationId) {
        String appSourceTplPath = lcap_www_path + "/application_source_template";
        String appTplPath = lcap_www_path + "/application_tpl";
        String sourceCommonPath = lcap_www_path + "/common";
        String sourcePath = lcap_www_path + "/application_build/" + applicationId + "_source";
        String appPath = lcap_www_path + "/applications/" + applicationId;
        String configPath = sourcePath + "/public/config";
        FileUtils.copyFolderWithDepth(appSourceTplPath, null, sourcePath, null);

        // 获取变量相关信息
        LambdaQueryWrapper<AppVar> appVarWrapper = new LambdaQueryWrapper<>();
        List<AppVar> appVars = iAppVarService.getBaseMapper().selectList(appVarWrapper);
        ArrayList<AppVarListResVo> appVarListResVos = new ArrayList<>();
        appVars.forEach(var -> {
            AppVarListResVo appVarListResVo = structUtil.convertAppVarRespVo(var);
            appVarListResVos.add(appVarListResVo);
        });

        Application application = iApplicationService.getById(applicationId);
        String pages = application.getPages();

        HashMap<String, Object> envConf = new HashMap<>();
        envConf.put("pages", JsonUtils.parseArray(pages, JSONObject.class));
        envConf.put("variables", appVarListResVos);
        FileUtils.writeJson(configPath, "env.conf.json", envConf);

        JSONObject componentEntry = new JSONObject();
        JSONObject compDependencies = new JSONObject();
        JSONObject mergedGlobalOptions = new JSONObject();
        List<JSONObject> pageList = JsonUtils.parseArray(pages, JSONObject.class);
        for (JSONObject page : pageList) {
            List<JSONObject> components = page.getBeanList("components", JSONObject.class);

            if (page.containsKey("ENVGlobalOptions")) {
                mergedGlobalOptions.putAll(page.getBean("ENVGlobalOptions", JSONObject.class));
            }
            if (!CollectionUtils.isEmpty(components)) {
                for (JSONObject component : components) {
                    String componentId = component.getStr("type");
                    if (!"pageLink".equalsIgnoreCase(componentId)) {
                        log.info("componentId:{}", componentId);
                        String version = component.getStr("version");
                        String componentSrcPath = lcap_www_path + "/components/" + componentId + "/" + version + "/src";

                        JSONObject componentOption = component.getJSONObject("options");
                        if (componentOption != null) {
                            String beforeImagePath;
                            String image = beforeImagePath = componentOption.getStr("image");
                            if (image != null) {
                                image = image.replace(wwwRelativePath + "/", "");
                                componentOption.set("image", image);
                            }

                            if (Objects.equals(component.getStr("source"), "componentGroup")) {
                                FileUtil.copy(portalWebPath + beforeImagePath, sourcePath + "/" + image, true);
                            }
                        }

                        if (new File(componentSrcPath).exists()) {
                            FileUtils.copyFolder(componentSrcPath, null, sourcePath + "/src/components/" + componentId + "/" + version);
                        } else {
                            FileUtils.copyFolder(lcap_www_path + "/components/" + componentId + "/v-current/src", null, sourcePath + "/src/components/" + componentId + "/" + version);
                            FileUtils.autoReplace(sourcePath + "/src/components/" + componentId + "/" + version + "/src/main.js", "v-current", version);
                            FileUtils.autoReplace(sourcePath + "/src/components/" + componentId + "/" + version + "/src/setting.js", "v-current", version);
                        }

                        String packagePath = lcap_www_path + "/components/" + componentId + "/" + version + "/package.json";
                        if (!new File(packagePath).exists()) {
                            packagePath = lcap_www_path + "/components/" + componentId + "/" + "/v-current/package.json";
                        }
                        String packageJson = FileUtils.readJson(packagePath);
                        JSONObject jsonObject1 = new JSONObject(packageJson);
                        if (jsonObject1.containsKey("devDependencies")) {
                            compDependencies.putAll(jsonObject1.getBean("devDependencies", JSONObject.class));
                        }
                        if (jsonObject1.containsKey("dependencies")) {
                            compDependencies.putAll(jsonObject1.getBean("dependencies", JSONObject.class));
                        }

                        componentEntry.put(componentId + "/" + version + "/release/main", "./src/components/" + componentId + "/" + version + "/src/main.js");
                    }
                }
            }

        }

        env_production_js = env_production_js.replace("${globalOptions}", mergedGlobalOptions.toString());
        FileUtils.writeStr(configPath, "env.production.js", env_production_js);

        FileUtil.copy(appTplPath + "/index.html", sourcePath + "/public/index.html", true);
        FileUtil.copy(sourceCommonPath + "/data-vi.js", sourcePath + "/public/public/data-vi.js", true);

        FileUtils.copyFolder(appPath, null, sourcePath + "/applications/");
        String templatePackage = FileUtils.readJson(sourcePath + "/package.json");
        JSONObject dependencies = new JSONObject(templatePackage);
        if (dependencies.containsKey("dependencies")) {
            JSONObject dependencies1 = dependencies.getBean("dependencies", JSONObject.class);
            compDependencies.putAll(dependencies1);
        }
        dependencies.put("dependencies", compDependencies);
        FileUtils.writeStr(sourcePath, "package.json", dependencies.toString());

        FileUtils.autoReplace(sourcePath + "/webpack.config.dev.js", "entry: {}", "entry: " + componentEntry.toString());
        FileUtils.autoReplace(sourcePath + "/webpack.config.build.js", "entry: {}", "entry: " + componentEntry.toString());

        // 打包临时文件夹A
        log.info("temp file path is {}.", sourcePath);
        File zipFile = ZipUtil.zip(sourcePath);

        // 下载压缩包A.zip
        response.reset();
        response.setContentType("application/octet-stream;charset=utf-8");
        String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
        response.setContentLength((int) zipFile.length());

        log.info("Start downloading the compressed package, and file name is {}, and size is {}", downFileName, new File(downFileName).length());

        ExportResourceResponse result = new ExportResourceResponse();
        try {
            long st = System.currentTimeMillis();
            InputStream inStream = Files.newInputStream(zipFile.toPath());
            byte[] b = new byte[1024];
            int len;
            while ((len = inStream.read(b)) > 0) {
                response.getOutputStream().write(b, 0, len);
            }
            inStream.close();
            log.info("Compressed package download complete. and cost time is {}.", (System.currentTimeMillis() - st));
            result.setName(downFileName);
            result.setSize(new File(downFileName).length());
        } catch (IOException e) {
            log.error("文件导出失败,folder:{},zipFile:{}", sourcePath, zipFile);
            throw new BizException("文件导出失败");
        } finally {
            FileUtil.del(zipFile);
            FileUtil.del(sourcePath);
        }
    }

    String env_production_js = "window.DATAVI_ENV = (function() {\n" + "    const apiDomain = '';\n" + "\n" + "    return {\n" + "        debug: true,\n" + "        apiDomain,\n" + "        componentApiDomain: '',\n" + "        uploadImgDir: '',\n" + "        componentsDir: '/components',\n" + "        apiSuccessCode: 200,\n" + "        globalOptions: ${globalOptions},\n" + "\n" + "        screenAPI: {\n" + "            // 大屏展示和编辑用到的API\n" + "            getScreenData: '/applications', // 获取大屏数据\n" + "            saveScreenConf: '/applications/{id}/design', // 保存大屏配置\n" + "            uploadScreenImg: '/applications/img/{id}', // 上传大屏所需图片\n" + "            deleteUploadScreenImg: '/applications/img/{id}', // 删除上传的大屏所需图片\n" + "            getModelList: '/applications/getModelList', // 获取模型列表\n" + "            getModelData: '/applications/getModelData', // 获取模型数据\n" + "            getScreenComponentList: '/applications/components/list',\n" + "        },\n" + "    };\n" + "})();\n";

    /**
     * 手动【一键截图】功能：截图后立马保存替换大屏封面图
     * 上传大屏封面预览图
     *
     * @param appId 大屏id
     * @param file  封面图文件
     */
    @PostMapping("/uploadAppCoverPic/{appId}")
    public String uploadAppCoverPic(@PathVariable String appId, @RequestPart MultipartFile file) {
        String fileName = file.getOriginalFilename();
        String[] split = fileName.split("\\.");
        String coverName = "cover_"+ System.currentTimeMillis();
        //上传文件后更新大屏的封面图地址
        File file1 = new File(applicationPath + File.separator + appId);
        if (!file1.exists() && !file1.mkdirs()) {
            log.error("大屏封面图保存失败,保存路径创建失败");
            throw new BaseException("大屏封面图保存失败");
        }
        try {
            File dest = new File(applicationPath + File.separator + appId + File.separator + coverName + "." + split[split.length - 1]);
            file.transferTo(dest);
        } catch (IOException e) {
            log.error("大屏封面图保存失败，文件上传失败" + e.getMessage());
            throw new BaseException("大屏封面图保存失败");
        }finally {
            List<String> fileList = FileUtil.listFileNames(applicationPath + File.separator + appId);
            for(String filename: fileList) {
                // 将以cover_开头且不是本次上传的图片都删掉
                if (filename.startsWith("cover") && !filename.startsWith(coverName)) {
                    log.info("==============filename: {}", filename);
                    FileUtil.del(applicationPath + File.separator + appId + File.separator + filename);
                }
            }
        }
        String coverFilePath = wwwRelativePath + APPLICATIONS + File.separator + appId + File.separator + coverName + "." + split[split.length - 1];
        applicationMapper.updateCoverWithId(appId, coverFilePath);
        return coverFilePath;
    }

}
