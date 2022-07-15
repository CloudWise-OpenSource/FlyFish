package com.cloudwise.lcap.api.common;

public enum DubboResultCode {

    SUCCESS("0000", "成功"),
    FAILED("0001", "通用失败错误码"),
    /**
     * 关键字段：accountId、apiName、path、method、sourceAppId、sourceAppName 参数缺失
     */
    PARAM_NOT_EXIST("0010", "参数缺失"),
    ACCOUNT_NOT_EXIST("0011", "对应的租户不存在"),
    MULTI_ACCOUNT_EXIST("0012", "存在多个租户信息"),
    MULTI_SOURCE_APP_ID("0013", "存在多个产品信息"),
    SOURCE_APP_NOT_EXISTS("0014", "产品信息不存在"),
    API_METHOD_NOT_SUPPORT("0015", "不支持的method类型"),
    SOURCE_TYPE_NOT_EXIST("0016", "未知的产品来源类型"),
    MULTI_API_NAME("0017", "apiName存在重复"),
    MULTI_PATH_METHOD("0018", "存在多个path+method重复的api信息"),
    DUPL_API_PATH_METHOD("0019", "请勿重复同步api信息,path+method相同的api已存在"),
    API_ID_NOT_EXIST("0020", "api主键缺失"),
    API_NOT_EXIST("0021", "api信息不存在"),
    ;

    private String code;
    private String msg;

    private DubboResultCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public String getCode() {
        return this.code;
    }

    public String getMsg() {
        return this.msg;
    }
}
