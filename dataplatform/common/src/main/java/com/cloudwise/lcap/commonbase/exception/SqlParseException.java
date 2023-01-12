package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

public class SqlParseException  extends BaseException {

    public SqlParseException(String msg) {
        super(ResultCode.SQL_PARSE_ERROR.getCode(), msg);
    }


    public SqlParseException() {
        super(ResultCode.SQL_PARSE_ERROR.getCode(),ResultCode.SQL_PARSE_ERROR.getMsg());
    }
}
