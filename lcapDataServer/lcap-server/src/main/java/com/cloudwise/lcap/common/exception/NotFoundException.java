package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

/**
 * @author haifeng.wang
 */
public class NotFoundException extends BaseException {

    public NotFoundException(String msg) {
        super(ResultCode.NOT_FOUND.getCode(), msg);
    }

    public NotFoundException() {
        super(ResultCode.NOT_FOUND.getCode(), ResultCode.NOT_FOUND.getMsg());
    }
}
