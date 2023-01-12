package com.cloudwise.lcap.commonbase.vo;


import lombok.Data;

import java.util.List;

@Data
public class MetricsReqVo {
    private Object key;
    private String name;
    private Object unit;
    private String componentId;
    private Object dataSource;
    private ComponentLocationReqVo location;
}
