package com.cloudwise.lcap.dataplateform.core.calcite.http;

import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.enums.ResultCode;
import com.cloudwise.lcap.common.exception.BizException;
import com.cloudwise.lcap.common.exception.HttpQueryException;
import com.cloudwise.lcap.common.model.HttpGetWithEntity;
import com.cloudwise.lcap.common.utils.JsonNodeUtils;
import com.cloudwise.lcap.common.utils.JsonUtils;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.*;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHeader;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

@Slf4j
public class HttpQueryUtil {

    /**
     * 发起http调用
     *
     * @return
     */
    public static Object request(HttpEnumerable enumerable) throws HttpQueryException {
        SSLConnectionSocketFactory sslFactory = null;
        try {
            // 信任所有证书
            SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, (TrustStrategy) (chain, authType) -> true).build();
            sslFactory = new SSLConnectionSocketFactory(sslContext);
        } catch (Exception e) {
            log.error("处理Https证书异常", e);
        }
        CloseableHttpClient client = HttpClientBuilder.create().setSSLSocketFactory(sslFactory).build();
        HttpResponse response = null;

        String method = enumerable.getMethod();
        String url = enumerable.getUrl();
        Map<String, Object> header = enumerable.getHeader();
        Map<String, Object> params = enumerable.getParams();
        String requestBody = enumerable.getRequestBody();
        StringEntity stringEntity = null;
        if (null != requestBody) {
            JSONObject jsonObject = new JSONObject(requestBody);
            if ("json".equalsIgnoreCase(jsonObject.getStr("type"))){
                Object value = jsonObject.get("value");
                if (null !=value){
                    stringEntity = new StringEntity(value.toString(), "utf-8");
                }
            }else if ("raw".equalsIgnoreCase(jsonObject.getStr("type"))){
                String value = jsonObject.getStr("value");
                stringEntity = new StringEntity(value, "utf-8");
            }
        }


        Header[] headers = buildHeader(header);
        if ("get".equalsIgnoreCase(method)) {
            //url后面拼接了参数，强制截取掉，该用 params 中的参数（因为有可能前端在url中传了参数,params中由传了同名参数）
            if (url.contains("?")) {
                url = url.substring(0, url.indexOf("?"));
            }
            String urlParams = buildParams(params);
            if (!StringUtils.isEmpty(urlParams)) {
                url += "?" + urlParams;
            }
            try {
                HttpGetWithEntity httpGet = new HttpGetWithEntity(url);
                httpGet.setHeaders(headers);
                if (null != stringEntity) {
                    httpGet.setEntity(stringEntity);
                }
                response = client.execute(httpGet);
            } catch (IOException e) {
                log.error("http数据源查询错误" + e.toString());
                throw new HttpQueryException(ResultCode.HTTP_QUERY_ERROR,e.getMessage());
            }
        } else if ("post".equalsIgnoreCase(method)) {
            HttpPost post = new HttpPost(url);
            post.setHeaders(headers);
            if (null != stringEntity) {
                post.setEntity(stringEntity);
            }
            try {
                response = client.execute(post);
            } catch (IOException e) {
                log.error("http数据源查询错误" + e.toString());
                throw new BizException(ResultCode.HTTP_QUERY_ERROR);
            }
        }
        StatusLine statusLine = response.getStatusLine();
        int statusCode = statusLine.getStatusCode();
        if (statusCode == HttpStatus.SC_OK) {
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                String result = null;
                try {
                    result = EntityUtils.toString(entity, "UTF-8");
                } catch (IOException e) {
                    e.printStackTrace();
                }

                try {
                    return  JsonUtils.objectMapper.readValue(result,HashMap.class);
                } catch (Exception e) {
                    try {
                        List<Map<String, Object>> jacksonMap = JsonUtils.objectMapper.readValue(result, new TypeReference<List<Map<String, Object>>>() {});
                        return jacksonMap;
                    } catch (Exception ex) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("httpCode",statusCode);
                        map.put("data",result);
                        return  map;
                    }
                }
            }
        } else {
            Map<String, Object> data = new HashMap<>();
            data.put("httpCode",statusCode);
            data.put("msg",statusLine.getReasonPhrase());
            HttpEntity entity = response.getEntity();
            if (entity != null) {
                String result = null;
                try {
                    result = EntityUtils.toString(entity, "UTF-8");
                } catch (IOException e) {
                    e.printStackTrace();
                }
                data.put("data",result);
            }
            log.error("http数据源查询错误," + data);
            return data;
        }
        return null;
    }


    private static Header[] buildHeader(Map<String, Object> header) {
        if (header == null) {
            header = new HashMap<>();
        }
        Map<String, Object> lowCodeHeader =new HashMap<>();
        header.forEach((k,v)-> lowCodeHeader.put(k.toLowerCase(),v));
        lowCodeHeader.putIfAbsent("content-type", "application/json");

        List<BasicHeader> headers = new ArrayList<>();
        if (MapUtil.isNotEmpty(lowCodeHeader)) {
            JsonNode object = JsonNodeUtils.parseStringToJson(JsonUtils.toJSONString(lowCodeHeader));
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
}
