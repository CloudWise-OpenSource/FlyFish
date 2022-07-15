package com.cloudwise.lcap.source.dto;

import com.cloudwise.lcap.source.model.Application;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectDto {

    private String projectId;
    private String name;
    private List<Application> applicationList;
}