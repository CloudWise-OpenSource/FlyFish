package com.cloudwise.lcap.source.service.dto;

import lombok.*;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ApplicationExportRequest implements Serializable {

    private List<String> ids;
}
