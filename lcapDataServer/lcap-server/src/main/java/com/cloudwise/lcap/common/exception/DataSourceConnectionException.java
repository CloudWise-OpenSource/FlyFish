package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;

public class DataSourceConnectionException extends BaseException {

    public DataSourceConnectionException(String msg) {
        super(ResultCode.CONNECT_FAILED.getCode(), msg);
    }


    public DataSourceConnectionException() {
        super(ResultCode.CONNECT_FAILED.getCode(),ResultCode.CONNECT_FAILED.getMsg());
    }
}
