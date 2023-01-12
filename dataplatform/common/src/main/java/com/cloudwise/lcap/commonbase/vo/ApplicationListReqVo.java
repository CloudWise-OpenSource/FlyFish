package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import java.util.List;

/**
 * @author: june.yang
 * @create-date: 2022/8/10 3:55 PM
 */
@Data
public class ApplicationListReqVo extends PageBaseListReqVo{
    private String name;
    private String type;
    private String projectId;
    private List<String> tags;
    private String developStatus;
    private Boolean isLib;
    private Boolean isRecommend;
    private List<String> trades;
    private Integer deleted;
}
