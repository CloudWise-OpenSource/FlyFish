package com.cloudwise.lcap;

import com.cloudwise.lcap.common.utils.SpringContentUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@RefreshScope
//@EnableCacheLettuceFactories
@SpringBootApplication
public class LcapDataServer {

    public static void main(String[] args) {

        SpringApplication application = new SpringApplication(LcapDataServer.class);
        //application.addListeners(new ConfigListener());
        application.addInitializers(new SpringContentUtil());
        application.run(args);
    }
}
