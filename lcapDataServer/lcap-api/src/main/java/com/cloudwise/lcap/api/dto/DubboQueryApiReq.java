package com.cloudwise.lcap.api.dto;

import com.cloudwise.lcap.api.enums.HttpMethod;
import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * dubbo接口调通同步api信息到lcap
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DubboQueryApiReq implements Serializable {
    private String apiId;
    /**
     * 接口名称
     */
    private String apiName;

    /**
     * 租户id
     */
    private String accountId;
    private String userId;

    /**
     * 内部产品的产品id，如“douc”（相同 sourceAppId的接口会分到同一组）
     */
    private String sourceAppId;
    /**
     * 接口分类，相同分类下的接口会在同一个分类下，如果未设置，则统一放到【为分类】下
     */
    private String catalogName;
    /**
     * http请求的路径部分（不包含域名部分）
     */
    private String path;
    /**
     * http请求类型, {@link HttpMethod}
     */
    private String method;
    /**
     * 接口状态，1-上线 0-下线。
     */
    private Integer status;
    /**
     * 分页参数，当前页码
     */
    private Integer pageNo;
    /**
     * 分页参数，每条条数
     */
    private Integer pageSize;
}
