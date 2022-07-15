package com.cloudwise.lcap.api.common;


import java.io.Serializable;

/**
 * 通用响应类
 * @param <T>
 */
public class DubboCommonResp<T> implements Serializable {
    //响应数据
    private T data;
    //响应状态
    private String code;
    //响应提示
    private String msg;

    public DubboCommonResp() {
    }

    public DubboCommonResp(String code, T data) {
        this.data = data;
        this.code = code;
    }

    public DubboCommonResp(String code) {
        this.data = this.data;
        this.code = code;
    }

    public DubboCommonResp(String code, String msg, T data) {
        this.data = data;
        this.code = code;
        this.msg = msg;
    }

    public static <F> DubboCommonResp<F> generateDubboSuccessResp() {
        return new DubboCommonResp("100000", (Object)null);
    }

    public DubboCommonResp<T> generateSuccessResp(T data) {
        return new DubboCommonResp("100000", data);
    }

    public static <F> DubboCommonResp<F> generateDubboSuccessResp(F data) {
        return new DubboCommonResp("100000", data);
    }

    public DubboCommonResp<T> generateSuccessResp() {
        return new DubboCommonResp("100000", (Object)null);
    }

    public DubboCommonResp<T> getFailResp(String code) {
        return new DubboCommonResp(code, (Object)null);
    }

    public DubboCommonResp<T> getFailResp(String code, String msg) {
        return new DubboCommonResp(code, msg, (Object)null);
    }

    public static <F> DubboCommonResp<F> generateDubboFailResp(String code, String msg) {
        return new DubboCommonResp(code, msg, (Object)null);
    }

    public static <F> DubboCommonResp<F> generateDubboFailResp(F data, String msg) {
        return new DubboCommonResp("100001", msg, data);
    }

    public DubboCommonResp<T> generateFailResp() {
        return new DubboCommonResp("100001", (Object)null);
    }

    public boolean isSuccess() {
        return "100000".equals(this.code);
    }

    public static String getSuccess_code() {
        return "100000";
    }

    public static String getError_code() {
        return "100001";
    }

    public static String getPart_error_code() {
        return "100018";
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("DubboCommonResp{");
        sb.append("data=").append(this.data);
        sb.append(", code='").append(this.code).append('\'');
        sb.append(", msg='").append(this.msg).append('\'');
        sb.append('}');
        return sb.toString();
    }
}

