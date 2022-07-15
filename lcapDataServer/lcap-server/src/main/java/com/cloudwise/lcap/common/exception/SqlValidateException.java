package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

public class SqlValidateException extends BaseException {

    public SqlValidateException(String msg) {
        super(ResultCode.SQL_VALIDATE_ERROR.getCode(), msg);
    }


    public SqlValidateException() {
        super(ResultCode.SQL_VALIDATE_ERROR.getCode(),ResultCode.SQL_VALIDATE_ERROR.getMsg());
    }
}
