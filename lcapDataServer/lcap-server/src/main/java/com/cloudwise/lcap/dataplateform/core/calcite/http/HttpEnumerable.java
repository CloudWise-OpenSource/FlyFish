package com.cloudwise.lcap.dataplateform.core.calcite.http;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.utils.DataTypeMapping;
import com.cloudwise.lcap.common.utils.JsonPathUtil;
import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import org.apache.calcite.linq4j.AbstractEnumerable;
import org.apache.calcite.linq4j.Enumerator;
import org.apache.calcite.linq4j.Linq4j;
import org.apache.calcite.rel.core.Collect;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.common.utils.DataTypeMapping.getJavaClassByName;
import static com.cloudwise.lcap.common.utils.DataTypeMapping.getValue;

@Data
@Builder
@ToString
public class HttpEnumerable extends AbstractEnumerable<Object[]> {
    private static final Log log = LogFactory.getLog(HttpEnumerable.class);

    private String url;
    private String method;
    private Map<String, Object> header;
    private Map<String, Object> params;
    private String requestBody;
    /**
     * [
     * {
     * "fieldName":"",
     * "alais":"",
     * "type":"",
     * "jsonpath":"",
     * "sort":1
     * }
     * ]
     */
    private List<Map<String, Object>> fields;

    public HttpEnumerable(String url, String method, Map<String, Object> header, Map<String, Object> params, String requestBody, List<Map<String, Object>> fields) {
        this.url = url;
        this.method = method;
        this.header = header;
        this.params = params;
        this.requestBody = requestBody;
        this.fields = fields;
    }

    @Override
    public Enumerator<Object[]> enumerator() {
        Object httpResponse = HttpQueryUtil.request(this);
        List<Object[]> result = null;
        /**
         *      {
         *        "fieldName":"id",
         *        "fieldAliasName":"序号",
         *        "fieldType":int,  //字段类型，见下方【数据类型映射】
         *        "jsonpath":"$.data.id",
         *        "sort":1
         *      }
         */
        if (CollectionUtil.isEmpty(fields)) {
            List<Map<String, Object>> thisField = new ArrayList<>();
            if (httpResponse instanceof String || httpResponse instanceof Number || httpResponse instanceof Boolean) {
                Map<String, Object> fieldMap = new HashMap<>();
                fieldMap.put("fieldName", "key");
                fieldMap.put("fieldAliasName", "key");
                String jsonpath = "$";
                fieldMap.put("jsonpath", jsonpath);
                fieldMap.put("fieldType", "varchar");
                fieldMap.put("sort", 1);
                fields.add(fieldMap);
            } else if (httpResponse instanceof Map || httpResponse instanceof JSONObject) {
                Integer sort = 1;
                JSONObject response = (JSONObject) httpResponse;
                for (String k : response.keySet()) {
                    Map<String, Object> fieldMap = new HashMap<>();
                    fieldMap.put("fieldName", k);
                    fieldMap.put("fieldAliasName", k);
                    String jsonpath = "$." + k;
                    fieldMap.put("jsonpath", jsonpath);
                    String javaType = DataTypeMapping.getJavaType(response.get(k));
                    fieldMap.put("fieldType", javaType);
                    fieldMap.put("sort", sort++);
                    fields.add(fieldMap);
                }
            } else if (httpResponse instanceof Collect || httpResponse instanceof JSONArray) {
                JSONArray response = (JSONArray) httpResponse;
                Integer sort = 1;
                for (Object o : response) {
                    JSONObject jsonResponse = (JSONObject) o;
                    for (String k : jsonResponse.keySet()) {
                        List<String> fieldNameList = thisField.stream().map(map -> map.get("fieldName").toString()).collect(Collectors.toList());
                        if (!fieldNameList.contains(k)) {
                            Map<String, Object> fieldMap = new HashMap<>();
                            fieldMap.put("fieldName", k);
                            fieldMap.put("fieldAliasName", k);
                            String jsonpath = "$." + k;
                            fieldMap.put("jsonpath", jsonpath);
                            String javaType = DataTypeMapping.getJavaType(jsonResponse.get(k));
                            fieldMap.put("fieldType", javaType);
                            fieldMap.put("sort", sort++);
                            fields.add(fieldMap);
                        }
                    }
                }
            }
            fields = thisField;
        }
        result = buildResponseData(httpResponse, fields);
        return Linq4j.enumerator(result);
    }


