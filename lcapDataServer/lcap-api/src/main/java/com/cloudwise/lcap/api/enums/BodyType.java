package com.cloudwise.lcap.api.enums;

import java.util.Arrays;
import java.util.Optional;

public enum BodyType {

    RAW("raw"),
    JSON("json");

    String reqBodyType;

    BodyType(String reqBodyType) {
        this.reqBodyType = reqBodyType;
    }


    public String getReqBodyType() {
        return this.reqBodyType;
    }

    public static BodyType findByReqBodyType(String reqBodyType) {
        if (null == reqBodyType || reqBodyType.length() == 0) {
            return null;
        }
        Optional<BodyType> first = Arrays.stream(values()).filter(e -> e.getReqBodyType().equalsIgnoreCase(reqBodyType)).findFirst();
        if (first.isPresent()) {
            return first.get();
        }
        return null;
    }


}
