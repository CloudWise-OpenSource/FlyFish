package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

public class FileUnValidateException extends BaseException {

    public FileUnValidateException(String msg) {
        super(ResultCode.FILE_UN_VALID.getCode(), msg);
    }


    public FileUnValidateException() {
        super(ResultCode.FILE_UN_VALID.getCode(),ResultCode.FILE_UN_VALID.getMsg());
    }
}
