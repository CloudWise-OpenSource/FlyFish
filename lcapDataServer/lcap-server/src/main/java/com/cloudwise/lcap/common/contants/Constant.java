package com.cloudwise.lcap.common.contants;

import java.io.File;
import java.util.Arrays;
import java.util.List;

public class Constant {

    //jdbc
    public static final String MYSQL = "mysql";

    public static final String HTTP = "http";

    //驱动信息
    public static final String MYSQL_DRIVER = "com.mysql.jdbc.Driver";

    //组件打包参数 组件源码
    public static final String COMPONENT_SOURCE_COMPILED = "componentSource";
    //组件打包参数 组件安装包(必选的)
    public static final String COMPILED_SOURCE_DEPEND = "componentRelease";
    //组件打包参数node依赖模块
    public static final String COMPILED_SOURCE_COMPILED_WITH_DEPEND = "componentNodeModules";
    //导入类型 组件或应用
    public static final String APPLICATION = "application";
    public static final String COMPONENT = "component";

    public static final String APP_ONLY = "appOnly";
    public static final String APP_COMPONENT = "appComponentOnly";
    public static final String APP_AND_COMPONENT = "appAndComponent";
    public static final String SCHEMA_NAME = "schemaName";
    public static final String TABLE_NAME = "tableName";

    public static final String separator = File.separator;

    //复合查询
    //simple=简单查询（默认类型）
    public static final Integer SIMPLE = 1;


    //内置项目固定字段: from=lcap-init
    public static final String SPECIAL_PROJECT_FROM = "lcap-init";
}
