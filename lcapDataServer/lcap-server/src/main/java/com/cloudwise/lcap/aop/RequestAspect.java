package com.cloudwise.lcap.aop;

import cn.hutool.core.collection.CollectionUtil;
import com.cloudwise.lcap.common.exception.UnAuthorizedException;
import com.cloudwise.lcap.common.utils.CookieUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.RequestFacade;
import org.apache.catalina.connector.ResponseFacade;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Enumeration;
import java.util.List;

/**
 * 基于动态代理的切面日志处理
 * ProceedingJoinPoint 继承自 JoinPoint
 * 其原理与 MethodInvocation 类似,
 */
@Slf4j
@Aspect
@Component
public class RequestAspect {

    private static String cookieName = "FLY_FISH_V2.0";

    static AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Value("${ignore.path}")
    private List<String> ignorePattern;

    @Value("${server.servlet.context-path}")
    private String servletContentPath;



    @Around(value = "within(com.cloudwise.lcap.*.controller..*)")
    public Object checkAndPerformance(ProceedingJoinPoint point) throws Throwable {
        long startTime = System.currentTimeMillis();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (null == attributes) {
            return point.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        String method = request.getMethod();

        boolean white = false;
        if (CollectionUtil.isNotEmpty(ignorePattern)){
            String patternUrl = request.getRequestURI().replace(servletContentPath,"");
            // path路径是否符合pattern的规范
            for (String pattern : ignorePattern) {
                if (antPathMatcher.match(pattern, patternUrl)){
                    white = true;
                    break;
                }
            }
        }
        if (!white) {
            String cookieValue = CookieUtils.getCookieValue(request, cookieName);
            if (StringUtils.isEmpty(cookieValue)){
                log.error("本地获取cookie为空，cookieName=aops-sessionId不存在");
                throw new UnAuthorizedException();
            }
        }

        String bodyStr = null;
        String url;
        if (!"GET".equals(method)) {
            // Get method
            url = request.getRequestURI();
            Object[] params = point.getArgs();
            for (Object obj : params) {
                if (obj == null) {
                    continue;
                }

                if (obj instanceof RequestFacade || obj instanceof ResponseFacade) {
                    continue;
                }

                Class classObj = obj.getClass();
                bodyStr = "  " + classObj.getSimpleName() + ":" + obj;
            }
        } else {
            url = getPathParam(request);
            bodyStr = request.getQueryString();
        }

        log.info("<=============================");
        log.info("Request method:{}, url:{}, param:{}", method, url, bodyStr);

        String cookieValue = CookieUtils.getCookieValue(request, cookieName);
        if (StringUtils.isEmpty(cookieValue)){
            log.error("本地获取cookie为空，cookieName=aops-sessionId不存在");
            throw new UnAuthorizedException();
        }

        Object response = point.proceed();
        int status = 0;
        HttpServletResponse response1 = attributes.getResponse();
        if (null != response1) {
            status = response1.getStatus();
        }

        log.info("Performance monitor, status code:{}, cost time:{} ms", status, System.currentTimeMillis() - startTime);
        log.info("=============================>");
        return response;
    }


    public static String getPathParam(HttpServletRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(request.getRequestURI());
        Enumeration<String> parameterNames = request.getParameterNames();
        if (parameterNames.hasMoreElements()){
            builder.append("?");
            while (parameterNames.hasMoreElements()) {
                String name = parameterNames.nextElement();
                builder.append(name).append("=").append(request.getParameter(name)).append("&");
            }
        }

        return builder.toString();
    }
}
