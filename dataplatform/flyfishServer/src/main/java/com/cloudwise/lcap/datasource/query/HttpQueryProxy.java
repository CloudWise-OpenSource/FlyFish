package com.cloudwise.lcap.datasource.query;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cloudwise.lcap.commonbase.entity.DataTable;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.datasource.model.HttpEnumerable;
import com.cloudwise.lcap.datasource.model.ExecuteBean;
import com.cloudwise.lcap.datasource.model.QueryResult;
import com.cloudwise.lcap.datasource.engineer.SparkEngineer;
import com.cloudwise.lcap.datasource.query.util.HttpQueryUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;

import java.util.*;

import static com.cloudwise.lcap.commonbase.contants.Constant.HTTP_CODE;


@Slf4j
public class HttpQueryProxy {

    /**
     * @return Object  查询返回的结果
     */
    public static QueryResult query(ExecuteBean executeBean,Map<String,Object> extraHeader) {
        QueryResult result = new QueryResult();
        result.setTaskId(executeBean.getTaskId());
        // sql解析及格式优化，如换行符移除，引号替换，分号移除等
        String sql = executeBean.getSql()
                .replaceAll("\\n", "")
                .replaceAll("\\(", " ( ")
                .replaceAll("\\)", " ) ");

        String dbAndTable = getDbAndTable(sql);
        String tableName = null;
        if (StringUtils.isNotBlank(dbAndTable)) {
            String[] split = dbAndTable.replaceAll("`", "").split("\\.");
            if (split.length == 2) {
                tableName = split[1];
            } else {
                tableName = split[0];
            }
            sql = sql.replaceAll(dbAndTable, tableName);
        }
        final String finalName = tableName;
        Optional<DataTable> first = executeBean.getTables().stream().filter(o -> o.getName().equals(finalName)).findFirst();
        HttpEnumerable enumerable = buildHttpTable(first.get().getMeta());
        if (null == extraHeader){
            extraHeader = new HashMap<>();
        }
        extraHeader.forEach(enumerable.getHeader()::putIfAbsent);
        Object responseData = HttpQueryUtil.request(enumerable);
        List<JSONObject> tableData = new ArrayList<>();

        //判断是否是错误的请求
        if (responseData instanceof Map){
            LinkedHashMap<String, Object> map = JsonUtils.parse(responseData.toString(),LinkedHashMap.class);
            if (map.containsKey(HTTP_CODE) && Integer.parseInt(map.get(HTTP_CODE).toString()) != 200){
                result.setData(Collections.singletonList(map));
                return result;
            }else {
                JSONObject data = new JSONObject();
                data.putAll(map);
                tableData.add(data);
            }
        }else if (responseData instanceof Collection){
            tableData = JsonUtils.parseArray(responseData.toString(), JSONObject.class);
        }
        //spark 分析 httpResponseData
        List<Map<String, Object>> engineerData = SparkEngineer.query(sql, tableName, tableData);
        result.setData(engineerData);
        return result;
    }

    public static Map<String, Object> parse(List<Map<String, Object>> headers) {
        Map<String, Object> data = new HashMap<>();
        for (Map<String, Object> header : headers) {
            Boolean required = (Boolean) header.get("required");
            Object type = header.get("type");
            String name = (String) header.get("name");
            Object value = header.get("default");
            //类型校验,必填校验
            data.put(name, value);
        }
        return data;
    }


    private static String getDbAndTable(String sql) {
        String dbAndTable = null;
        sql = sql.replaceAll("FROM","from");
        if (sql.contains("from")) {
            int fromIndex = sql.indexOf("from");
            while (fromIndex >= 0 && sql.substring(fromIndex + 4).trim().split(" ")[0].equalsIgnoreCase("(")) {
                fromIndex = sql.indexOf("from", fromIndex + 1);
            }
            dbAndTable = sql.substring(fromIndex + 4).trim().split(" ")[0];
            if (dbAndTable.endsWith(")")){
                dbAndTable = dbAndTable.replaceAll("\\)","");
            }
        }
        return dbAndTable;
    }

    private static HttpEnumerable buildHttpTable(String meta){
        JSONObject connectData = new JSONObject(meta);
        String url = connectData.getStr("url");
        String method = connectData.getStr("method");
        Map<String, Object> header = new HashMap<>();
        if (connectData.containsKey("header") && ObjectUtils.isNotEmpty(connectData.get("header"))) {
            header = parse((List<Map<String, Object>>) connectData.get("header"));
        }

        Map<String, Object> params = new HashMap<>();
        if (connectData.containsKey("params") && ObjectUtils.isNotEmpty(connectData.get("params"))) {
            params = parse((List<Map<String, Object>>) connectData.get("params"));
        }

        String requestBody = null;
        if (connectData.containsKey("requestBody") && ObjectUtils.isNotEmpty(connectData.get("requestBody"))) {
            JSONObject jsonObject = connectData.getJSONObject("requestBody");
            String type = jsonObject.getStr("type");
            String value = jsonObject.getStr("value");
            requestBody = new JSONObject().set("value", JSONUtil.parseObj(value)).set("type",type).toString();
        }

        List<JSONObject> fields = new ArrayList<>();
        if (connectData.containsKey("fields") && ObjectUtils.isNotEmpty(connectData.get("fields"))) {
            fields = connectData.getBeanList("fields",JSONObject.class);
        }
        HttpEnumerable httpEnumerable = HttpEnumerable.builder().url(url).method(method).header(header).params(params).requestBody(requestBody).fields(fields).build();
        return httpEnumerable;
    }
}