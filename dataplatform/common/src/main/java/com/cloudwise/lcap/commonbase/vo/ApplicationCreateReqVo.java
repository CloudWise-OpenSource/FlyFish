package com.cloudwise.lcap.commonbase.vo;


import lombok.Data;

import java.util.List;

@Data
public class ApplicationCreateReqVo {
    private String name;
    private String type;
    private List<TagVo> tags;
    private String projectId;
}
