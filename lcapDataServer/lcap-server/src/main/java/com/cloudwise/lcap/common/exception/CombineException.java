package com.cloudwise.lcap.common.exception;

import com.cloudwise.lcap.common.enums.ResultCode;
import org.apache.commons.lang3.StringUtils;

public class CombineException  extends BaseException {


    public CombineException(ResultCode resultCode,String msg) {
        if (StringUtils.isEmpty(msg)){
            msg = resultCode.getMsg();
        }
        this.code = resultCode.getCode();
        this.setMsg(msg);
    }

    public CombineException(ResultCode resultCode) {
        super(resultCode.getCode(),resultCode.getMsg());
    }
}