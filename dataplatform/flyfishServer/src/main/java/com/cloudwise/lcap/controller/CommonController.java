package com.cloudwise.lcap.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * 获取服务版本号，基于 git commitI、打包构建时间 来生成服务包id
 */
@Slf4j
@RestController
@RequestMapping("/system")
public class CommonController {


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
