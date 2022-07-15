package com.cloudwise.lcap.common.enums;

public enum ResultCode {

    FAIL(1, "操作失败"),
    // 数据操作错误定义
    SUCCESS(0, "成功!"),
    BODY_NOT_MATCH(400,"请求的数据格式不符!"),
    SIGNATURE_NOT_MATCH(401,"请求的数字签名不匹配!"),
    NOT_FOUND(404, "未找到该资源!"),
    INTERNAL_SERVER_ERROR(500, "服务器内部错误!"),
    SERVER_BUSY(503,"服务器正忙，请稍后再试!"),
    REPEATED_FIELD_VALUE(422,"数据关键字段重复"),
    ASSOCIATED_DATA_NOT_EXIST(423,"关联数据不存在"),
    DATA_OUT_OF_RANGE(424,"数据超出范围"),
    DATA_NOT_EXIST(425,"数据不存在"),
    ARGUMENT_NOT_VALID(505, "请求的参数不合法"),
    FILE_FORMAT_NOT_VALID(426, "文件格式不正确")   ,
    DATA_DUPLICATE_KEY(10000, "数据重复"),

    SQL_VALIDATE_ERROR(600,"sql语句校验错误"),
    SQL_PARSE_ERROR(601,"sql语句解析错误"),
    SQL_EXEC_ERROR(602,"sql执行"),
    DATA_SOURCE_CONNECT_PARAM_NOT_FOUND(603,"数据源连接信息缺失"),
    DATA_SOURCE_CONNECT_PARAM_ERROR(603,"数据源连接信息错误"),
    HTTP_QUERY_ERROR(610,"http数据源查询错误"),
    CONNECT_FAILED(620,"数据源连接错误"),
    SQL_DB_TABLE_NOT_EXISTS(621,"数据库表未找到,请检查数据库元数据信息"),

    FILE_UN_VALID(700,"文件内容解析失败"),

    COMBINE_SINGLE_VALUE_ERROR(800,"单值复合异常"),
    COMBINE_MULTI_VALUE_LINE_ERROR(801,"多值复合异常"),
    COMBINE_MULTI_VALUE_COLUMN_ERROR(802,"多值复合异常"),
    COMBINE_SEQUENCE_COLUMN_ERROR(803,"时序值复合异常"),
    COMBINE_QUERY_NO_SUB_QUERY(804,"请为复合查询设置查询子项"),
    COMBINE_QUERY_TYPE_ERROR(805,"数据查询类型错误"),
    QUERY_IN_USE(820,"该数据查询正在被使用"),
    QUERY_REF_BY_COMBINE(821,"该数据查询正在被复合查询使用"),
    QUERY_EXECUTE_FAILED(822,"数据查询失败"),
    SUB_QUERY_EXECUTE_FAILED(823,"该数据查询正在被复合查询使用"),
    COMBINE_QUERY_DATA_VALID_FAILED(824,"复合查询数据不符合规则"),
    COMBINE_SEQUENCE_COLUMN_MULTI_PRK(825,"数据集按列复合主键列不唯一"),

    APP_IN_BIND(900,"当前应用已绑定api"),
    API_IN_BIND(901,"当前api已绑定应用"),
    CATALOG_HAS_RESOURCE(902,"当前分类有关联的api"),
    GROUP_HAS_RESOURCE(903,"当前分组下有关联的分类"),

    //导入导出相关错误码
    RESOURCE_NOT_FOUND(1000,"资源文件不存在"),
    FILE_NOT_FOUND(1001,"组件相关文件不存在")
    ;

    private Integer code;
    private String msg;

    private ResultCode(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public Integer getCode() {
        return this.code;
    }

    public String getMsg() {
        return this.msg;
    }
}
