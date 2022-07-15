package com.cloudwise.lcap.dataplateform.core.processor;

import com.cloudwise.lcap.dataplateform.core.model.ExecuteBean;

/**
 * 数据处理适配器，T 待处理的数据类型；R 处理后的数据类型
 *
 * @author zhaobo
 * @date 2022/1/13
 */
@FunctionalInterface
public interface ProcessorService<T, R> {

    /**
     * 数据处理步骤适配器
     * @param t 原始数据
     * @param params 数据处理参数，
     * @return
     */
    R handle(T t, ExecuteBean params);
}
