package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

@Data
public class ComponentGitHistoryVo {

    private String hash;

    private String message;

    private Long time;
}
