const wwwDirPath = "/resources/flyFish/visual_component_platform_server/www";

// default config
module.exports = {
  /*
	 |-------------------------------------------------------------------
	 | thinkjs框架配置
	 |-------------------------------------------------------------------
	 */
  port: 8363, // 服务端口号
  host: "10.2.3.247", // 服务段主机地址
  workers: 1, // 服务worker进程的数据量，如果为0则取所在主机的cpu数量作为worker进程的数据量
  createServer: undefined, // create server function
  startServerTimeout: 3000, // before start server time
  reloadSignal: "SIGUSR2", // reload process signal
  onUnhandledRejection: (err) => think.logger.error(err), // unhandledRejection handle
  onUncaughtException: (err) => think.logger.error(err), // uncaughtException handle
  processKillTimeout: 10 * 1000, // process kill timeout, default is 10s
  enableAgent: false, // enable agent worker
  jsonpCallbackField: "callback", // jsonp callback field
  jsonContentType: "application/json", // json content type
  errnoField: "code", // errno field
  errmsgField: "msg", // errmsg field
  defaultErrno: "error", // default errno
  validateDefaultErrno: 1001, // validate default errno
  stickyCluster: true, //用于开启websocket服务时,确保给定客户端请求命中相同的 worker，否则其握手机制将无法正常工作

  // 设置cookie
  cookie: {
    domain: "",
    path: "/",
    maxAge: 10 * 3600 * 1000, // 10个小时
    overwrite: true, //
    signed: true,
    httpOnly: false, // 允许客户端的 JavaScript 访问到
    keys: [
      "__vcp_login_user_info__", // 登录用户信息的cookie key
    ], // 当 signed 为 true 时，使用 keygrip 库加密时的密钥
  },

  /*
	 |-------------------------------------------------------------------
	 | 应用自定义配置
	 |-------------------------------------------------------------------
	 */
  custom: {
    wwwDirPath: wwwDirPath,
    appModules: {
      web: "web", //
      openAPI: "openAPI", //
    },

    // 缓存key值的前缀
    cacheKeyPrefix: "vcp_platform",
  },
};
