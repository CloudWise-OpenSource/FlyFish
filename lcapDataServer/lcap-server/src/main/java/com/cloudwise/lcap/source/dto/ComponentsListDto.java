package com.cloudwise.lcap.source.dto;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ComponentsListDto implements Serializable {

    private List<ComponentViewDto> components;
    private int count;
}
