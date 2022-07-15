package com.cloudwise.lcap.common.exception;


import com.cloudwise.lcap.common.enums.ResultCode;

/**
 * Created on 2020/11/30.
 *
 * @author allen4tech
 */
public class BizException extends BaseException {
    private static final long serialVersionUID = 1L;


    public BizException(String message) {
        super(message);
    }

    public BizException(ResultCode errorCode) {
        super(errorCode);
    }

    public BizException(ResultCode errorCode,String msg) {
        super(errorCode.getCode(),msg);
    }
}
