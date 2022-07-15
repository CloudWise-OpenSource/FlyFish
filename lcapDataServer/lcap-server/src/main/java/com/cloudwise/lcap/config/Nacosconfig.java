package com.cloudwise.lcap.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class Nacosconfig {

    private String cwNacosServer;

    private String cwNacosUserName;

    private String cwNacosPassword;

    private String cwNacosNamespace;

    private String cwlcapServerIp;

    private Integer cwlcapServerPort;
}
