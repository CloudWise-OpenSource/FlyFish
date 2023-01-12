package com.cloudwise.lcap.datasource.query.util;

import cn.hutool.core.collection.CollectionUtil;
import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.enums.ApiMethod;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.util.JsonNodeUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.datasource.model.HttpDeleteWithEntity;
import com.cloudwise.lcap.datasource.model.HttpEnumerable;
import com.cloudwise.lcap.datasource.model.HttpGetWithEntity;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import com.jayway.jsonpath.spi.json.JsonSmartJsonProvider;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.*;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.TimeUnit;

import static com.cloudwise.lcap.commonbase.contants.Constant.HTTP_CODE;
import static com.cloudwise.lcap.commonbase.util.DataTypeMapping.getJavaClassByName;
import static com.cloudwise.lcap.commonbase.util.DataTypeMapping.getValue;

@Slf4j
public class HttpQueryUtil {

    static CloseableHttpClient client = null;

    static {
        try {
            PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(10, TimeUnit.SECONDS);
            connectionManager.setMaxTotal(1000);
            // 信任所有证书
            SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, (TrustStrategy) (chain, authType) -> true).build();
            SSLConnectionSocketFactory sslFactory = new SSLConnectionSocketFactory(sslContext);
            RequestConfig defaultConfig = RequestConfig.custom().setConnectTimeout(5000).setCookieSpec(CookieSpecs.STANDARD).build();
            client = HttpClientBuilder.create().setDefaultRequestConfig(defaultConfig).setConnectionManager(connectionManager).setSSLSocketFactory(sslFactory).build();
        } catch (Exception e) {
            log.error("https客户端初始化错误", e);
        }
    }

    /**
     * 发起http调用
     *
     * @return
     */
    public static Object request(HttpEnumerable enumerable) {
        String method = enumerable.getMethod();
        ApiMethod methodType = ApiMethod.getMethod(method);
        if (null == methodType) {
            log.error("暂不支持的请求类型,method:{}", method);
            throw new ParameterException("暂不支持的请求类型" + method);
        }
        StringEntity stringEntity = null;
        String requestBody = enumerable.getRequestBody();
        if (StringUtils.isNotBlank(requestBody)) {
            JSONObject jsonObject = new JSONObject(requestBody);
            String type = jsonObject.getStr("type");
            if ("json".equalsIgnoreCase(type) || "raw".equalsIgnoreCase(type)) {
                stringEntity = new StringEntity(jsonObject.getJSONObject("value").toString(), ContentType.create(ContentType.APPLICATION_JSON.getMimeType(), "UTF-8"));
            } else if ("text".equalsIgnoreCase(type)) {
                stringEntity = new StringEntity(jsonObject.getStr("value"), ContentType.create(ContentType.TEXT_PLAIN.getMimeType(), "UTF-8"));
            }
        }
        String url = enumerable.getUrl();
        HttpEntityEnclosingRequestBase requestBase = new HttpGetWithEntity(url);
        if (methodType.equals(ApiMethod.GET)) {
            //url后面拼接了参数，强制截取掉，该用 params 中的参数（因为有可能前端在url中传了参数,params中由传了同名参数）
            if (url.contains("?")) {
                url = url.substring(0, url.indexOf("?"));
            }
            String urlParams = buildParams(enumerable.getParams());
            if (!StringUtils.isEmpty(urlParams)) {
                url += "?" + urlParams;
            }
            requestBase = new HttpGetWithEntity(url);
        } else if (methodType.equals(ApiMethod.POST)) {
            requestBase = new HttpPost(url);
        } else if (methodType.equals(ApiMethod.PUT)) {
            requestBase  = new HttpPut(url);
        } else if (methodType.equals(ApiMethod.DELETE)) {
            requestBase  = new HttpDeleteWithEntity(url);
        }

        try {
            requestBase.setHeaders(buildHeader(enumerable.getHeader()));
            requestBase.setEntity(stringEntity);
            HttpResponse response = client.execute(requestBase);
            StatusLine statusLine = response.getStatusLine();
            int statusCode = statusLine.getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    try {
                        String result = EntityUtils.toString(entity, "UTF-8");
                        return buildResponseData(result, enumerable.getFields());
                    } catch (Exception e) {
                        JSONObject map = new JSONObject();
                        map.put(HTTP_CODE, statusCode);
                        map.put("msg", "http请求转发成功，执行成功,返回体解析失败");
                        log.error("http请求转发成功，执行成功,返回体解析失败");
                        return map;
                    }
                }
            } else {
                JSONObject data = new JSONObject();
                data.put(HTTP_CODE, statusCode);
                data.put("msg", statusLine.getReasonPhrase());
                data.put("warn", "http请求转发成功，执行错误");
                HttpEntity entity = response.getEntity();
                if (entity != null) {
                    try {
                        data.put("data", EntityUtils.toString(entity, "UTF-8"));
                    } catch (IOException e) {
                    }
                }
                log.warn("http请求转发成功，执行错误");
                return data;
            }
        } catch (IOException e) {
            JSONObject map = new JSONObject();
            map.put(HTTP_CODE, 500);
            map.put("data", e.getMessage());
            log.error("请求处理异常,请检查参数格式是否正确");
            return map;
        }

        return null;
    }


    private static Header[] buildHeader(Map<String, Object> header) {
        if (header == null) {
            header = new HashMap<>();
        }
        Map<String, Object> headerToLowCode = new HashMap<>();
        header.forEach((key, value) -> headerToLowCode.putIfAbsent(key.toLowerCase(), value));
        headerToLowCode.putIfAbsent("content-type",ContentType.APPLICATION_JSON.getMimeType());

        List<BasicHeader> headers = new ArrayList<>();
        if (MapUtil.isNotEmpty(headerToLowCode)) {
            JsonNode object = JsonNodeUtils.parseStringToJson(JsonUtils.toJSONString(headerToLowCode));
            Iterator<Map.Entry<String, JsonNode>> datasourceHeaderIterator = object.fields();
            while (datasourceHeaderIterator.hasNext()) {
                Map.Entry<String, JsonNode> nodeEntry = datasourceHeaderIterator.next();
                String key = nodeEntry.getKey();
                headers.add(new BasicHeader(key, nodeEntry.getValue().asText()));
            }
        }
        return headers.toArray(new BasicHeader[]{});
    }

    /**
     * 将map结构的参数拼接起来（在url中的参数以&连接起来）
     *
     * @return
     */
    private static String buildParams(Map<String, Object> params) {
        StringJoiner uriParam = new StringJoiner("");
        if (MapUtil.isNotEmpty(params)) {
            JsonNode object = JsonNodeUtils.parseStringToJson(JsonUtils.toJSONString(params));
            Iterator<Map.Entry<String, JsonNode>> datasourceHeaderIterator = object.fields();
            while (datasourceHeaderIterator.hasNext()) {
                Map.Entry<String, JsonNode> nodeEntry = datasourceHeaderIterator.next();
                String paramValue = nodeEntry.getValue().asText();
                try {
                    paramValue = URLEncoder.encode(paramValue, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    log.error("请求url中参数encode异常");
                    paramValue = nodeEntry.getValue().asText();
                }
                uriParam.add(nodeEntry.getKey() + "=" + paramValue);
                uriParam.add("&");
            }
        }
        return uriParam.toString();
    }

    public static Object buildResponseData(String jsonString, List<JSONObject> fields) {
        try {
            JsonNode jsonNode = JsonUtils.objectMapper.readTree(jsonString);
            if (CollectionUtil.isEmpty(fields)) {
                JsonNodeType nodeType = jsonNode.getNodeType();
                if (nodeType == JsonNodeType.ARRAY) {
                    return JsonUtils.parseArray(jsonString, JSONObject.class);
                } else if (nodeType == JsonNodeType.OBJECT || nodeType == JsonNodeType.POJO) {
                    return JsonUtils.parse(jsonString, JSONObject.class);
                } else {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("key", jsonString);
                    return jsonObject;
                }
            } else {
                JSONObject data = new JSONObject();
                Configuration configuration = Configuration.builder().options(Option.ALWAYS_RETURN_LIST, Option.SUPPRESS_EXCEPTIONS).jsonProvider(new JsonSmartJsonProvider()).build();
                DocumentContext context = JsonPath.parse(jsonString, configuration);
                for (JSONObject field : fields) {
                    String fieldName = field.getStr("fieldName");
                    String pattern = field.getStr("jsonpath");
                    Object value = context.read(pattern);
                    //只要有一个字段为 OBJECT 类型，则整个结果都是OBJECT类型
                    JsonNode valueJsonNode = JsonUtils.objectMapper.readTree(value.toString());
                    JsonNodeType nodeType = valueJsonNode.getNodeType();
                    if (nodeType == JsonNodeType.OBJECT || nodeType == JsonNodeType.ARRAY) {
                        value = value.toString();
                    }
                    data.put(fieldName, value);
                }

                List<JSONObject> httpResponseData = new ArrayList<>();
                //key:字段名，value:字段值，每个字段对应的行数据，如有2个字段 13行数据，则field1、field2字段列应该有13个数据
                Map<String, List<String>> valuesMap = new HashMap<>();

                //数据列表行转列，已经对列表中的空值做过处理，所以理论上所有字段的value都是列表并且列表长度一样
                int totalRow = 0;
                Set<String> keySet = data.keySet();
                for (String field : keySet) {
                    List<String> value = data.getBeanList(field, String.class);
                    totalRow = value.size();
                    valuesMap.put(field, value);
                }
                for (int i = 0; i < totalRow; i++) {
                    JSONObject jsonObject = new JSONObject();
                    for (String field : keySet) {
                        List<String> objects = valuesMap.get(field);
                        Object value = null;
                        if (objects.size() > i) {
                            value = objects.get(i);
                        }
                        jsonObject.put(field, value);
                    }
                    httpResponseData.add(jsonObject);
                }
                return httpResponseData;
            }
        } catch (JsonProcessingException e) {
            log.error("http请求字段提取解析失败");
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("key", jsonString);
            return jsonObject;
        }

    }
}
