package com.cloudwise.lcap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HttpRequestDTO {
    private String path;
    private String method;
    private Map<String,Object> reqHeaders = new HashMap<>();
    private Map<String,Object> reqParams = new HashMap<>();
    private String reqBody;
    private String reqBodyType;
}
