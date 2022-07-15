package com.alibaba.fastjson;

import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONException;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.*;
import lombok.extern.slf4j.Slf4j;

/**
 * 排除Dubbo所依赖的Fastjson，排除后有此依赖，覆盖实现。
 *
 * @see org.apache.dubbo.registry.client.metadata.store.InMemoryWritableMetadataService#publishServiceDefinition
 */
@Slf4j
public class JSON {

    public static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public static String toJSONString(Object obj) {
        return writeValueAsString(obj);
    }

    public static String writeValueAsString(Object o) {
        String result = null;
        try {
            result = OBJECT_MAPPER.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            log.error("writeValueAsString error {},{}", o, e.getMessage(), e);
        }
        return result;
    }

    public static JSONObject parseObject(String text) {
        cn.hutool.json.JSONObject jsonObject = new cn.hutool.json.JSONObject(text);
        return new JSONObject(jsonObject);
    }
}