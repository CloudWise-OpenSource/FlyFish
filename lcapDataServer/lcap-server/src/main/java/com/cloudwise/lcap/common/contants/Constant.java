package com.cloudwise.lcap.common.contants;

import java.io.File;
import java.util.Arrays;
import java.util.List;

public class Constant {

    //jdbc
    public static final String MYSQL = "mysql";
    public static final String CLICKHOUSE = "clickhouse";
    public static final String POSTGRES = "postgresql";
    public static final String ORACLE = "oracle";
    public static final String DAMENG = "dm";
    public static final String MARIA = "mariadb";
    public static final String SQLSERVER = "sqlserver";
    public static final String HTTP = "http";

    //驱动信息
    public static final String MYSQL_DRIVER = "com.mysql.jdbc.Driver";
    public static final String POSTGRES_DRIVER = "org.postgresql.Driver";
    public static final String ORACLE_DRIVER = "oracle.jdbc.OracleDriver";
    public static final String CLICKHOUSE_DRIVER = "com.clickhouse.jdbc.ClickHouseDriver";
    public static final String DAMENG_DRIVER = "dm.jdbc.driver.DmDriver";
    public static final String MARIA_DRIVER = "org.mariadb.jdbc.Driver";
    public static final String SQL_SERVER_DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";

    //组件打包参数 组件源码
    public static final String COMPONENT_SOURCE_COMPILED = "componentSource";
    //组件打包参数 组件安装包(必选的)
    public static final String COMPILED_RELEASE_SOURCE = "componentRelease";
    //组件打包参数node依赖模块
    public static final String COMPILED_SOURCE_COMPILED_WITH_DEPEND = "componentNodeModules";

    public static final String APPLICATIONS = "/applications";

    public static final String COMPONENTS = "/components";

    public static final String COMPONENT_RELEASE = "/release";

    public static final String V_CURRENT = "/v-current";

    public static final String V_CURRENT_SRC = "/src";
    public static final String V_CURRENT_DEPENDED = "/node_modules";

    public static final String RELEASE_MAIN = "/release/main.js";

    public static final String RELEASE_SETTING = "/release/setting.js";
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
