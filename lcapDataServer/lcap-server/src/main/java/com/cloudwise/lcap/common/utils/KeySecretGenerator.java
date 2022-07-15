package com.cloudwise.lcap.common.utils;

import lombok.extern.slf4j.Slf4j;

import java.util.UUID;

/**
 * @author yinqiqi
 */
@Slf4j
public class KeySecretGenerator {

    private final static String[] chars = new String[]{"a", "b", "c", "d", "e", "f",
            "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s",
            "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I",
            "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
            "W", "X", "Y", "Z"};

    //生成8位appKey
    public static String getAppKey() {
        StringBuilder shortBuffer = new StringBuilder();
        //获取用户id进行字符串截取
        String uuid = UUID.randomUUID().toString().replace("-", "");
        uuid += uuid;
        for (int i = 0; i < 12; i++) {
            String str = uuid.substring(i * 4, i * 4 + 4);
            int x = Integer.parseInt(str, 16);
            shortBuffer.append(chars[x % 0x3E]);
        }
        return shortBuffer.toString();
    }

    public static String getAppSecret() {
        StringBuilder shortBuffer = new StringBuilder();
        //获取用户id进行字符串截取
        String uuid = UUID.randomUUID().toString().replace("-", "");
        uuid += uuid;
        for (int i = 0; i <32; i++) {
            String str = uuid.substring(i, i + 4);
            int x = Integer.parseInt(str, 24);
            shortBuffer.append(chars[x % 0x3E]);
        }
        return shortBuffer.toString();
    }

    public static void main(String[] args) {
        String appKey = getAppKey();
        String appSecret = getAppSecret();
        log.info(appKey);
        log.info(appSecret);
    }


}
