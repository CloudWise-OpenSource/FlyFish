package com.cloudwise.lcap.dataplateform.core.calcite.http;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.utils.DataTypeMapping;
import org.apache.calcite.DataContext;
import org.apache.calcite.linq4j.Enumerable;
import org.apache.calcite.rel.type.RelDataType;
import org.apache.calcite.rel.type.RelDataTypeFactory;
import org.apache.calcite.schema.ScannableTable;
import org.apache.calcite.schema.impl.AbstractTable;

import java.util.List;
import java.util.Map;

public class HttpTable extends AbstractTable implements ScannableTable {
    private List<Map<String,Object>> fields;
    private String url;
    private String method;
    private Map<String,Object> header;
    private Map<String,Object> params;
    private String requestBody;

    public HttpTable(List<Map<String,Object>> fields,String url,String method,Map<String, Object> header,Map<String, Object> params,String requestBody){
        this.fields = fields;
        this.method = method;
        this.url = url;
        this.header = header;
        this.params = params;
        this.requestBody = requestBody;
    }

    @Override
    public Enumerable<Object[]> scan(DataContext root) {
        return new HttpEnumerable(url, method, header, params, requestBody,fields);
    }

    @Override
    public RelDataType getRowType(RelDataTypeFactory typeFactory) {
        RelDataTypeFactory.Builder builder = new RelDataTypeFactory.Builder(typeFactory);
        try{
            for (Map<String, Object> field : fields) {
                String fieldName = (String)field.get("fieldName");
                String fieldType = (String)field.get("fieldType");
                builder.add(fieldName, DataTypeMapping.getSqlTypeByName(fieldType)).nullable(true);
            }

        }catch (Exception e){
            System.out.println("转换失败："+e.getMessage());
        }
        return builder.build();
    }
}
