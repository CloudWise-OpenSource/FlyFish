package com.cloudwise.lcap.source.service.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * 组件导入结果
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ResourceImportResult {

    private String key;
    private String type;
    private List<String> componentImportSuccess = new ArrayList<>();
    private List<String> componentImportFailed = new ArrayList<>();

    private List<String> applicationImportSuccess = new ArrayList<>();
    private List<String> applicationImportFailed = new ArrayList<>();

}
