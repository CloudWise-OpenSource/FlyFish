/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const staticDir = '/www';
  const commonDirPath = '';

  const serverIp = '10.2.3.247';
  const serverPort = 7001;

  const yapiServerIp = '10.2.3.247';
  const yapiServerPort = 3001;

  const mongodbIp = '10.2.3.247';
  const mongodbPort = 27017;

  const docpServerIp = '10.0.3.142';
  const docpServerPort = 18080;

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
        url: `mongodb://${mongodbIp}:${mongodbPort}/flyfish`,
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

  config.cookieConfig = {
    name: 'FLY_FISH_V2.0',
    domain: serverIp,
    encryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
  };

  config.pathConfig = {
    staticDir,
    commonDirPath,

    applicationPath: commonDirPath ? `${commonDirPath}/applications` : 'applications',
    appTplPath: commonDirPath ? `${commonDirPath}/application_tpl` : 'application_tpl',
    appBuildPath: commonDirPath ? `${commonDirPath}/application_build` : 'application_build',
    defaultApplicationCoverPath: commonDirPath ? `/${commonDirPath}/application_tpl/public/cover.jpeg` : '/application_tpl/public/cover.jpeg',
    appSourceTpl: commonDirPath ? `${commonDirPath}/application_source_template` : 'application_source_template',

    componentsPath: commonDirPath ? `${commonDirPath}/components` : 'components',
    componentsTplPath: commonDirPath ? `${commonDirPath}/component_tpl` : 'component_tpl',

    commonPath: commonDirPath ? `${commonDirPath}/common` : 'common',
    webPath: commonDirPath ? `${commonDirPath}/web` : 'web',

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
