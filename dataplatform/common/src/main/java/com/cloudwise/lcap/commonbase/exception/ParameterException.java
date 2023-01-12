package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;

/**
 * @author haifeng.wang
 */
public class ParameterException extends BaseException {

    public ParameterException(String msg) {
        super(ResultCode.ARGUMENT_NOT_VALID.getCode(), msg);
    }



    public ParameterException(ResultCode resultCode) {
        super(resultCode.getCode(), resultCode.getMsg());
    }

    public ParameterException(ResultCode resultCode,String msg) {
        super(resultCode.getCode(), msg);
    }

}
