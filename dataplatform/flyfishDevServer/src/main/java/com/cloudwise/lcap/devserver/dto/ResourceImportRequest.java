package com.cloudwise.lcap.devserver.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResourceImportRequest implements Serializable {

    private String key;
    private String importType;
    private String applicationType;
    private List<ResourceApplicationDto> applications;
    private List<ResourceComponentDto> components;
}
