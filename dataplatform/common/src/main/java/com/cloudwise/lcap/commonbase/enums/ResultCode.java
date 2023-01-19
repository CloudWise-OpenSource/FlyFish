package com.cloudwise.lcap.commonbase.enums;

public enum ResultCode {

    FAIL(1, "操作失败"),
    // 数据操作错误定义
    SUCCESS(0, "成功!"),
    BODY_NOT_MATCH(400,"请求的数据格式不符!"),
    SIGNATURE_NOT_MATCH(401,"请求的数字签名不匹配!"),
    TOKEN_ERROR(401,"token 解析错误!"),
    TOKEN_EXPIRE(401,"token已过期，请重新登录"),
    TOKEN_NOTFOUND(401,"用户不存在"),
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
    FILE_NOT_FOUND(1001,"组件相关文件不存在"),
    //新加入
    ALREADY_EXISTS(1003,"资源名称已存在"),
    NO_AUTH(3004,"操作失败, 无权限"),
    EXISTS_ALREADY_PROJECT_REF(3005,"删除失败, 项目中存在组件或者应用"),
    PROJECT_EXISTS_ALREADY(3006,"编辑失败, 项目名称已存在"),
    EXISTS_ALREADY_COMPONENT_REF(3007,"删除失败, 该组件被使用, 不允许删除"),
    DB_NOT_FOUND(3008, "未找到该资源!"),
    EXISTS_ALREADY_COMPONENT_CATEGORY(3009,"删除失败, 该组件分类还有子分类, 不允许删除"),
    EXISTS_ALREADY_COMPONENT_IN_CATEGORY(3010,"删除失败, 该组件分类还有组件, 不允许删除"),
    EXISTS_ALREADY_COMPONENT(3011,"更新失败, 组件名称已存在"),
    EXISTS_ALREADY_COMPONENT_VERSEION(3012,"发行版本失败, 组件版本已存在"),
    COMPONENT_BUILD(3013,"请先编译组件"),
    COMPONENT_VERSION_UNAVAIABLE(3014,"组件版本不兼容旧版本，请添加版本号"),
    PARENT_COMPONENT_NOT_EXISTS(3015,"操作失败，父组件不存在"),

    // 组件操作
    INIT_WORKPLACE_ERROR(4000, "初始化工作空间失败"),

    DIR_NOT_FOUND(4000, "未找到该文件资源!"),
    NOT_INSTALL_DEPEND(4001, "未安装组件依赖!"),
    INSTALL_DEPEND_FAIL(4002, "安装组件依赖失败!"),

    COMPILE_FAIL(4003, "组件编译失败!"),

    EXPORT_FAIL(4004, "组件导出失败!"),
    IMPORT_FAIL(4005, "组件导入失败!"),

    IMPORT_FAIL_OF_UPLOAD(4006, "组件文件上传失败!"),
    IMPORT_FAIL_OF_PARSE(4007, "组件导入失败: 导入组件文件格式解析失败"),

    GET_COMPONENT_DIFF_INFO_ERROR(4008, "获取组件提交diff失败!"),

    COMPONENT_CUSTOM_COVER_PATH_ERROR(4009, "组件自定义图片失败!"),

    UPDATE_BASIC_INFO_FAIL(4010, "组件更新基础信息失败!"),

    // 应用
    APPLICATION_DELETE_FAIL(5000, "删除失败!"),

    APPLICATION_NO_PROJECT(5001, "项目不存在"),
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
