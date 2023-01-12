package com.cloudwise.lcap;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;

@SpringBootApplication(scanBasePackages = {"com.cloudwise.lcap.commonbase","com.cloudwise.lcap"},exclude = MongoAutoConfiguration.class)
@MapperScan(basePackages = {"com.cloudwise.lcap.commonbase.mapper"})
public class LcapServer {

    public static void main(String[] args) {

        SpringApplication application = new SpringApplication(LcapServer.class);
        application.run();

    }
}
