package com.cloudwise.lcap.dataplateform.core.calcite.http;

import cn.hutool.json.JSONObject;
import com.google.common.collect.ImmutableMap;
import org.apache.calcite.schema.Table;
import org.apache.calcite.schema.impl.AbstractSchema;
import org.apache.commons.lang3.ObjectUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HttpSchema extends AbstractSchema {

    private Map<String, Table> tableMap;


    private List<Map<String, Object>> tables;

    public HttpSchema(List<Map<String, Object>> tables) {
        this.tables = tables;
    }

    @Override
    protected Map<String, Table> getTableMap() {
        if (tableMap == null) {
            tableMap = createTableMap();
        }
        return tableMap;
    }

    private Map<String, Table> createTableMap() {
        final ImmutableMap.Builder<String, Table> builder = ImmutableMap.builder();
        for (Map<String, Object> table : tables) {
            String tableName = (String) table.get("tableName");
            String url = (String) table.get("url");
            String method = (String) table.get("method");
            Map<String, Object> header = new HashMap<>();
            if (table.containsKey("header") && ObjectUtils.isNotEmpty(table.get("header"))) {
                //header = (Map<String, Object>) table.get("header");
                header = parse((List<Map<String, Object>>) table.get("header"));
            }

            Map<String, Object> params = new HashMap<>();
            if (table.containsKey("params") &&  ObjectUtils.isNotEmpty(table.get("params"))) {
                //params = (Map<String, Object>) table.get("params");
                params = parse((List<Map<String, Object>>) table.get("params"));
            }

            String requestBody = null;
            if (table.containsKey("requestBody") && ObjectUtils.isNotEmpty(table.get("requestBody"))) {
                requestBody = table.get("requestBody").toString();
            }

            List<Map<String, Object>> fields = new ArrayList<>();
            if (table.containsKey("fields") && ObjectUtils.isNotEmpty(table.get("fields"))) {
                fields = (List<Map<String, Object>>) table.get("fields");
            }
            Table table1 = new HttpTable(fields, url, method, header, params, requestBody);
            builder.put(tableName, table1);
        }

        return builder.build();
    }

    public Map<String, Object> parse(List<Map<String,Object>> headers){
        Map<String, Object> data = new HashMap<>();
        for (Map<String, Object> header : headers) {
            Boolean required = (Boolean)header.get("required");
            Object type = header.get("type");
            String name = (String)header.get("name");
            Object value = header.get("default");
            //类型校验,必填校验
            data.put(name,value);
        }
        return data;
    }



}
