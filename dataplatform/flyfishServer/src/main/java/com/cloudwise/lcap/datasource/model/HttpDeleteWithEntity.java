package com.cloudwise.lcap.datasource.model;

import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import java.net.URI;


public class HttpDeleteWithEntity extends HttpEntityEnclosingRequestBase {
    public static final String METHOD_NAME = "DELETE";
    @Override
    public String getMethod() { return METHOD_NAME; }

    public HttpDeleteWithEntity(final String uri) {
        super();
        setURI(URI.create(uri));
    }
    public HttpDeleteWithEntity(final URI uri) {
        super();
        setURI(uri);
    }
    public HttpDeleteWithEntity() { super(); }
}