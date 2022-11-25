package com.cloudwise.lcap.source.service.dto;

import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import lombok.*;

import java.io.Serializable;
import java.util.List;

/**
 * 应用、组件导入时的原始信息（前端传参）
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResourceImportRequest implements Serializable {

    private String key;
    private String importType;
    private String applicationType;
    private List<ApplicationDto> applications;
    private List<ComponentDto> components;
}
