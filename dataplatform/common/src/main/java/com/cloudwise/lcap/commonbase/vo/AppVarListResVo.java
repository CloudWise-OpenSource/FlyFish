package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

/**
 * @author: june.yang
 * @create-date: 2022/11/4 3:51 PM
 */
@Data
public class AppVarListResVo {
    private String id;
    private String type;
    private String scope;
    private String name;
    private String intro;
    private String pageId;
    private String valueType;
    private String defaultValue;
    private String path;
}
