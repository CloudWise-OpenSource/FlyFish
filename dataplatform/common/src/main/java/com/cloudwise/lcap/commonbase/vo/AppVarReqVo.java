package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

/**
 * @author: june.yang
 * @create-date: 2022/11/7 2:23 PM
 */
@Data
public class AppVarReqVo {
    private String type;
    private String name;
    private String intro;
    private String appId;
    private String scope;
    private String pageId;
    private String valueType;
    private String defaultValue;
    private String path;
}
