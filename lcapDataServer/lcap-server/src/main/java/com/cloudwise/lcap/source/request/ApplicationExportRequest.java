package com.cloudwise.lcap.source.request;

import lombok.*;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationExportRequest implements Serializable {

    private List<String> ids;
    private String applicationExportType;
    private List<String> componentExportType;
}
