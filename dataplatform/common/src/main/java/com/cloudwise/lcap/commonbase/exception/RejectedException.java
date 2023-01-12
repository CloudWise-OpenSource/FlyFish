package com.cloudwise.lcap.commonbase.exception;

/**
 * created with IDEA
 *
 * @author haifeng.wang
 * @since 2019-12-18-17:18
 */
public class RejectedException extends BaseException {
    public RejectedException(String msgKey) {
        super(msgKey);
    }


    public RejectedException(int code,String msgKey) {
        super(code, msgKey);
    }

}
