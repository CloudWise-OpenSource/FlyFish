package com.cloudwise.lcap.source.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationsListDto implements Serializable {

    private List<ApplicationViewDto> applications;
    private int count;
}
