package com.cloudwise.lcap.common;

import cn.hutool.json.JSONObject;
import com.cloudwise.lcap.common.enums.ResultCode;
import com.cloudwise.lcap.common.exception.BaseException;
import org.springframework.http.HttpStatus;

import java.lang.reflect.Type;

/**
 * created with IDEA
 *
 * @author haifeng.wang
 * @since 2019-04-08-17:08
 */
public class BaseResponse<T> {
    private Integer code;
    private String msg;
    private T data;
    /**
     * 是否是原生数据，如果想要返回原生数据，则raw=true，此时不再封装返回体，直接返回 data
     */
    //private boolean raw = false;

    public Integer getCode() {
        return this.code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public BaseResponse() {
        this.code = ResultCode.SUCCESS.getCode();
        this.msg = ResultCode.SUCCESS.getMsg();
    }

    public BaseResponse(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public  BaseResponse(Integer code, String msg, T data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public  BaseResponse(T data,boolean raw) {
        this.code = ResultCode.SUCCESS.getCode();
        this.msg = ResultCode.SUCCESS.getMsg();
        this.data = data;
    }

    public static <T> BaseResponse<T> of(Integer code, String msg, T data) {
        return new BaseResponse(code, msg, data);
    }

    public static <T> BaseResponse<T> getInstance(ResultCode dataResultCode, T data) {
        return of(dataResultCode.getCode(), dataResultCode.getMsg(), data);
    }

    public static <T> BaseResponse<T> getInstance(T data) {
        return getInstance(ResultCode.SUCCESS, data);
    }


    public static BaseResponse error(Throwable throwable) {
        return new BaseResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), throwable.getMessage());
    }

    public static BaseResponse error(BaseException e) {
        return new BaseResponse(e.getCode(), e.getMsg());
    }

    public static BaseResponse error(int code, Object... args) {
        return new BaseResponse(code, "ERROR", args);
    }

    public static BaseResponse success(Object o) {
        return new BaseResponse(ResultCode.SUCCESS.getCode(), "SUCCESS", o);
    }

    public static BaseResponse success(Object o,boolean raw) {
        return new BaseResponse(ResultCode.SUCCESS.getCode(), "SUCCESS", o);
    }
//    public boolean isRaw() {
//        return raw;
//    }
//
//    public void setRaw(boolean raw) {
//        this.raw = raw;
//    }

    @Override
    public String toString() {
        return "ResponseBean [code=" + this.code + ", msg=" + this.msg + ", data=" + this.data + "]";
    }
}
