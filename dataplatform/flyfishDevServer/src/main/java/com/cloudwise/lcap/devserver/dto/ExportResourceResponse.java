package com.cloudwise.lcap.devserver.dto;


import lombok.*;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ExportResourceResponse implements Serializable {

    private String name;
    private Long size;
}
