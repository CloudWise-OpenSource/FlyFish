package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

public class SqlExecException extends BaseException {

    public SqlExecException(String msg) {
        super(ResultCode.SQL_EXEC_ERROR.getCode(), msg);
    }

    public SqlExecException(ResultCode resultCode) {
        super(resultCode.getCode(), resultCode.getMsg());
    }

    public SqlExecException(ResultCode resultCode,String msg) {
        super(resultCode.getCode(), msg);
    }


    public SqlExecException() {
        super(ResultCode.SQL_EXEC_ERROR.getCode(),ResultCode.SQL_EXEC_ERROR.getMsg());
    }
}
