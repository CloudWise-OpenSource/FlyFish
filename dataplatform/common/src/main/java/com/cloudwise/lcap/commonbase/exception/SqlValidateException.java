package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

public class SqlValidateException extends BaseException {

    public SqlValidateException(String msg) {
        super(ResultCode.SQL_VALIDATE_ERROR.getCode(), msg);
    }


    public SqlValidateException() {
        super(ResultCode.SQL_VALIDATE_ERROR.getCode(),ResultCode.SQL_VALIDATE_ERROR.getMsg());
    }
}
