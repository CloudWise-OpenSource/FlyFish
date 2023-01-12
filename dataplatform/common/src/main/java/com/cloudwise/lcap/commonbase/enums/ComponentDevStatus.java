package com.cloudwise.lcap.commonbase.enums;

public enum ComponentDevStatus {
    DOING("doing"),
    ONLINE("online");
    private final String type;

    private ComponentDevStatus(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
