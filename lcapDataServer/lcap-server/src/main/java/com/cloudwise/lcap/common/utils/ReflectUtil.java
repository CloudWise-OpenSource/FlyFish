package com.cloudwise.lcap.common.utils;


import cn.hutool.core.util.ClassLoaderUtil;

import java.lang.reflect.InvocationTargetException;

/**
 * 反射工具
 *
 * @author zhaobo
 * @date 2022/2/23
 */
public class ReflectUtil {
    /**
     * 调用目标方法
     *
     * @param className  类路径
     * @param methodName 方法名称
     * @param args       方法参数
     * @return
     * @throws ClassNotFoundException
     * @throws NoSuchMethodException
     * @throws InvocationTargetException
     * @throws IllegalAccessException
     */
    public static Object invokeTargetMethod(String className, String methodName, Object... args) throws ClassNotFoundException, NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Class<?> clazz = ClassLoaderUtil.loadClass(className);
        return cn.hutool.core.util.ReflectUtil.invoke(clazz, methodName, args);
    }
}
