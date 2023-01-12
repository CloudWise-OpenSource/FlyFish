package com.cloudwise.lcap.commonbase.enums;

public enum RenderStage {
    DOING("doing"),
    UNDONE("undone"),
    DONE("done");

    private final String type;

    private RenderStage(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
