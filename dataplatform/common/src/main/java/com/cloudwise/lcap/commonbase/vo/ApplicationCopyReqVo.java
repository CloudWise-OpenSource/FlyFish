package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import java.util.List;

@Data
public class ApplicationCopyReqVo {
    private String name;
    private List<TagVo> tags;
    private String projectId;
}
