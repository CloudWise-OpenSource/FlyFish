package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author: june.yang
 * @create-date: 2022/8/10 3:55 PM
 */
@Data
public class ApplicationDetailRespVo {
    private String id;
    private String name;
    private String modelId;
    private String type;
    private String cover;

    private ProjectRespVo projectInfo;
    private List<TagVo> tags;
    private Object pages;
    private List<AppVarListResVo> variables;
    private String developStatus;
    private Boolean isLib;
    private Boolean isRecommend;
    private Long accountId;
    //0-取消分享 1-分享
    private Integer shareStatus;
    private String creator;
    private String updater;
    private Date createTime;
    private Date updateTime;
}
