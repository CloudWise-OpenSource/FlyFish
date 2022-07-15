package com.cloudwise.lcap.api.dto;

import com.cloudwise.lcap.api.enums.HttpMethod;
import com.cloudwise.lcap.api.enums.BodyType;
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
public class DubboAsyncApiResp implements Serializable {
    private String apiId;
    /**
     * 接口名称
     */
    private String apiName;
    /**
     * 租户id
     */
    private String accountId;
    /**
     * 用户id
     */
    private String userId;
    /**
     * 标签
     */
    private List<String> tag;
    /**
     * 接口来源类型，0-内部接口 1-外部接口。
     * 此处统一为0。
     */
    private Integer sourceType = 0;
    /**
     * 内部产品的产品名称，如"douc"或"用户中心"。作为分组名称
     */
    private String sourceAppName;
    /**
     * 内部产品的产品id，如“douc”（相同 sourceAppId的接口会分到同一组），作为分组id
     */
    private String sourceAppId;
    /**
     * 接口分类id
     */
    private String catalogId;
    /**
     * 接口分类，相同分类下的接口会在同一个分类下，如果未设置，则统一放到【为分类】下
     */
    private String catalogName;
    /**
     * http请求的路径部分（不包含域名部分）
     */
    private String path;
    /**
     * http请求类型
     */
    private HttpMethod method;
    /**
     * http请求头
     */
    private List<RequestFieldEntity> reqHeaders;
    /**
     * http请求参数
     */
    private List<RequestFieldEntity> reqParams;
    /**
     * http请求体
     */
    private String reqBody;
    /**
     * http请求方式，method=post时必传。
     * 支持raw="text/plain"  jsonschema="application/json"两种方式（暂不支持"multipart/form-data" 方式）。
     */
    private BodyType reqBodyType;
    /**
     * 返回数据样例类型
     */
    private String resBody;
}
