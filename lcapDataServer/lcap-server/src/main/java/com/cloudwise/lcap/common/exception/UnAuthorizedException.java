package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

/**
 * @author haifeng.wang
 */
public class UnAuthorizedException extends BaseException {

    public UnAuthorizedException(String msg) {
        super(msg);
    }



    public UnAuthorizedException() {
        super(ResultCode.SIGNATURE_NOT_MATCH);
    }

    public UnAuthorizedException(String msgKey, int code) {
        super(code, msgKey);
    }
}
