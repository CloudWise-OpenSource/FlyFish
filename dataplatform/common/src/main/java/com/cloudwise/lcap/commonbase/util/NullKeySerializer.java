package com.cloudwise.lcap.commonbase.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

/**
 * 类的描述
 *
 * @author: cg
 * @since: 2021-04-23 11:51
 **/
public class NullKeySerializer extends StdSerializer<Object> {
    public NullKeySerializer() {
        this(null);
    }

    public NullKeySerializer(Class<Object> t) {
        super(t);
    }

    @Override
    public void serialize(Object nullKey, JsonGenerator jsonGenerator, SerializerProvider unused)
            throws IOException, JsonProcessingException {
        jsonGenerator.writeFieldName("");
    }
}
