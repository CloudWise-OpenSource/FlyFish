package com.cloudwise.lcap.common.exception;


import com.cloudwise.lcap.common.enums.ResultCode;

/**
 * Created on 2020/11/30.
 *
 * @author allen4tech
 */
public class HttpQueryException extends BaseException {
    private static final long serialVersionUID = 1L;


    public HttpQueryException(String message) {
        super(message);
    }

    public HttpQueryException(ResultCode errorCode) {
        super(errorCode);
    }

    public HttpQueryException(ResultCode errorCode, String msg) {
        super(errorCode.getCode(),msg);
    }
}
