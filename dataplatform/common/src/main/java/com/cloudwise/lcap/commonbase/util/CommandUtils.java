package com.cloudwise.lcap.commonbase.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.io.*;

@Slf4j
public class CommandUtils {
    public static void exec(String command) {
        if (StringUtils.isEmpty(command)){
            log.error("command is required!!!");
        }

        try {
            String[] arrCommand = {"sh", "-c", command};
            int i = Runtime.getRuntime().exec(arrCommand).waitFor();
            System.out.println(i);
        } catch (Exception e) {
            log.error("Exec command fail, and command is =={}==, and fail msg is {}", command, e.getMessage() , e);
            throw new RuntimeException(e);
        }
    }
}
