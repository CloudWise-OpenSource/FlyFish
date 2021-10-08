const path = require("path");
const mysql = require("think-model-mysql");
const redisCache = require("think-cache-redis");
const nunjucks = require("think-view-nunjucks");
const fileSession = require("think-session-file");
const { DateFile, Console } = require("think-logger3");

const isDev = think.env === "development";

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: "redis",
  common: {
    timeout: 24 * 3600 * 1000, // 默认过期时间24 hour
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: "10.2.3.247",
    password: "",
  },
};

/**
 *
 * @type {{type, dateFile}}
 */
exports.logger = (() => {
  if (isDev) {
    return {
      type: "console",
      dateFile: {
        handle: Console,
      },
    };
  }

  return {
    type: "dateFile", // 日志按照日期文件划分
    dateFile: {
      handle: DateFile,
      level: "ALL", // 日志级别: ALL, ERROR, WARN, INFO, DEBUG
      absolute: true, // 日志文件是否为绝对路径
      pattern: "-yyyy-MM-dd", // 定义时间格式
      alwaysIncludePattern: true, // 如果 alwaysIncludePattern 设置为 true，则初始文件直接会被命名为 xx.log-2017-07-01，然后隔天会生成 xx.log-2017-07-02 的新文件
      filename: path.join(think.ROOT_PATH, "logs/app/app.log"), // 文件名
    },
  };
})();

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: "mysql",
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: (msg) => think.logger.info(msg),
  },
  mysql: {
    handle: mysql,
    database: "flyfish",
    // database: 'test_migrate_solution',
    user: "root",
    password: "Admin@123",
    host: "10.2.3.247",
    port: "3306",
    prefix: "",
    encoding: "utf8",
    connectTimeout: 30 * 1000, // 普通方式创建连接的超时时间 30s
    acquireTimeout: 30 * 1000, // 连接池方式创建连接的超时时间 30s
    // debug: isDev,
    connectionLimit: 10, // 数据库最大连接数
    dateStrings: true,
    pageSize: 15, // 设置默认分页数
  },
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: "file",
  common: {
    cookie: {
      name: "thinkjs",
      maxAge: 5 * 1000, // 5秒钟
      // keys: ['werwer', 'werwer'],
      signed: true,
    },
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, "runtime/session"),
  },
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: "nunjucks",
  common: {
    viewPath: path.join(think.ROOT_PATH, "view"),
    sep: "_",
    extname: ".html",
  },
  nunjucks: {
    handle: nunjucks,
  },
};
