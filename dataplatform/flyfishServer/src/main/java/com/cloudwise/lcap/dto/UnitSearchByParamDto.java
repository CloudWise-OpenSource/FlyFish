package com.cloudwise.lcap.dto;

import lombok.*;

import java.util.Map;

/**
 * 带参请求结构体
 * @author adam
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UnitSearchByParamDto {

    private String sql;
    private String id;
    private Map<String,String> params;

}