    public static List<Object[]> buildResponseData(Object object, List<Map<String, Object>> fields) {
        List<Object[]> totalRowData = new ArrayList<>();
        try {
            int fieldsSize = fields.size();
            Table<String, Integer, String> collect = HashBasedTable.create();
            Map<Integer, String> collect2 = new HashMap<>();
            for (Map<String, Object> field : fields) {
                int sort = (int) field.get("sort");
                String fieldName = (String) field.get("fieldName");
                String fieldType = (String) field.get("fieldType");
                collect.put(fieldName, sort, fieldType);
                collect2.put(sort, fieldName);
            }


            Map<Integer, Object> fieldsData = new HashMap<>();
            Object transferType = null;
            String documentStr = null;
            if (object instanceof Map) {
                documentStr = new JSONObject(object).toString();
            } else if (object instanceof List) {
                documentStr = new JSONArray(object).toString();
            }

            for (Map<String, Object> field : fields) {
                int sort = (int) field.get("sort");
                Object jsonpath = field.get("jsonpath");
                if (null != jsonpath) {
                    try {
                        //对其中一个字段进行jsonpath解析,将当前这个字段的解析结果 作为解析类型
                        Object transferFieldData = JsonPathUtil.transfer(documentStr, jsonpath.toString());
                        if (null == transferType && null != transferFieldData) {
                            transferType = transferFieldData;
                        }
                        fieldsData.put(sort, transferFieldData);
                    } catch (Exception e) {
                        e.printStackTrace();
                        log.error("jsonpath数据解析错误,jsonpath:" + jsonpath);
                    }
                }
            }

            if (transferType instanceof String || transferType instanceof Integer ||
                    transferType instanceof Double || transferType instanceof Float || transferType instanceof Boolean ||
                    transferType instanceof Character) {
                Object[] rowData = new Object[fieldsSize];
                int i = 0;
                for (Object value : fieldsData.values()) {
                    rowData[i++] = value;
                }
                totalRowData.add(rowData);
            } else if (transferType instanceof Collection) {
                JSONArray array = new JSONArray(transferType);
                //对其中一个字段转list后将list的size作为sql数据的总数据行数
                int rowTotal = array.size();
                //k:字段排序值 v:字段名
                Set<Integer> sorts = collect.columnKeySet();
                for (int rowNum = 0; rowNum < rowTotal; rowNum++) {
                    int fieldSort = 0;
                    Object[] rowData = new Object[fieldsSize];
                    for (Integer sort : sorts) {
                        Object fieldData = null;
                        Object o = fieldsData.get(sort);
                        if (o instanceof Collection) {
                            Object[] columnData = ((net.minidev.json.JSONArray) o).toArray();
                            fieldData = columnData[rowNum];
                        } else {
                            fieldData = o;
                        }
                        //需要将 fieldData 转换为 fieldType 需要的类型
                        int i = fieldSort++;
                        if (null != fieldData) {
                            String fieldName = collect2.get(sort);
                            String fieldType = collect.get(fieldName, sort);
                            try {
                                Class javaClassByName = getJavaClassByName(fieldType);
                                rowData[i] = getValue(javaClassByName, fieldData.toString());
                            } catch (Exception e) {
                                log.error("数据fieldData:" + fieldData + " 转换类型:" + fieldType + " 异常");
                            }
                        }
                    }
                    totalRowData.add(rowData);
                }
            }
        } catch (Exception e) {
            log.error("http返回值数据解析异常" + e);
            throw new BizException("http返回值数据解析异常");
        }
        return totalRowData;
    }


}
