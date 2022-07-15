package com.cloudwise.lcap.common.utils;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.MapUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;

@Slf4j
public class JsonUtils {

    private JsonUtils() {
    }

    public static final ObjectMapper objectMapper;

    static {
        objectMapper = new ObjectMapper();
        objectMapper.setDefaultPropertyInclusion(JsonInclude.Value.construct(JsonInclude.Include.NON_NULL, JsonInclude.Include.NON_NULL));
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        objectMapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
        objectMapper.enable(DeserializationFeature.READ_ENUMS_USING_TO_STRING);
        objectMapper.enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL);
        objectMapper.configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true);
        objectMapper.enable(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER.mappedFeature());
        objectMapper.enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS.mappedFeature());
        objectMapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
    }


    public static String toJSONString(Object o) {
        if (o == null) {
            log.debug("JsonUtils toJSONString return null since object is null.");
            return null;
        }
        String result = null;
        try {
            result = objectMapper.writeValueAsString(o);
        } catch (JsonProcessingException e) {
            log.error("JsonUtils convert object {} to String error {}", o, e);
        }
        return result;
    }

    public static <T> T parse(String jsonString, Class<T> clazz) {
        if (StringUtils.isEmpty(jsonString)) {
            log.debug("JsonUtils parse return null since jsonString is empty.");
            return null;
        }
        T t =  null;
        try {
            t = objectMapper.readValue(jsonString, clazz);
        } catch (IOException e) {
            log.error("JsonUtils parse string {} to object error {}", jsonString, e);
        }
        return t;
    }


    public static HashMap jsonToMap(String jsonString) {
        if (StringUtils.isEmpty(jsonString)) {
            log.debug("JsonUtils jsonToMap return null since jsonString is empty.");
            return null;
        }
        return jsonToObject(jsonString, HashMap.class);
    }

    public static <T> T jsonToObject(String jsonString,Class<T> t) {
        T readValue =  null;
        try {
            readValue = objectMapper.readValue(jsonString, t);
        } catch (IOException e) {
            log.error("JsonUtils parse string {} to object error {}", jsonString, e);
        }
        return readValue;
    }

    public static <T> List<T> parseArray(String jsonString, Class<T> clazz) {
        try {
            return (List)objectMapper.readValue(jsonString, objectMapper.getTypeFactory().constructParametricType(List.class, new Class[]{clazz}));
        } catch (JsonProcessingException var3) {
            log.error("JsonUtils parse string {} to object error {}", jsonString, var3);
        }
        return null;
    }
    public static List<Map<String, Object>> jsonToListMap( String jsonString) {
        if (StringUtils.isEmpty(jsonString)) {
            log.debug("JsonUtils jsonToListMap return null since jsonString is empty.");
            return null;
        }
        List<Map<String, Object>> readValue = null;
        try {
            readValue = objectMapper.readValue(jsonString, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            log.error("JsonUtils parse string {} to object error {}", jsonString, e);
        }
        return readValue;
    }

    public static <T> List<T> jsonToListObject( String jsonString, TypeReference<List<T>> typeReference) {
        if (StringUtils.isEmpty(jsonString)) {
            log.debug("JsonUtils jsonToListObject return null since jsonString is empty.");
            return null;
        }
        List<T> readValue = null;
        try {
            readValue = objectMapper.readValue(jsonString, typeReference);
        } catch (IOException e) {
            log.error("JsonUtils parse string {} to object error {}", jsonString, e);
        }
        return readValue;
    }


    private static Field[] getAllFields(Class<?> clazz,Boolean isExtendParentClass) {
        List<Field> fieldList = new ArrayList<>();
        while (clazz != null ){
            fieldList.addAll(new ArrayList<>(Arrays.asList(clazz.getDeclaredFields())));
            if(isExtendParentClass) {//只取一级父类
                clazz = clazz.getSuperclass();
                isExtendParentClass=false;
            }else{
                clazz=null;
            }
        }
        Field[] fields = new Field[fieldList.size()];
        return fieldList.toArray(fields);
    }


    public static String sortJsonString(Map map) {
        if (MapUtils.isEmpty(map)) {
            return null;
        }
        String result = null;
        try {
            result = objectMapper.writeValueAsString(map);
        } catch (IOException e) {
            log.error("JsonUtils sortJsonString map {} error {}", StringUtils.join(map), e);
        }
        return result;
    }


    /**
     * 去掉json字符串中的空格， 如   "  {   \"k1\":     \"v1\",  \"k2\":\"v2\"}  " 这种数据格式
     * @param jsonString
     * @return java.lang.String
     * @author kevin
     * @date 2022/2/23 10:01 上午
     */
    public static String replaceJsonBlank(String jsonString){
        if (StringUtils.isBlank(jsonString)) {
            log.debug("JsonUtils replaceJsonBlank return null since jsonString is empty.");
            return jsonString;
        }
        JsonNode actualObj = null;
        try {
            actualObj = objectMapper.readTree(jsonString);
        } catch (JsonProcessingException e) {
            log.error("JsonUtils replace string {} to blank error {}", jsonString, e);
        }
        if (null == actualObj) {
            return null;
        }
        return actualObj.toString();
    }
}