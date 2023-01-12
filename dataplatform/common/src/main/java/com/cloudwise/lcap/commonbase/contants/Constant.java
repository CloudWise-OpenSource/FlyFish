package com.cloudwise.lcap.commonbase.contants;

import java.io.File;
import java.util.Arrays;
import java.util.List;

public class Constant {
    public static final Long INNER_ACCOUNT_ID = -1l;
    public static final String COMPONENT_CATEGORY_PARENT_ID = "-1";
    public static final String LCAP_MODULE_CODE = "125";

    public static final String MYSQL = "mysql";
    public static final String DAMENG = "dm";
    public static final String MARIA = "mariadb";
    public static final String POSTGRES = "postgres";
    public static final String CLICKHOUSE = "clickhouse";
    public static final String SQL_SERVER = "sqlserver";
    public static final String ORACLE = "oracle";
    public static final String HTTP = "http";


    //驱动信息
    public static final String MYSQL_DRIVER = "com.mysql.jdbc.Driver";
    public static final String DAMENG_DRIVER = "dm.jdbc.driver.DmDriver";
    public static final String MARIA_DRIVER = "org.mariadb.jdbc.Driver";
    public static final String CLICKHOUSE_DRIVER = "ru.yandex.clickhouse.ClickHouseDriver";
    public static final String POSTGRES_DRIVER = "org.postgresql.Driver";
    public static final String SQL_SERVER_DRIVER = "com.microsoft.sqlserver.jdbc.SQLServerDriver";
    public static final String ORACLE_DRIVER = "oracle.jdbc.driver.OracleDriver";
    public static final Integer DATA_TOTAL = 3000;
    public static final String HTTP_CODE = "httpCode";
    public static final String USER_ID = "userId";
    public static final String ACCOUNT_ID = "accountId";
    /**
     * gateway侧的白名单路由
     */
    public static final String gateway_white_access = "whiteaccess";

    //内置产品的接口设置内置环境所属的 cookie
    public static final String HTTP_COOKIE = "cookie";
    public static String aopsSessionId = "aops-sessionId";
    public static final String V_CURRENT = "v-current";
    public static final String APPLICATIONS = "/applications";
    public static final String COMPONENTS = "/components";
    public static final String COMPONENT_RELEASE = "/release";
    public static final String RELEASE_MAIN = "/release/main.js";
    public static final String RELEASE_SETTING = "/release/setting.js";
    //组件打包参数 组件安装包(必选的)
    public static final String COMPILED_SOURCE_DEPEND = "componentRelease";
    //导入类型 组件或应用
    public static final String APPLICATION = "application";
    public static final String COMPONENT = "component";
    public static final String APP_AND_COMPONENT = "appAndComponent";
    //字面量
    public static final String SCHEMA_NAME = "schemaName";
    public static final String MODEL_NAME = "modelName";
    public static final String TABLE_NAME = "tableName";

    public static final String separator = File.separator;

    //复合查询
    //simple=简单查询（默认类型）
    public static final Integer SIMPLE = 1;
    //单值复合
    public static final Integer COMBINE_SINGLE_VALUE_TYPE = 2;
    //多值按行复合
    public static final Integer COMBINE_MULTI_VALUE_LINE_TYPE = 3;
    public static final Integer COMBINE_MULTI_VALUE_COLUMN_TYPE = 4;
    //时序值复合
    public static final Integer COMBINE_SEQUENCE_TYPE = 5;
    //时序值复合最多支持10个数据集
    public static final Integer MAX_COMBINE_SEQ_TOTAL = 10;

    static List<String> JDBC_SCHEMA = Arrays.asList(MYSQL, POSTGRES, CLICKHOUSE, SQL_SERVER, ORACLE);

    /**
     * 大屏分享预览地址 redis key:基于applicationId查看分享信息
     */
    public static String applicationSharePrefix = "LCAP:APP_SHARE:";
    /**
     * 大屏分享预览地址 redis key:基于shareKey查看分享信息
     */
    public static String applicationShareKeyPrefix = "LCAP:APP_SHARE_KEY:";
    /**
     * 大屏分享预览地址cookie——name
     */
    public static String applicationShareCookieName = "LCAP_APP_SHARE";
    public static String share_Key = "shareKey";
    public static String share_password = "password";

    public static String share_applicationId = "applicationId";

    // 监控中心内置项目
    public static final String INNER_TRADES_NAME = "全行业";
    public static final String MONITOR_PROJECT_NAME = "监控中心专用项目";
    public static final String MONITOR_PROJECT_DESC = "此项目用于存放和渲染监控中心的仪表盘，该项目不可删除";

    /**
     * 内置项目固定字段: init-from=lcap-init
     */
    public static final String SPECIAL_PROJECT_FROM = "lcap-init";


    // douc
    public static final String DOUC_ACCOUNT_TOPIC = "DOUC_ALL_ACCOUNT_SYNC";
    public static final String DOUC_ACCOUNT_ADD_TYPE = "ADD";
    public static final String DOUC_ACCOUNT_PAUSE_TYPE = "PAUSE";
    public static final String DOUC_ACCOUNT_DELETE_TYPE = "DELETE";

    public static final int DOUC_ACCOUNT_SYNC_ADD_STATUS = 1;
    public static final int DOUC_ACCOUNT_SYNC_STOP_STATUS = 2;
    public static final int DOUC_ACCOUNT_SYNC_DELETE_STATUS = 3;

    public static final String IMPORT_KEY = "import:";


    /**
     * 组件封面图生成策略：custom auto
     * 现 auto 模式已移除
     */
    public static final String COMPONENT_COVER_CUSTOM = "custom";

}
