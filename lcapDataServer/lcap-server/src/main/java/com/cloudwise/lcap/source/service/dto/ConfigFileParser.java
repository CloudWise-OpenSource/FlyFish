package com.cloudwise.lcap.source.service.dto;

import com.cloudwise.lcap.source.dto.ApplicationDto;
import com.cloudwise.lcap.source.dto.ComponentDto;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ConfigFileParser implements Serializable {

    // 导入类型  application/component
    private String type;

    private String applicationExportType;
    private List<String> componentExportType;

    private List<ApplicationDto> applications;
    private List<ComponentDto> components;
}
