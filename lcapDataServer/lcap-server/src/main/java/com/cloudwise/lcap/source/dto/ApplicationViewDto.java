package com.cloudwise.lcap.source.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationViewDto implements Serializable {

    private String id;
    private String name;
    private String projectName;
    private String projectId;
    private boolean update = false;
    private List<ComponentViewDto> components;
}
