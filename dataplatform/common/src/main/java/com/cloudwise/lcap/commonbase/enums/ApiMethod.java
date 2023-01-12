package com.cloudwise.lcap.commonbase.enums;

public enum ApiMethod {
    GET("get"),
    POST("post"),
    PUT("put"),
    DELETE("delete");

    public String getName() {
        return name;
    }

    private String name;

    ApiMethod(String name) {
        this.name = name;
    }

    public static ApiMethod getMethod(String name){
        for (ApiMethod apiMethod : ApiMethod.values()) {
            if (apiMethod.getName().equalsIgnoreCase(name)) {
                return apiMethod;
            }
        }
        return null;
    }

}
