package com.cloudwise.lcap.source.service.dto;

import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Accessors(chain = true)
public class ComponentExportRequest implements Serializable {

    private Set<String> ids;
}
