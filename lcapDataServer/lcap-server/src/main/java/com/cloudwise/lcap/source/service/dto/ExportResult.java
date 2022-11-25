package com.cloudwise.lcap.source.service.dto;


import lombok.*;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExportResult implements Serializable {

    private String name;
    private Long size;
}
