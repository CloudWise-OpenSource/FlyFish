/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  // 静态目录 eg:  /data/app/lcapWeb
  const staticDir = path.join(__dirname, '../../lcapWeb');
  // 组件开发目录, 默认www, 配置staticDir使用，eg: /data/app/lcapWeb/www
  const commonDirPath = 'www';
  // 数据目录 eg:  /data/appData
  const dataBaseDir = path.join(__dirname, '../../../appData');
  // 日志目录 eg:  /data/logs
  const logsBaseDir = path.join(__dirname, '../../logs');
  
  const serverIp = '127.0.0.1';
  const serverPort = 7001;

  const mongodbIp = '10.2.3.56';
  const mongodbPort = 18017;
  const mongodbUsername = 'admin';
  const mongodbPassword = encodeURIComponent('Yzh@redis_123');

  // chrome 端口，用于自动生成组件、应用缩略图服务，默认9222
  const chromePort = 9222;
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

  config.mongoose = {
    clients: {
      flyfish: {
        // url: `mongodb://${mongodbIp}:${mongodbPort}/flyfish`,
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
      port: +serverPort,
    },
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
    dataDir: `${dataBaseDir}/${appInfo.name}`,
    logsDir: `${logsBaseDir}/${appInfo.name}`,
    commonDirPath,

    applicationPath: commonDirPath ? `${commonDirPath}/applications` : 'applications',
    appTplPath: commonDirPath ? `${commonDirPath}/application_tpl` : 'application_tpl',
    appBuildPath: commonDirPath ? `${commonDirPath}/application_build` : 'application_build',
    defaultApplicationCoverPath: commonDirPath ? `/${commonDirPath}/application_tpl/public/cover.jpeg` : '/application_tpl/public/cover.jpeg',
    appSourceTpl: commonDirPath ? `${commonDirPath}/application_source_template` : 'application_source_template',

    componentsPath: commonDirPath ? `${commonDirPath}/components` : 'components',
    componentsTplPath: commonDirPath ? `${commonDirPath}/component_tpl` : 'component_tpl',

    commonPath: commonDirPath ? `${commonDirPath}/common` : 'common',
    tmpPath: commonDirPath ? `${commonDirPath}/tmp` : 'tmp',
    webPath: commonDirPath ? `${commonDirPath}/web` : 'web',

    defaultComponentCoverPath: commonDirPath ? `/${commonDirPath}/component_tpl/public/cover.jpeg` : '/component_tpl/public/cover.jpeg',
    initComponentVersion: 'v-current',
  };

  config.services = {
    chrome: {
      host: '127.0.0.1',
      port: chromePort,
    },
  };

  config.logger = {
    dir: `${logsBaseDir}/${appInfo.name}`,
    // level: 'ERROR',
    // consoleLevel: 'ERROR',
    appLogName: `${appInfo.name}-info.log`,
    errorLogName: `${appInfo.name}-error.log`,
    coreLogName: 'egg-web.log',
    agentLogName: 'egg-agent.log',
  };

  config.customLogger = {
    // 请求响应日志
    accessLogger: {
      file: `${logsBaseDir}/${appInfo.name}/${appInfo.name}-access.log`,
      format: meta => {
        return '[' + meta.date + '] '
                + meta.level + ' '
                + meta.pid + ' '
                + meta.message;
      },
      formatter: meta => {
        return '[' + meta.date + '] '
                + meta.level + ' '
                + meta.pid + ' '
                + meta.message;
      },
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
