package com.cloudwise.lcap.commonbase.enums;

public enum ValidType {
    INVALID(0),
    VALID(1);
    private final int type;

    private ValidType(int type) {
        this.type = type;
    }

    public int getType() {
        return type;
    }
}
