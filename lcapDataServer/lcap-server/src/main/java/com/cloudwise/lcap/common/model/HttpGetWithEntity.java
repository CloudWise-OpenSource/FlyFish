package com.cloudwise.lcap.common.model;

import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;

import java.net.URI;

public class HttpGetWithEntity extends HttpEntityEnclosingRequestBase {

    private final static String METHOD_NAME = "GET";

    @Override
    public String getMethod() {
        return METHOD_NAME;
    }


    public HttpGetWithEntity(final String uri) {
        super();
        setURI(URI.create(uri));
    }

}
