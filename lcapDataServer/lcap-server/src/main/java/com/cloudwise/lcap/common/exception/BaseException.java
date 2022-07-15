package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;
import lombok.*;
import org.springframework.http.HttpStatus;


@Getter
@Setter
@ToString
public class BaseException extends RuntimeException {
    protected Integer code;
    protected Object[] args;
    private String msg;

    public BaseException() {
        this(ResultCode.INTERNAL_SERVER_ERROR);
    }

    public BaseException(Object o) {
        super(((BaseException) o).getMsg(),(BaseException) o);
        BaseException o1 = (BaseException) o;
        this.code = o1.getCode();
        this.msg = o1.getMsg();
    }

    public BaseException(ResultCode errorCode) {
        this.code = errorCode.getCode();
        this.msg = super.getMessage();
    }

    public BaseException(String message) {
        this(HttpStatus.INTERNAL_SERVER_ERROR.value(), message);
    }


    public BaseException(Integer code, String msg) {
        this.msg = msg;
        this.code = code;
    }


    public BaseException(Throwable cause) {
        super(cause);
        this.code = HttpStatus.INTERNAL_SERVER_ERROR.value();
        this.msg = cause.toString();
    }



}

