package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String msg) {
        super(ResultCode.FILE_NOT_FOUND.getCode(), msg);
    }


    public ResourceNotFoundException(ResultCode resultCode) {
        super(resultCode.getCode(), resultCode.getMsg());
    }

}
