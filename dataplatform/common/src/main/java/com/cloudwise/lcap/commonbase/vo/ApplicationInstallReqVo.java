package com.cloudwise.lcap.commonbase.vo;


import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
public class ApplicationInstallReqVo {
    private Long accountId;
    private Long userId;

    private String name;
    private String modelId;
    private String type;
    private Boolean isLib;
    private Boolean isMonitor;
    private Number width;
    private Number height;
    private Object models;
    private List<MetricsReqVo> metrics;
}
