package com.cloudwise.lcap.commonbase.threadlocal;


import org.apache.commons.lang3.StringUtils;

import java.util.Map;

import static com.cloudwise.lcap.commonbase.contants.Constant.ACCOUNT_ID;
import static com.cloudwise.lcap.commonbase.contants.Constant.USER_ID;

/**
 * 统一管理ThreadLocal
 */
public class ThreadLocalContext {

    //    private static final ThreadLocal<Map<String, String>> LOCAL = InheritableThreadLocal.withInitial(HashMap::new);
    private static final ThreadLocal<Map<String, String>> LOCAL = new InheritableThreadLocal<>();

    /**
     * 获取creator
     */
    public static Long getUserId() {
        Map<String, String> map = LOCAL.get();
        if (map != null) {
            String s = LOCAL.get().get(USER_ID);
            if (StringUtils.isNotBlank(s)) {
                return Long.valueOf(s);
            }
        }
        return null;
    }

    /**
     * 获取accountId
     */
    public static Long getAccountId() {
        Map<String, String> map = LOCAL.get();
        if (map != null) {
            String s = LOCAL.get().get(ACCOUNT_ID);
            if (StringUtils.isNotBlank(s)) {
                return Long.valueOf(s);
            }
        }
        return null;
    }

    public static boolean contain(String key) {
        return LOCAL.get().containsKey(key);
    }

    public static String get(String name) {
        Map<String, String> map = LOCAL.get();
        if (map != null) {
            String s = LOCAL.get().get(name);
            if (StringUtils.isNotBlank(s)) {
                return s;
            }
        }
        return null;
    }

    /**
     * 设置Context
     */
    public static void setContext(Map<String, String> context) {
        LOCAL.remove();
        LOCAL.set(context);
    }


    /**
     * 清空(在finally里执行，防止线程污染-线程复用和溢出)
     */
    public static void remove() {
        LOCAL.remove();
    }

}