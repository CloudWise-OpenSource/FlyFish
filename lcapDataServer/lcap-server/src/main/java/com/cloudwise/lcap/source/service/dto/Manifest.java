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

    private String applicationExportType;
    private List<String> componentExportType;

    private String time;
    private String creator;

    private String type;
    private String developStatus;
    private String version;

    private List<ApplicationDto> applicationList;
    private List<ComponentDto> componentList;

}
