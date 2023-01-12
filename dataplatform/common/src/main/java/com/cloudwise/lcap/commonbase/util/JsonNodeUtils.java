package com.cloudwise.lcap.commonbase.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.*;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.ALWAYS;
import static com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES;
import static com.fasterxml.jackson.databind.SerializationFeature.FAIL_ON_EMPTY_BEANS;

/**
 * @author admin
 */
@Slf4j
public class JsonNodeUtils {
    private static final ObjectMapper MAPPER;

    static {
        MAPPER = new ObjectMapper();
        MAPPER.configure(FAIL_ON_UNKNOWN_PROPERTIES, false);
        MAPPER.configure(FAIL_ON_EMPTY_BEANS, false);
        MAPPER.setSerializationInclusion(ALWAYS);
        MAPPER.getSerializerProvider().setNullKeySerializer(new NullKeySerializer());
    }

    public static String toPrettyString(JsonNode node) {
        if (Objects.isNull(node)) {
            return null;
        }
        if (node instanceof ObjectNode || node instanceof ArrayNode) {
            return node.toString();
        } else {
            return node.asText();
        }
    }

    /**
     * json 字符串抓 JSON 对象/数组
     *
     * @param text json 字符串
     * @return JSON 对象/数组
     */
    public static JsonNode parseStringToJson(String text) {
        try {
            return MAPPER.readTree(text);
        } catch (IOException e) {
            log.error("JsonNodeUtils parseStringToJson fail,text={}, error is:", text, e);
            throw new IllegalArgumentException("json解析错误", e);
        }
    }

    /**
     * json 对象转 map
     *
     * @param node json 对象
     * @return map
     */
    public static Map<String, Object> node2Map(JsonNode node) {
        if (node == null || node instanceof ArrayNode) {
            return Collections.emptyMap();
        }
        try {
            Map<String, Object> map = new HashMap<>();
            Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> next = fields.next();
                map.put(next.getKey(), next.getValue().asText());
            }
            return map;
        } catch (Exception e) {
            log.error("JsonNodeUtils node2Map fail,{} error is:", e.getMessage(), e);
        }
        return Collections.emptyMap();
    }

    public static Map<String, Object> node2MapObject(JsonNode node) {
        if (node == null || node instanceof ArrayNode) {
            return Collections.emptyMap();
        }
        try {
            Map<String, Object> map = new HashMap<>();
            Iterator<Map.Entry<String, JsonNode>> fields = node.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> next = fields.next();
                map.put(next.getKey(), next.getValue().asText());
            }
            return map;
        } catch (Exception e) {
            log.error("JsonNodeUtils node2Map fail,{} error is:", e.getMessage(), e);
        }
        return Collections.emptyMap();
    }

    /**
     * json 字符串转 Java 对象
     *
     * @param text      json 字符串
     * @param valueType Java 类
     * @param <T>
     * @return
     */
    public static <T> T parseToTargetObject(String text, Class<T> valueType) {
        try {
            return MAPPER.readValue(text, valueType);
        } catch (IOException e) {
            log.error("JsonNodeUtils parseToTargetObject fail,text={}, error is:", text, e);
        }
        return null;
    }

    /**
     * json 字符串转 List
     *
     * @param text      json
     * @param valueType List 对象
     * @param <T>       List 对象类型
     * @return
     */
    public static <T> List<T> parseToTargetList(String text, Class<T> valueType) {
        try {
            JavaType jt = MAPPER.getTypeFactory().constructParametricType(ArrayList.class, valueType);
            return MAPPER.readValue(text, jt);
        } catch (IOException e) {
            log.error("JsonNodeUtils parseToTargetList fail,text={}, error is:", text, e);
        }
        return null;
    }

    public static <T> T convertObject(Object o, Class<T> clazz) {
        if (o == null) {
            return null;
        }
        try {
            return MAPPER.convertValue(o, clazz);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        }
    }


    public static List<String> getObjectNodeSet(ObjectNode data) {
        Iterator<String> keyIterator = data.fieldNames();
        List<String> keyList = new ArrayList<>();
        while (keyIterator.hasNext()) {
            keyList.add(keyIterator.next());
        }
        return keyList;
    }

    public static String writeObjectToString(Object value) {
        try {
            return MAPPER.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.error("JsonNodeUtils writeObjectToString fail, error is:", e);
        }
        return null;
    }

    public static JsonNode writeObjectToNode(Object o) {
        try {
            return MAPPER.convertValue(o, JsonNode.class);
        } catch (IllegalArgumentException e) {
            log.error("JsonNodeUtils writeObjectToNode fail, error is:", e);
        }
        return null;
    }

    public static <T> List<T> parseArray(Object o, Class<T> clazz) {
        if (o == null) {
            return null;
        }
        try {
            JavaType jt = MAPPER.getTypeFactory().constructParametricType(ArrayList.class, clazz);
            return MAPPER.convertValue(o, jt);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    public static ObjectMapper getMapper() {
        return MAPPER;
    }


}
