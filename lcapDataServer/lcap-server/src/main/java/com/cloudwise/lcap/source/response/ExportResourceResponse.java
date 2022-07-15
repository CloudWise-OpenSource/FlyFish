package com.cloudwise.lcap.source.response;


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
