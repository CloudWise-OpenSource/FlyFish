/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const staticDir = '${CW_INSTALL_STATIC_DIR}';
  const commonDirPath = 'lcapWeb/www';

  const serverIp = '${CW_MAIN_SERVER_IP}';
  const serverPort = '${CW_DOCP_SERVER_PORT}';

  const yapiServerIp = '${CW_YAPI_SERVER_IP}';
  const yapiServerPort = '${CW_YAPI_SERVER_PORT}';

  const mongodbIp = '${CW_MONGODB_IP}';
  const mongodbPort = '${CW_MONGODB_PORT}';
  const mongodbUsername = '${CW_MONGODB_USERNAME}';
  const mongodbPassword = encodeURIComponent('${CW_MONGODB_PASSWORD}');

  const docpServerIp = '${CW_DOCP_SERVER_IP}';
  const docpServerPort = '${CW_DOCP_SERVER_PORT}';

  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1635235048156_3836';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'notfoundHandler', 'accessLogger' ];


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.httpProxy = {
    '/gatewayApi': {
      target: `http://${docpServerIp}:${docpServerPort}`,
      changeOrigin: true,
      secure: false,
    },
  };

  config.mongoose = {
    clients: {
      flyfish: {
        url: `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbIp}:${mongodbPort}/flyfish?authSource=test`,
        options: {
          useUnifiedTopology: true,
        },
      },
    },
  };

  config.cluster = {
    listen: {
      hostname: serverIp,
      port: serverPort,
    },
  };

  config.docpCookieConfig = {
    name: 'aops-sessionId',
    domain: docpServerIp,
  };

  config.specialId = {
    // 筛选框组件id
    componentId1: '6220579b706a880c8d848c54',
  };

  config.cookieConfig = {
    name: 'FLY_FISH_V2.0',
    domain: serverIp,
    encryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
  };

  config.pathConfig = {
    staticDir,
    commonDirPath,

    applicationPath: `${commonDirPath}/applications`,
    appTplPath: `${commonDirPath}/application_tpl`,
    appBuildPath: `${commonDirPath}/application_build`,
    defaultApplicationCoverPath: commonDirPath ? `/${commonDirPath}/application_tpl/public/cover.jpeg` : '/application_tpl/public/cover.jpeg',
    appSourceTpl: `${commonDirPath}/application_source_template`,

    componentsPath: `${commonDirPath}/components`,
    componentsTplPath: `${commonDirPath}/component_tpl`,

    commonPath: `${commonDirPath}/common`,
    webPath: `${commonDirPath}/web`,

    defaultComponentCoverPath: commonDirPath ? `/${commonDirPath}/component_tpl/public/cover.jpeg` : '/component_tpl/public/cover.jpeg',
    initComponentVersion: 'v-current',
  };

  config.services = {
    douc: {
      baseURL: `http://${docpServerIp}:${docpServerPort}`,
    },
    yapi: {
      baseURL: `http://${yapiServerIp}:${yapiServerPort}`,
      tokenEncryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
    },
  };

  config.static = {
    prefix: '/',
    dir: staticDir,
    maxAge: 0,
    preload: false,
    dynamic: true,
    buffer: false,
  };

  return {
    ...config,
    ...userConfig,
  };
};
