package com.cloudwise.lcap.commonbase.aop;

import cn.hutool.core.collection.CollectionUtil;
import com.auth0.jwt.interfaces.Claim;
import com.baomidou.mybatisplus.core.conditions.AbstractWrapper;
import com.cloudwise.lcap.commonbase.exception.UnAuthorizedException;
import com.cloudwise.lcap.commonbase.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.connector.RequestFacade;
import org.apache.catalina.connector.ResponseFacade;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;

import static com.cloudwise.lcap.commonbase.contants.Constant.*;

/**
 * 基于动态代理的切面日志处理 ProceedingJoinPoint 继承自 JoinPoint 其原理与 MethodInvocation 类似,
 */
@Slf4j
@Aspect
@Component
public class RequestAspect {
    static AntPathMatcher antPathMatcher = new AntPathMatcher();


//    @Around(value = "within(com.cloudwise.lcap.devserver.controller..*)||within(com.cloudwise.lcap.controller..*)")
//    public Object checkAndPerformance(ProceedingJoinPoint point) throws Throwable {
//        long startTime = System.currentTimeMillis();
//        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//        if (null == attributes) {
//            return point.proceed();
//        }
//
//        HttpServletRequest request = attributes.getRequest();
//        String method = request.getMethod();
//        boolean white = false;
//        if (CollectionUtil.isNotEmpty(ignorePattern)) {
//            String patternUrl = request.getRequestURI();
//            // path路径是否符合pattern的规范
//            for (String pattern : ignorePattern) {
//                if (antPathMatcher.match(pattern, patternUrl)) {
//                    white = true;
//                    break;
//                }
//            }
//        }
//
//        Map<String, String> context = new HashMap<>();
//        String accountId = request.getHeader(ACCOUNT_ID);
//        String userId = request.getHeader(USER_ID);
//        String doucCookie = request.getHeader(HTTP_COOKIE);
//        String aopsSession = null;
//        if (StringUtils.isNotBlank(doucCookie)) {
//            context.putIfAbsent(HTTP_COOKIE, doucCookie);
//            String[] split = doucCookie.split(";");
//            for (String keyValue : split) {
//                if (keyValue.trim().split("=")[0].equalsIgnoreCase(aopsSessionId)){
//                    aopsSession = keyValue.trim().split("=")[1];
//                    context.putIfAbsent(aopsSessionId, aopsSession);
//                }
//            }
//        }
//
//        if (StringUtils.isNotBlank(request.getHeader("x-application-share-url"))) {
//            String shareKey = request.getHeader("x-application-share-url");
//            context.put(share_Key, shareKey);
//            //分享大屏预览地址信息
//            String shareKeyCookie = applicationShareCookieName + "-" + shareKey;
//            Cookie[] cookies = request.getCookies();
//            if (null != cookies && Arrays.stream(cookies).anyMatch(o -> o.getName().equalsIgnoreCase(shareKeyCookie))) {
//                Cookie cookie = Arrays.stream(cookies).filter(o -> o.getName().equalsIgnoreCase(shareKeyCookie)).findFirst().get();
//                String cookieValue = cookie.getValue();
//                Map<String, Claim> stringClaimMap = JwtUtil.verifyToken(cookieValue);
//                accountId = stringClaimMap.get(ACCOUNT_ID).asString();
//                userId = stringClaimMap.get(USER_ID).asString();
//                context.put(applicationShareCookieName, cookieValue);
//            }
//        } else if (StringUtils.isEmpty(aopsSession) && !white) {
//            log.error("接口认证失败");
//            throw new UnAuthorizedException("接口认证失败");
//        } else {
//            if (StringUtils.isEmpty(accountId)) {
//                log.error("接口认证失败");
//                throw new UnAuthorizedException("接口认证失败");
//            }
//        }
//        log.info("userId:{},accountId:{}", userId, accountId);
//        context.put(USER_ID, userId);
//        context.put(ACCOUNT_ID, accountId);
//        ThreadLocalContext.setContext(context);
//
//        String bodyStr = null;
//        String url;
//        if (!"GET".equals(method)) {
//            // Get method
//            url = request.getRequestURI();
//            Object[] params = point.getArgs();
//            for (Object obj : params) {
//                if (obj == null) {
//                    continue;
//                }
//
//                if (obj instanceof RequestFacade || obj instanceof ResponseFacade) {
//                    continue;
//                }
//
//                Class classObj = obj.getClass();
//                bodyStr = "  " + classObj.getSimpleName() + ":" + obj;
//            }
//        } else {
//            url = getPathParam(request);
//            bodyStr = request.getQueryString();
//        }
//        if (StringUtils.isNotBlank(bodyStr) && bodyStr.length() > 3000) {
//            bodyStr = bodyStr.substring(0, 3000);
//        }
//        log.info("<=============================");
//        log.info("Request with userId:{},accountId:{},method:{}, url:{}, param:{}", userId, accountId, method, url,
//                bodyStr);
//
//        Object response = point.proceed();
//        int status = 0;
//        HttpServletResponse response1 = attributes.getResponse();
//        if (null != response1) {
//            status = response1.getStatus();
//        }
//
//        log.info("Performance monitor, status code:{}, cost time:{} ms", status,
//                System.currentTimeMillis() - startTime);
//        log.info("=============================>");
//        return response;
//    }
    @Around(value = "within(com.cloudwise.lcap.devserver.controller..*)||within(com.cloudwise.lcap.controller..*)")
    public Object checkAndPerformance(ProceedingJoinPoint point) throws Throwable {
        long startTime = System.currentTimeMillis();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (null == attributes) {
            return point.proceed();
        }
        String token = "";
        HttpServletRequest request = attributes.getRequest();
        String method = request.getMethod();
//        Cookie[] cookies = request.getCookies();
//        if (cookies != null) {
//            for (Cookie cookie : cookies) {
//                if (cookie.getName().equals("token")) {
//                    token = cookie.getValue();
//                }
//            }
//        }

        String bodyStr = "";
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
        if (StringUtils.isNotBlank(bodyStr) && bodyStr.length() > 3000) {
            bodyStr = bodyStr.substring(0, 3000);
        }
        log.info("<=============================");
        log.info("Request with method:{}, url:{}, param:{}", method, url,
                bodyStr);

        Object response = point.proceed();
        int status = 0;
        HttpServletResponse response1 = attributes.getResponse();
        if (null != response1) {
            status = response1.getStatus();
        }

        log.info("Performance monitor, status code:{}, cost time:{} ms", status,
                System.currentTimeMillis() - startTime);
        log.info("=============================>");
        return response;
    }

    @Pointcut("execution(public * com.baomidou.mybatisplus.core.mapper.BaseMapper.selectOne(..))")
    public void selectOneAspect() {
    }

    @Before("selectOneAspect()")
    public void beforeSelect(JoinPoint point) {
        Object arg = point.getArgs()[0];
        if (arg instanceof AbstractWrapper) {
            arg = (AbstractWrapper) arg;
            ((AbstractWrapper) arg).last("limit 1");
        }
    }

    public static String getPathParam(HttpServletRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(request.getRequestURI());
        Enumeration<String> parameterNames = request.getParameterNames();
        if (parameterNames.hasMoreElements()) {
            builder.append("?");
            while (parameterNames.hasMoreElements()) {
                String name = parameterNames.nextElement();
                builder.append(name).append("=").append(request.getParameter(name)).append("&");
            }
        }

        return builder.toString();
    }
}
