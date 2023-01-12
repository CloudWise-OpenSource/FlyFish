package com.cloudwise.lcap.commonbase.vo;


import lombok.Data;

import java.util.List;
@Data
public class ApplicationBasicInfoReqVo {
    private String name;
    private String type;
    private List<TagVo> tags;
    private String projectId;
    private String developStatus;
    private Boolean isRecommend;
    private Integer deleted;
}
