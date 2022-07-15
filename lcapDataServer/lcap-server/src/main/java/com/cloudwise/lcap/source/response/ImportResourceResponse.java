package com.cloudwise.lcap.source.response;

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
public class ImportResourceResponse implements Serializable {

    // 导入类型  application/component
    private String type;

    private String applicationExportType;
    private List<String> componentExportType;

    private List<ApplicationViewDto> applications;
    private List<ComponentViewDto> components;
}
