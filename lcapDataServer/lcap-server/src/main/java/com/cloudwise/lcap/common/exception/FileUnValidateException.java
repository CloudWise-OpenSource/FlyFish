package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

public class FileUnValidateException extends BaseException {

    public FileUnValidateException(String msg) {
        super(ResultCode.FILE_UN_VALID.getCode(), msg);
    }


    public FileUnValidateException() {
        super(ResultCode.FILE_UN_VALID.getCode(),ResultCode.FILE_UN_VALID.getMsg());
    }
}
