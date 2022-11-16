package com.cloudwise.lcap.source.controller;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ZipUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cloudwise.lcap.common.BaseResponse;
import com.cloudwise.lcap.common.contants.Constant;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.utils.Assert;
import com.cloudwise.lcap.common.utils.FileUtils;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.source.dao.ApplicationDao;
import com.cloudwise.lcap.source.dao.ComponentDao;
import com.cloudwise.lcap.source.dao.ImportResultDao;
import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import com.cloudwise.lcap.source.model.Application;
import com.cloudwise.lcap.source.model.Component;
import com.cloudwise.lcap.source.model.ImportResult;
import com.cloudwise.lcap.source.model.Project;
import com.cloudwise.lcap.source.service.ConfigFileParseService;
import com.cloudwise.lcap.source.service.ExportResourceService;
import com.cloudwise.lcap.source.service.ImportResourceServer;
import com.cloudwise.lcap.source.service.dto.*;
import com.google.common.collect.HashMultiset;
import com.google.common.collect.Multiset;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.contants.Constant.*;

/**
 * 组件/应用导入导出
 */
@Slf4j
@RequestMapping("/resources")
@RestController
public class SourceConfigController {

    @Autowired
    private ImportResourceServer importResourceServer;
    @Autowired
    private ConfigFileParseService configFileParseService;
    @Value("${component_down_tmp_basepath}")
    private String down_tmp_basepath;
    @Autowired
    private ImportResultDao importResultDao;

