package com.cloudwise.lcap.api.enums;

import java.util.Arrays;
import java.util.Optional;

public enum HttpMethod {
    GET("GET"), POST("POST"), PUT("PUT"), DELETE("DELETE");

    private String method;

    HttpMethod(String method) {
        this.method = method;
    }


    public String getName() {
        return this.method;
    }

    public static HttpMethod findByName(String methodName) {
        if (null == methodName || methodName.length() == 0) {
            return null;
        }
        Optional<HttpMethod> first = Arrays.stream(values()).filter(e -> e.getName().equalsIgnoreCase(methodName)).findFirst();
        if (first.isPresent()) {
            return first.get();
        }
        return null;
    }
}
