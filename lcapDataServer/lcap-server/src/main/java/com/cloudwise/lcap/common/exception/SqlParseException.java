package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

public class SqlParseException  extends BaseException {

    public SqlParseException(String msg) {
        super(ResultCode.SQL_PARSE_ERROR.getCode(), msg);
    }


    public SqlParseException() {
        super(ResultCode.SQL_PARSE_ERROR.getCode(),ResultCode.SQL_PARSE_ERROR.getMsg());
    }
}
