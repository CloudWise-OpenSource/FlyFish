package com.cloudwise.lcap.controller;

import cn.hutool.core.map.MapUtil;
import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.commonbase.base.RawResponse;
import com.cloudwise.lcap.commonbase.enums.ApiMethod;
import com.cloudwise.lcap.commonbase.exception.BizException;
import com.cloudwise.lcap.commonbase.exception.ParameterException;
import com.cloudwise.lcap.commonbase.util.JsonNodeUtils;
import com.cloudwise.lcap.commonbase.util.JsonUtils;
import com.cloudwise.lcap.datasource.model.HttpDeleteWithEntity;
import com.cloudwise.lcap.datasource.model.HttpGetWithEntity;
import com.cloudwise.lcap.dto.HttpRequestDTO;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.*;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.message.BasicHeader;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.net.ssl.SSLContext;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 第三方接口发起调用，
 * 为解决跨域,由后端转发请求
 */
@Slf4j
@RestController
@RequestMapping("/apiProxy")
public class ApiProxyController {

    static HttpClient client = null;

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

    private static final List<String> ignoreHeader = Arrays.asList("content-length", "host", "user-agent", "origin", "referer");

    @PostMapping
    public RawResponse httpRequest(HttpServletRequest request, @RequestBody HttpRequestDTO httpRequestDTO) {
        String method = httpRequestDTO.getMethod();
        if (StringUtils.isAnyBlank(httpRequestDTO.getPath(), method)) {
            log.error("参数缺失,path和method参数缺失");
            throw new ParameterException("参数缺失,path和method参数缺失");
        }

        Map<String, Object>  reqHeaders = new HashMap<>();
        httpRequestDTO.getReqHeaders().forEach((key,value)->reqHeaders.putIfAbsent(key.trim().toLowerCase(),value));
//        reqHeaders.putIfAbsent(HTTP_COOKIE.toLowerCase(), ThreadLocalContext.get(HTTP_COOKIE));
//        reqHeaders.putIfAbsent(aopsSessionId.toLowerCase(), ThreadLocalContext.get(aopsSessionId));
//        reqHeaders.putIfAbsent(ACCOUNT_ID.toLowerCase(), ThreadLocalContext.get(ACCOUNT_ID));
//        reqHeaders.putIfAbsent(USER_ID.toLowerCase(), ThreadLocalContext.get(USER_ID));
        httpRequestDTO.setReqHeaders(reqHeaders);
        try {
            return request(httpRequestDTO);
        } catch (Exception e) {
            throw new BizException("请确认api是否可以调用");
        }
    }

    /**
     * 发起http调用
     *
     * @return
     */
    public static RawResponse request(HttpRequestDTO requestDTO) {
        String url = requestDTO.getPath();
        Map<String, Object> params = new HashMap<>();
        if (MapUtil.isNotEmpty(requestDTO.getReqParams())){
            params =  requestDTO.getReqParams();
        }

        //url后面拼接了参数，强制截取掉，该用 params 中的参数（因为有可能前端在url中传了参数,params中由传了同名参数）
        if (url.contains("?")) {
            int endIndex = url.indexOf("?");
            String paramPart = url.substring(endIndex + 1);
            url = url.substring(0, endIndex);
            Map<String, Object> stringObjectMap = parseParamPart(paramPart);
            stringObjectMap.forEach(params::putIfAbsent);
        }
        String urlParams = buildParams(params);
        if (!StringUtils.isEmpty(urlParams)) {
            url += "?" + urlParams;
        }

        HttpEntityEnclosingRequestBase requestBase = new HttpGetWithEntity(url);
        ApiMethod methodType = ApiMethod.getMethod(requestDTO.getMethod());
        if (null == methodType) {
            log.error("暂不支持的请求类型,method:{}", requestDTO.getMethod());
            throw new ParameterException("暂不支持的请求类型" + requestDTO.getMethod());
        }
        if (methodType.equals(ApiMethod.GET)) {
            requestBase = new HttpGetWithEntity(url);
        } else if (methodType.equals(ApiMethod.POST)) {
            requestBase = new HttpPost(url);
        } else if (methodType.equals(ApiMethod.PUT)) {
            requestBase = new HttpPut(url);
        } else if (methodType.equals(ApiMethod.DELETE)) {
            requestBase = new HttpDeleteWithEntity(url);
        }

        try {
            Header[] headers = buildHeader(requestDTO.getReqHeaders());
            requestBase.setHeaders(headers);
            if (StringUtils.isNotBlank(requestDTO.getReqBody())) {
                HttpEntity httpEntity = new StringEntity(new JSONObject(requestDTO.getReqBody()).toString(), "utf-8");
                requestBase.setEntity(httpEntity);
            }
            HttpResponse response = client.execute(requestBase);
            StatusLine statusLine = response.getStatusLine();
            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == HttpStatus.SC_OK) {
                HttpEntity entity = response.getEntity();
                String result = null;
                if (entity != null) {
                    try {
                        result = EntityUtils.toString(entity, "UTF-8");
                    } catch (IOException e) {
                        log.error("http请求响应成功,结果解析异常,exception:{}", e.getMessage());
                    }
                }
                RawResponse rawResponse = new RawResponse();
                rawResponse.putAll(JsonUtils.jsonToMap(result));
                return rawResponse;
            } else {
                RawResponse rawResponse = new RawResponse();
                rawResponse.put("statusCode", statusCode);
                rawResponse.put("errorMsg", statusLine.getReasonPhrase());
                HttpEntity entity = response.getEntity();
                String result = null;
                if (entity != null) {
                    try {
                        result = EntityUtils.toString(entity, "UTF-8");
                    } catch (IOException e) {
                        e.printStackTrace();
                        log.error("http请求响应成功,结果解析异常,exception:{}", e.getMessage());
                    }
                }
                rawResponse.put("result", result);
                return rawResponse;
            }
        } catch (IOException e) {
            log.error("http数据源查询错误" + e);
        }
        return null;
    }

    private static Map<String, Object> parseParamPart(String paramPart) {
        Map<String, Object> params = new HashMap<>();
        if (StringUtils.isNotBlank(paramPart)) {
            String[] split = paramPart.split("&");
            for (int i = 0; i < split.length; i++) {
                String kv = split[i];
                if (StringUtils.isEmpty(kv)) {
                    continue;
                }
                String[] split1 = kv.split("=");
                if (split1.length != 2) {
                    continue;
                }
                String key = split1[0];
                String value = split1[1];
                params.put(key, value);
            }
        }
        return params;
    }


    private static Header[] buildHeader(Map<String, Object> header) {
        if (header == null) {
            header = new HashMap<>();
        }
        Map<String, Object> headerToLowCode = new HashMap<>();
        header.forEach((k, v) -> headerToLowCode.put(k.trim().toLowerCase(), v));
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
}
