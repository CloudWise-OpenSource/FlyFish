package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String msg) {
        super(ResultCode.FILE_NOT_FOUND.getCode(), msg);
    }


    public ResourceNotFoundException(ResultCode resultCode) {
        super(resultCode.getCode(), resultCode.getMsg());
    }

}
