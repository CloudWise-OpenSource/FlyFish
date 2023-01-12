package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author: june.yang
 * @create-date: 2022/11/4 3:51 PM
 */
@Data
public class AppVarListReqVo {
    @NotBlank
    private String appId;

    private String varId;
    private String pageId;
    private String name;
}
