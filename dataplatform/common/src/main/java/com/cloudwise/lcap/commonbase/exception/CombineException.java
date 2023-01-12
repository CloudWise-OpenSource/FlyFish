package com.cloudwise.lcap.commonbase.exception;

import com.cloudwise.lcap.commonbase.enums.ResultCode;
import org.springframework.util.StringUtils;

public class CombineException  extends BaseException {


    public CombineException(ResultCode resultCode, String msg) {
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