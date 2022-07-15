package com.cloudwise.lcap.source.request;

import com.cloudwise.lcap.source.dto.ApplicationViewDto;
import com.cloudwise.lcap.source.dto.ComponentViewDto;
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
    private List<ApplicationViewDto> applications;
    private List<ComponentViewDto> components;
}
