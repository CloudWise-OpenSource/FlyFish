package com.cloudwise.lcap.devserver;

import com.cloudwise.lcap.commonbase.util.SpringContentUtil;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.cloudwise.lcap.commonbase","com.cloudwise.lcap.devserver"})
@MapperScan(basePackages = {"com.cloudwise.lcap.commonbase.mapper"})
public class LcapDevServer {
    public static void main(String[] args) {

        SpringApplication application = new SpringApplication(LcapDevServer.class);
        application.addInitializers(new SpringContentUtil());
        application.run(args);
    }
}
