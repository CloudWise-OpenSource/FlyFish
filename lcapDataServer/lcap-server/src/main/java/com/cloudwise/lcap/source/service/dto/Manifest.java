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
public class Manifest implements Serializable {
    private String type;
    private String applicationExportType;
    private List<String> componentExportType;

    private List<ApplicationDto> applicationList;
    private List<ComponentDto> componentList;
    private String time;
}
