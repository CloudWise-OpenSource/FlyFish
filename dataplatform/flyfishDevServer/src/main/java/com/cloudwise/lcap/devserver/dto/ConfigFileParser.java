package com.cloudwise.lcap.devserver.dto;

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
    //appOnly appComponentOnly appAndComponent
    private String applicationExportType;
    private List<String> componentExportType;

    private List<ResourceApplicationDto> applications;
    private List<ResourceComponentDto> components;
}
