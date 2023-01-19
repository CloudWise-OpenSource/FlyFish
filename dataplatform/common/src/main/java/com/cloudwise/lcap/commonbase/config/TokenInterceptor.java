package com.cloudwise.lcap.commonbase.config;

import cn.hutool.core.util.StrUtil;
import com.cloudwise.lcap.commonbase.threadlocal.ThreadLocalContext;
import com.cloudwise.lcap.commonbase.util.JwtUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class TokenInterceptor implements HandlerInterceptor {

    // 注入jwt工具类
    @Autowired
    private JwtUtils jwtUtils;


    // 重写 前置拦截方法
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String token = "";
        Map<String, String> context = new HashMap<>();
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    token = cookie.getValue();
                }
            }
        }
        if (StrUtil.isBlank(token)) {
            response.setStatus(401);
            return false;
        } else {
            // 3、解析token
            Claims claim = jwtUtils.getClaimsByToken(token);
            if (null == claim) {
                response.setStatus(401);
                Cookie cookie = new Cookie("token", null);
                cookie.setMaxAge(0);
                response.addCookie(cookie);
                return false;
//                throw new BaseException(ResultCode.TOKEN_ERROR.getCode(), ResultCode.TOKEN_ERROR.getMsg());
            }
            // 4、判断 token 是否过期
            Date expiration = claim.getExpiration();
            boolean tokenExpired = jwtUtils.isTokenExpired(expiration);
            if (tokenExpired) {
                response.setStatus(401);
                Cookie cookie = new Cookie("token", null);
                cookie.setMaxAge(0);
                response.addCookie(cookie);
                return false;
//                throw new BaseException(ResultCode.TOKEN_EXPIRE.getCode(), ResultCode.TOKEN_EXPIRE.getMsg());
            }

            // 5、 从 token 中获取员工信息
            String subject = claim.getSubject();
            if (null == subject) {
                response.setStatus(401);
                Cookie cookie = new Cookie("token", null);
                cookie.setMaxAge(0);
                response.addCookie(cookie);
                return false;
//                throw new BaseException(ResultCode.TOKEN_NOTFOUND.getCode(), ResultCode.TOKEN_NOTFOUND.getMsg());
            }
            // 7、成功后 设置想设置的属性，比如员工姓名
//            request.setAttribute("userId", subject);
            context.put("userId", subject);
            context.put("accountId", "110");
            ThreadLocalContext.setContext(context);
        }
        return true;
    }


    @Override
    public void postHandle(HttpServletRequest httpServletRequest,
                           HttpServletResponse httpServletResponse,
                           Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest,
                                HttpServletResponse httpServletResponse,
                                Object o, Exception e) throws Exception {
    }
}