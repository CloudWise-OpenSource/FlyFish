package com.cloudwise.lcap.api.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class RequestFieldEntity implements Serializable {
    /**
     * 字段名
     */
    private String name;
    /**
     * 字段类型,String、Int、Double、Boolean
     */
    private String type;
    /**
     * 是否必须 0-非必须 1-必须
     */
    private Integer required;
    /**
     * 默认值
     */
    private String defaultValue;
}
