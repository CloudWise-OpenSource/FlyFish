package com.cloudwise.lcap.commonbase.aop;


import com.cloudwise.lcap.commonbase.base.BaseResponse;
import com.cloudwise.lcap.commonbase.base.RawResponse;
import com.cloudwise.lcap.commonbase.exception.*;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * @description: 全局返回体统一封装
 */
@RestControllerAdvice
public class ResponseExceptionHandler extends ResponseEntityExceptionHandler implements ResponseBodyAdvice<Object> {
    protected static final Log log = LogFactory.getLog(ResponseExceptionHandler.class);

    private static final String[] EXCLUDE = {
            "Swagger2Controller",
            "Swagger2ControllerWebMvc",
            "ApiResourceController"
    };
    /**
     * 该方法继承自ResponseBodyAdvice
     */
    @Override
    public boolean supports(MethodParameter methodParameter, Class aClass) {
        return true;
    }

    /**
     * 该方法继承自ResponseBodyAdvice
     */
    @Override
    public Object beforeBodyWrite(Object o, MethodParameter methodParameter, MediaType mediaType, Class aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
        // 避免swagger失效
        if (Arrays.asList(EXCLUDE).contains(methodParameter.getDeclaringClass().getSimpleName())) {
            return o;
        }
        if (o instanceof BaseResponse || o instanceof RawResponse) {
            return o;
        } else if (o instanceof BaseException) {
            return new BaseException(o);
        } else if (o instanceof Throwable) {
            log.error("server error", (Throwable) o);
            return new BaseException((Throwable) o);
        }
//        else if (o instanceof Map) {
//            return new BaseResponse(0, o.toString());
//        }
        else {
            return BaseResponse.success(o);
        }
    }


    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public BaseResponse<String> exception(RuntimeException e) {
        log.error("server error", e);
        return BaseResponse.error(e);
    }

    /**
     * 200类型异常
     */
    @ResponseStatus(value = HttpStatus.OK)
    @ExceptionHandler(BaseException.class)
    ResponseEntity<BaseResponse> handleBizException(HttpServletRequest req, BaseException e) {
        return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.error(e));
    }

    /**
     * 400类型异常
     */
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ParameterException.class})
    ResponseEntity<BaseResponse> handleParameterException(HttpServletRequest req, ParameterException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.error(e));
    }

    /**
     * 401登陆异常
     */
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnAuthorizedException.class)
    ResponseEntity<BaseResponse> handleUnauthorizedException(HttpServletRequest req, UnAuthorizedException e) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(BaseResponse.error(e));
    }

    /**
     * 403禁止登陆
     */
    @ResponseStatus(value = HttpStatus.FORBIDDEN)
    @ExceptionHandler(RejectedException.class)
    ResponseEntity<BaseResponse> handleRejectedException(HttpServletRequest req, RejectedException e) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(BaseResponse.error(e));
    }

    /**
     * 404类型异常
     */
    @ResponseStatus(value = HttpStatus.NOT_FOUND)
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<BaseResponse> handleNotFoundException(HttpServletRequest req, NotFoundException e) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(BaseResponse.error(e));
    }

    /**
     * 412类型异常
     */
    @ResponseStatus(value = HttpStatus.PRECONDITION_FAILED)
    @ExceptionHandler(PreFailedException.class)
    ResponseEntity<BaseResponse> handlePreFailedException(HttpServletRequest req, PreFailedException e) {

        return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body(BaseResponse.error(e));
    }

    /**
     * 500类型异常
     */
    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(BizException.class)
    ResponseEntity<BaseResponse> handleBizException(HttpServletRequest req, BizException e) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(BaseResponse.error(e));
    }

    /**
     * 修改实现方式,不使用默认方式
     */
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException e, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.error(new BaseException(e)));
        //默认的实现，最终调用handleExceptionInternal()方法
        // return handleExceptionInternal(ex, null, headers, status, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers, HttpStatus status, WebRequest request) {
        String errorList = ex
            .getBindingResult()
            .getFieldErrors()
            .stream()
            .map(fieldError -> fieldError.getDefaultMessage())
            .collect(Collectors.joining("; "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(BaseResponse.error(new ParameterException(errorList)));
    }

    /**
     * 最终所有的异常最终都会走到这个方法,而在交给这个方法前那些异常处理方法都未进行任何业务逻辑操作（特别是传入的body都是 null）
     *
     * @return
     */
    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers, HttpStatus status, WebRequest request) {
        if (HttpStatus.INTERNAL_SERVER_ERROR.equals(status)) {
            request.setAttribute("javax.servlet.error.exception", ex, WebRequest.SCOPE_REQUEST);
        }
        return new ResponseEntity<Object>(body, headers, status);
    }


}
