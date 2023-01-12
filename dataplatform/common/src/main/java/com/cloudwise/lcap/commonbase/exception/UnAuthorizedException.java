package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

/**
 * @author haifeng.wang
 */
public class UnAuthorizedException extends BaseException {

    public UnAuthorizedException(String msg) {
        super(ResultCode.SIGNATURE_NOT_MATCH.getCode(), msg);
    }
    

    public UnAuthorizedException() {
        super(ResultCode.SIGNATURE_NOT_MATCH);
    }

    public UnAuthorizedException(String msgKey, int code) {
        super(code, msgKey);
    }
}
