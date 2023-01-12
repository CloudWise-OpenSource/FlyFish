package com.cloudwise.lcap.commonbase.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 数据源可用性校验返回数据
 *
 * @author zhaobo
 * @date 2022/2/17
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DatasourceStatus {
    /**
     * 是否可用
     */
    private Boolean available;
    /**
     * 消息
     */
    private String message;
}
