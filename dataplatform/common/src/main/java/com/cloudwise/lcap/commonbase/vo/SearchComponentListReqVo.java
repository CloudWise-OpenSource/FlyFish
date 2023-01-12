package com.cloudwise.lcap.commonbase.vo;

import lombok.Data;

@Data
public class SearchComponentListReqVo extends PageBaseListRespVo {
    private String term;

    private String id;
}
