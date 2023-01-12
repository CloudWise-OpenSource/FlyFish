package com.cloudwise.lcap.commonbase.vo;

import java.util.Date;
import java.util.List;

import com.cloudwise.lcap.commonbase.entity.Project;
import lombok.Data;

@Data
public class ProjectRespVo {
    private String id;
    private String name;
    private String desc;
    private Long creator;
    private Long updater;
    private String creatorName;
    private Long accountId;
    private Date createTime;
    private Date updateTime;

    private List<TradeVo> trades;
}
