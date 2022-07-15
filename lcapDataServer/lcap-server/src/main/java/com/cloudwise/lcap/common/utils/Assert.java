package com.cloudwise.lcap.common.utils;

import com.cloudwise.lcap.common.exception.BaseException;
import com.cloudwise.lcap.common.exception.BizException;
import org.apache.commons.collections4.MapUtils;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Map;

/**
 * 数据校验
 * @Author chance.zeng
 * @Date 2022/2/9 上午10:44
 * @Version 1.0
 */
public abstract class Assert {

    /**
     * 判断字符串str是否为空，为空抛出message异常信息
     * @param str
     * @param message
     */
    public static void isBlank(String str, String message) {
        if (StringUtils.isEmpty(str)) {
            throw new BizException(message);
        }
    }

    /**
     * 判断对象obj是否为空，为空抛message出异常信息
     * @param obj
     * @param message
     */
    public static void isNull(Object obj, String message) {
        if (obj == null) {
            throw new BizException(message);
        }
    }

    public static void notEmptyList(List<?> list, String message) {
        if (null == list || list.isEmpty()) {
            throw new BaseException(message);
        }
    }

    public static void notEmptyMap(Map<?, ?> map, String message) {
        if (MapUtils.isEmpty(map)) {
            throw new BaseException(message);
        }
    }

    /**
     * 输入条件必须成立
     *
     * @param condition
     * @param message
     */
    public static void assertTrue(boolean condition, String message) {
        if (!condition) {
            throw new BaseException(message);
        }
    }

    /**
     * 输入条件不成立
     *
     * @param condition
     * @param message
     */
    public static void assertFalse(boolean condition, String message) {
        if (condition) {
            throw new BaseException(message);
        }
    }

    /**
     * 输入数值是否与期望值相同
     *
     * @param actual
     * @param expected
     * @param message
     */
    public static void assertEquals(int actual, int expected, String message) {
        assertTrue(actual == expected, message);
    }

    /**
     * 输入值是否在between范围
     *
     * @param actual
     * @param begin
     * @param end
     * @param message
     */
    public static void assertBetween(int actual, int begin, int end, String message) {
        assertTrue(actual >= begin && actual <= end, message);
    }

}