    @Value("${component_upload_tmp_basepath}")
    private String upload_tmp_basepath;
    @Value("${config_filename}")
    private String config_filename;
    /**
     * 原始文件基础路径
     */
    @Value("${file.basepath}")
    private String fileBasepath;
    @Autowired
    private ExportResourceService exportResourceService;
    @Autowired
    private ComponentDao componentDao;
    @Autowired
    private ApplicationDao applicationDao;
    /**
     * 导出组件
     */
    @PostMapping("/export/components")
    public BaseResponse<ExportResult> exportComponents(HttpServletRequest requests, HttpServletResponse response, @RequestBody ComponentExportRequest request) {
        String folder = down_tmp_basepath + File.separator + COMPONENT + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        Manifest manifest = Manifest.builder().type(COMPONENT).time(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                        .componentExportType(Collections.singletonList(COMPILED_RELEASE_SOURCE)).build();
        exportResourceService.exportComponents(request.getIds(), folder,manifest);
        FileUtils.writeJson(folder, config_filename, new JSONObject(JsonUtils.toJSONString(manifest)));
        File zipFile = ZipUtil.zip(folder);

        //下载压缩包A.zip
        response.reset();
        response.setContentType("application/octet-stream;charset=utf-8");
        String downFileName = FileUtils.getFileName(requests.getHeader("user-agent"), zipFile.getName());
        log.error("file name is {}.", downFileName);
        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
        response.setContentLength((int) zipFile.length());

        try {
            InputStream inStream = Files.newInputStream(zipFile.toPath());
            byte[] b = new byte[1024];
            int len;
            while ((len = inStream.read(b)) > 0) {
                response.getOutputStream().write(b, 0, len);
            }
            inStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        ExportResult result = new ExportResult();
        result.setName(downFileName);
        result.setSize(new File(downFileName).length());
        return BaseResponse.success(result);
    }

    /**
     * 导出应用
     * request: {
     * "applicationIds": ['111', '222'. ''333],     // 应用id
     * "applicationExportType": "appOnly"           // appOnly appComponentOnly appAndComponent
     * "componentExportType": ["componentSource"]    // componentSource componentRelease componentNodeModules
     * }
     */
    @PostMapping("/export/applications")
    public ExportResult exportApplications(HttpServletRequest requests, HttpServletResponse response, @RequestBody ApplicationExportRequest request) {
        String folder = down_tmp_basepath + File.separator + APPLICATION + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        List<String> applicationIds = request.getIds();
        if (CollectionUtils.isEmpty(applicationIds)) {
            log.error("请先选择应用!");
            throw new BizException("请先选择应用!");
        }
        // 校验应用个数
        Assert.assertFalse(applicationIds.size() > 50, "应用和组件不得多于50个!");

        // 获取选择的应用信息
        List<Application> applications = applicationDao.findById(applicationIds);
        List<ApplicationDto> applicationDtoList = applications.stream().map(t -> {
            ApplicationDto dto = new ApplicationDto();
            dto.setId(t.getId().toHexString());
            BeanUtils.copyProperties(t, dto);
            return dto;
        }).collect(Collectors.toList());

        Set<String> componentIds = exportResourceService.getComponentIds(applicationDtoList);

        Manifest manifest = Manifest.builder().type(APPLICATION).time(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .applicationExportType(APP_AND_COMPONENT).componentExportType(Collections.singletonList(COMPILED_RELEASE_SOURCE))
                .applicationList(applicationDtoList).build();
       for (ApplicationDto app : applicationDtoList) {
            String applicationId = app.getId();
            // 应用cover基础路径 /applications/6209cd83ce4fee178aa18f77/*
            String appBasePath = fileBasepath + APPLICATIONS + File.separator + applicationId;
            log.info("appBasePath:{}",appBasePath);
            log.info("destFolder:{}",folder + APPLICATIONS);
            if (!new File(appBasePath).exists()) {
                continue;
            }
            FileUtils.copyFolder(appBasePath, null, folder + APPLICATIONS);
        }
        exportResourceService.exportComponents(componentIds, folder,manifest);

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

        try {
            InputStream inStream = Files.newInputStream(zipFile.toPath());
            byte[] b = new byte[1024];
            int len;
            while ((len = inStream.read(b)) > 0) {
                response.getOutputStream().write(b, 0, len);
            }
            inStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        ExportResult result = new ExportResult();
        result.setName(downFileName);
        result.setSize(new File(downFileName).length());
        return result;
    }

    /**
     * 校验文件是否存在
     */
    @GetMapping("/check")
    public FileExists checkFileExists() {
        // 先校验临时目录中是否存在文件
        File uploadTmpFilePath = new File(upload_tmp_basepath);
        log.info("upload file path is {}.", uploadTmpFilePath);
        FileExists response = new FileExists();
        if (!uploadTmpFilePath.exists()) {
            uploadTmpFilePath.mkdirs();
            return response;
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
        return response;
    }


    /**
     * 上传zip文件
     */
    @PostMapping("/upload")
    public BaseResponse<String> uploadFile(@RequestPart MultipartFile file) {
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

    /**
     * 解析配置文件config_file, 返回给前端展示列表
     */
    @GetMapping("/parse/config")
    public ConfigFileParser parseConfigFile(@RequestParam(value = "key") String key) {
        return configFileParseService.parseConfigFile(key);
    }

    /**
     * 数据导入：应用和组件
     */
    @PostMapping("/import")
    public ResourceImportResult importResources(@RequestBody ResourceImportRequest request) {
        String importType = request.getImportType();
        String key = request.getKey();
        ResourceImportResult result = new ResourceImportResult();
        String configFilePath = upload_tmp_basepath + File.separator + key + File.separator + config_filename;
        if (!new File(configFilePath).exists()) {
            log.error("导入的压缩包中配置文件不存在");
            throw new BaseException("文件包内容非应用或组件，请重新上传文件!");
        }
        Manifest manifest = JsonUtils.parse(FileUtils.readJson(configFilePath), Manifest.class);

        if (Constant.APPLICATION.equalsIgnoreCase(importType) && CollectionUtils.isNotEmpty(request.getApplications())) {
            importResourceServer.importApplications(key, manifest, request.getApplications(),result);
        } else if (COMPONENT.equalsIgnoreCase(importType) && CollectionUtils.isNotEmpty(request.getComponents())) {
            //导入组件
            List<ComponentDto> componentList = request.getComponents();
            Map<String,ObjectId> idMap = new HashMap<>();
            for (ComponentDto dto : componentList) {
                idMap.put(dto.getId(), ObjectId.get());
            }
            importResourceServer.importComponents(key, manifest, componentList,idMap, result);
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
        return result;
    }

    @GetMapping("/check/version")
    public BaseResponse<Boolean> checkVersion(@RequestParam("id") String id, @RequestParam("version") String version) {
        Assert.isBlank(id, "组件id不能为空!");
        Assert.isBlank(version, "组件版本不能为空!");
        boolean flag = false;
        List<Component> components = componentDao.findByIds(Collections.singletonList(id));
        if (CollectionUtils.isEmpty(components)) {
            return BaseResponse.success(flag);
        }

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
     * 数据导入：应用和组件
     */
    @GetMapping("/test/{id}")
    public BaseResponse<ResourceImportResult> export(HttpServletRequest request, HttpServletResponse response, @PathVariable("id") String id) {
        String folder = "/Users/edz/Documents/lcap/down_tmp_basepath/" + id;
        //打包临时文件夹A
        File zipFile = ZipUtil.zip(folder);

        //下载压缩包A.zip
        response.reset();
        response.setContentType("application/octet-stream;charset=utf-8");
        String downFileName = new String(zipFile.getName().getBytes(StandardCharsets.UTF_8));
        response.setHeader("Content-disposition", "attachment;filename=" + downFileName);
        response.setContentLength((int) zipFile.length());

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
        ExportResult result = new ExportResult();
        result.setName(downFileName);
        result.setSize(new File(downFileName).length());
        return BaseResponse.success(result);
    }

}
