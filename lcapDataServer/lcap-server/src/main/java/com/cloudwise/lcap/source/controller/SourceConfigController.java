package com.cloudwise.lcap.source.controller;

import cn.hutool.core.util.ZipUtil;
import com.cloudwise.lcap.common.BaseResponse;
import com.cloudwise.lcap.common.contants.Constant;
import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.utils.Assert;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.cloudwise.lcap.source.dto.ApplicationViewDto;
import com.cloudwise.lcap.source.dto.ComponentViewDto;
import com.cloudwise.lcap.source.dto.ResourceImportResult;
import com.cloudwise.lcap.source.model.Application;
import com.cloudwise.lcap.source.request.ApplicationExportRequest;
import com.cloudwise.lcap.source.request.ComponentExportRequest;
import com.cloudwise.lcap.source.request.ResourceImportRequest;
import com.cloudwise.lcap.source.response.ExportResourceResponse;
import com.cloudwise.lcap.source.response.ImportResourceResponse;
import com.cloudwise.lcap.source.response.ResourceFileResponse;
import com.cloudwise.lcap.source.service.SourceConfigService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 组件/应用导入导出
 */
@Slf4j
@RequestMapping("/resources")
@RestController
public class SourceConfigController {


    @Autowired
    private SourceConfigService sourceConfigService;
    @Value("${component_down_tmp_basepath}")
    private String down_tmp_basepath;
    /**
     * 导出组件
     *
     * @param response
     * @param request: {
     *         "componentIds": ["61b0595c27668b16b44fd858", "61b08520e99031169fa33059", "61b082ecf7580b16bb15a5ed"], // 组件id
     *         "componentExportType": [""] // 导出类型 componentSource  componentRelease  componentNodeModules
     * }
     */
    @PostMapping("/export/components")
    public BaseResponse<ExportResourceResponse> exportComponents(HttpServletRequest requests, HttpServletResponse response, @RequestBody ComponentExportRequest request) {
        String folder = down_tmp_basepath + File.separator + "组件-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return sourceConfigService.exportComponents(requests, response, request, folder, 2);
    }

    /**
     * 导出应用
     *  request: {
     *   "applicationIds": ['111', '222'. ''333],     // 应用id
     *   "applicationExportType": "appOnly"           // appOnly appComponentOnly appAndComponent
     *   "componentExportType": ["componentSource"]    // componentSource componentRelease componentNodeModules
     *  }
     *
     *
     */
    @PostMapping("/export/applications")
    public BaseResponse<ExportResourceResponse> exportApplications(HttpServletRequest requests, HttpServletResponse response, @RequestBody ApplicationExportRequest request) {

        return sourceConfigService.exportApplications(requests, response, request);
    }

    /**
     * 校验文件是否存在
     *
     */
    @GetMapping("/check")
    public BaseResponse<ResourceFileResponse> checkFileExists(){
        return sourceConfigService.checkFileExists();
    }



    /**
     * 上传zip文件
     */
    @PostMapping("/upload")
    public BaseResponse<String> uploadFile(@RequestPart MultipartFile file) {

        return sourceConfigService.importSourceConfig(file);

    }

    /**
     * 解析配置文件config_file, 返回给前端展示列表
     */
    @GetMapping("/parse/config")
    public BaseResponse<ImportResourceResponse> parseConfigFile(@RequestParam(value = "key") String key) {

        return sourceConfigService.parseConfigFile(key);

    }

    /**
     * 数据导入：应用和组件
     */
    @PostMapping("/import")
    public BaseResponse<ResourceImportResult> importResources(@RequestBody ResourceImportRequest request){
        String importType = request.getImportType();
        String key = request.getKey();
        List<ComponentViewDto > componentViewDtoList = request.getComponents();
        List<ApplicationViewDto > applications = request.getApplications();
        log.info("importResources: request is {}.", JsonUtils.toJSONString(request));
        if (Constant.APPLICATION.equalsIgnoreCase(importType) && CollectionUtils.isEmpty(applications)){
            log.error("导入应用时应用列表不能为空");
            throw new BaseException("导入应用时应用列表不能为空");
        }else if (Constant.COMPONENT.equalsIgnoreCase(importType) && CollectionUtils.isEmpty(componentViewDtoList)){
            log.error("导入组件时组件列表不能为空");
            throw new BaseException("导入组件时组件列表不能为空");
        }
        return sourceConfigService.importResources(importType,key,componentViewDtoList,applications);
    }

    @GetMapping("/check/version")
    public BaseResponse<Boolean> checkVersion(@RequestParam("id") String id, @RequestParam("version") String version){
        return sourceConfigService.checkVersion(id, version);
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
        ExportResourceResponse result = new ExportResourceResponse();
        result.setName(downFileName);
        result.setSize(new File(downFileName).length());
        return BaseResponse.success(result);
    }

}
