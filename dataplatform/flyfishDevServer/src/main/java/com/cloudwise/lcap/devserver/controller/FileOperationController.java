package com.cloudwise.lcap.devserver.controller;

import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.util.Snowflake;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import static com.cloudwise.lcap.commonbase.contants.Constant.APPLICATIONS;
import static com.cloudwise.lcap.commonbase.contants.Constant.COMPONENTS;

@Slf4j
@RestController
@RequestMapping("/file")
public class FileOperationController {


    @Value("${lcap_www_path}")// /data/app/portalWeb/docp/lcapWeb/www/applicatons/xxxxxx
    private String lcap_www_path;

    @Value("${lcap_www_relative_path}")
    private String wwwRelativePath;

    /**
     * 临时上传文件大屏或组件的封面图
     *
     * @param destPath 组件或大屏id
     * @param file     文件名称
     * @param type     application or component
     */
    @PostMapping("/uploadFile")
    public String uploadCover(@RequestPart MultipartFile file,
                              @RequestParam(required = false) String destPath,
                              @RequestParam(required = false) String type) {
        String originalFilename = file.getOriginalFilename();
        String fileName = Snowflake.INSTANCE.nextId().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));

        String basePath = null;
        if ("application".equalsIgnoreCase(type)) {
            basePath = APPLICATIONS + File.separator + destPath + "/tmp/";
        } else if ("component".equalsIgnoreCase(type)) {
            basePath =  COMPONENTS + File.separator + destPath + "/tmp/";
        }

        // 如果临时目录不存在 则需要创建
        File file1 = new File(lcap_www_path + basePath);
        if (!file1.exists() && !file1.mkdirs()) {
            log.error("文件保存失败");
            throw new BizException("文件保存失败");
        }
        //指定文件临时存储位置
        try {
            file.transferTo(new File(lcap_www_path + basePath + File.separator + fileName));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return wwwRelativePath + basePath + File.separator + fileName;
    }

}
