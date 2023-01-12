package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

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
