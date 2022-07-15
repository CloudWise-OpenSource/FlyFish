package com.cloudwise.lcap.common.model;

import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;

import java.net.URI;

public class HttpDeleteWithEntity extends HttpEntityEnclosingRequestBase {
    public static final String METHOD_NAME = "DELETE";


    public HttpDeleteWithEntity(final String uri) {
        super();
        setURI(URI.create(uri));
    }

    public HttpDeleteWithEntity() {
        super();
    }

    @Override
    public String getMethod() {
        return METHOD_NAME;
    }
}
