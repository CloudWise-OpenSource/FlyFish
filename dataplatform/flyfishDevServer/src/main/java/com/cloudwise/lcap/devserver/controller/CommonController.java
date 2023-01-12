package com.cloudwise.lcap.devserver.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cloudwise.lcap.commonbase.contants.Constant;
import com.cloudwise.lcap.commonbase.entity.ComponentCategory;
import com.cloudwise.lcap.commonbase.service.IComponentCategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * 查看服务版本
 */
@Slf4j
@RestController
@RequestMapping("/system")
public class CommonController {
    @Autowired
    private IComponentCategoryService componentCategoryService;

    /**
     * 取代 actuator
     * @return
     */
    @GetMapping("/health")
    public Map<String,Object> healthStatus(){
        Map<String, Object> data = new HashMap<>();
        data.put("status","up");
        return data;
    }

    @GetMapping("/getVersion")
    public Map<String,Object> getVersion(){
        Properties properties = new Properties();
        try {
            InputStream resourceAsStream = CommonController.class.getResourceAsStream("/git.properties");
            if (null != resourceAsStream){
                properties.load(resourceAsStream);
            }
        } catch (IOException e) {
            log.error("读取git.properties文件失败");
        }
        String version = properties.getProperty("git.build.version");
        String hash = properties.getProperty("git.commit.id.abbrev");

        Map<String, Object> data = new HashMap<>();
        data.put("serverName","lcapServer");
        data.put("version","v" + version);
        data.put("hash",hash);
        return data;
    }
}
