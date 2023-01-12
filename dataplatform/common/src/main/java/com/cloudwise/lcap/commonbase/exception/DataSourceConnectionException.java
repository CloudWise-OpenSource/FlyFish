package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

public class DataSourceConnectionException extends BaseException {

    public DataSourceConnectionException(String msg) {
        super(ResultCode.CONNECT_FAILED.getCode(), msg);
    }


    public DataSourceConnectionException() {
        super(ResultCode.CONNECT_FAILED.getCode(),ResultCode.CONNECT_FAILED.getMsg());
    }
}
