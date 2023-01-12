package com.cloudwise.lcap.commonbase.enums;

public enum ResourceType {
    APPLICATION("application"),
    COMPONENT("component");

    private final String type;

    private ResourceType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
