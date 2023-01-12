package com.cloudwise.lcap.datasource.model;

import cn.hutool.json.JSONObject;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@Slf4j
@Data
@Builder
@ToString
public class HttpEnumerable{
    private String url;
    private String method;
    private Map<String, Object> header;
    private Map<String, Object> params;
    private String requestBody;
    /**
     * [
     * {
     * "fieldName":"",
     * "alais":"",
     * "type":"",
     * "jsonpath":"",
     * "sort":1
     * }
     * ]
     */
    private List<JSONObject> fields;

    public HttpEnumerable(String url, String method, Map<String, Object> header, Map<String, Object> params, String requestBody, List<JSONObject> fields) {
        this.url = url;
        this.method = method;
        this.header = header;
        this.params = params;
        this.requestBody = requestBody;
        this.fields = fields;
    }

}
