package com.cloudwise.lcap.commonbase.enums;

public enum AppDevStatus {
    DOING("doing"),
    TESTING("testing"),
    DELIVERED("delivered"),
    DEMO("demo");

    private final String type;

    private AppDevStatus(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
