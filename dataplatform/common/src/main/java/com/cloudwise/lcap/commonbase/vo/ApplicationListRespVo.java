package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author: june.yang
 * @create-date: 2022/8/10 3:55 PM
 */
@Data
public class ApplicationListRespVo {
    private String id;
    private String name;
    private String modelId;
    private String type;
    private String cover;

    private ProjectRespVo projects;
    private List<TagVo> tags;
    private String developStatus;
    private Boolean isLib;
    private Boolean isRecommend;
    private Long accountId;

    private String creator;
    private String updater;
    private Date createTime;
    private Date updateTime;
}
