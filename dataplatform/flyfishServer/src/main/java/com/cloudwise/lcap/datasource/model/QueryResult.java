package com.cloudwise.lcap.datasource.model;

import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Slf4j
@Data
@Builder
@ToString
public class QueryResult {

    private Long taskId;
    /**
     * 采用LinkedHashMap 主要是解决字段顺序的问题
     */
    private List<Map<String, Object>> data;
}
