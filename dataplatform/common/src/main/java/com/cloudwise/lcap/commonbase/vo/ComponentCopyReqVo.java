package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

import java.util.List;

@Data
public class ComponentCopyReqVo {
    private String name;
    private String type;
    private List<String> projects;
    private List<TagVo> tags;
    private String category;
    private String subCategory;
    private String desc;
    private String automaticCover;
    private String componentCover;
}
