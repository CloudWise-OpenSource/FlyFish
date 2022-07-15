package com.cloudwise.lcap.common.utils;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
public class ValidatorUtils {
    /**
     * 变量定义规则
     * 校验变量是否是下划线、字母、数字组合而成
     */
    static Pattern pattern = Pattern.compile("^[_a-zA-Z0-9]+$");
    static Pattern numPattern = Pattern.compile("[0-9]{1,}");

    static String illegal = "`()~!#%^&*=+\\|{};'\",<>/?○●★☆☉♀♂※¤╬の〆";

    /**
     * 数据库名称，表名称，字段名称校验规则
     * @param var
     * @return
     */
    public static boolean varValidate(String var) {
        if (StringUtils.isEmpty(var)) {
            return true;
        }
        if (var.matches("[0-9]+")) {
            //纯数字
            return false;
        }
        if (var.trim().contains(" ")){
            //包含空格
            return false;
        }
        Matcher matcher = pattern.matcher(var);
        return matcher.find();
    }

    /**
     * name字段校验规则
     * @param var
     * @return
     */


    /**
     * 验证字符串内容是否包含下列非法字符
     * <p>
     * `~!#%^&*=+\\|{};:'\",<>/?○●★☆☉♀♂※¤╬の〆
     *
     * @param content 字符串内容
     * @return 't'代表不包含非法字符，otherwise代表包含非法字符。
     */
    public static boolean validateLegalString(String content) {
        if (StringUtils.isEmpty(content)) {
            return true;
        }
        boolean valid = true;
        for (int i = 0; i < content.length(); i++) {
            for (int j = 0; j < illegal.length(); j++) {
                if (content.charAt(i) == illegal.charAt(j)) {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    }


}
