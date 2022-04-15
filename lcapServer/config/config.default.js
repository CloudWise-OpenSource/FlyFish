/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const staticDir = path.join(__dirname, '../www');
  const commonDirPath = '';

  const serverIp = 'localhost';
  const serverPort = 7001;

  const yapiServerIp = '10.2.3.56';
  const yapiServerPort = 3001;

  const mongodbIp = '10.2.3.56';
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

  config.bodyParser = {
    jsonLimit: '50mb',
    formLimit: '50mb',
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
      port: serverPort,
      // hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  config.httpProxy = {
    '/gatewayApi': {
      target: `http://${docpServerIp}:${docpServerPort}`,
      changeOrigin: true,
      secure: false,
    },
  };

  // 路由鉴权白名单
  config.reqUrlWhiteList = [
    '/users/login',
    '/users/register',
  ];

  // 同步用户url
  config.syncUserList = [
    '/users/info',
  ];

  // 项目白名单
  config.projectWhiteList = {
    roleIds: [ '61ade4f44e5200bf4eb1d3a6' ],
    authProjectId: '61ade5f8c4db0b22559e170c',
  };

  config.specialId = {
  };

  config.apiKey = 'bsl2a4BAVW5YZ4vL';

  // egg-axios 配置
  config.http = {
    headers: {},
    baseURL: '',
    timeout: 10000,
  };

  // Joi 配置
  config.joi = {
    options: {},
    locale: {
      'zh-cn': {},
    },
    throw: true, // throw immediately when capture exception
    throwHandle: error => { return error; }, // error message format when throw is true
    errorHandle: error => { return error; }, // error message format when throw is false
    resultHandle: result => { return result; }, // format result
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.services = {
    douc: {
      baseURL: `http://${docpServerIp}:${docpServerPort}`,
    },
    yapi: {
      baseURL: `http://${yapiServerIp}:${yapiServerPort}`,
      tokenEncryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
    },
    ffPlatform: {
      host: 'http://10.0.9.204:8360',
      accessKeyID: '94bbf713fd9fd0405995efec5b2a43e5',
      accessKeySecret: 'e0adb8c95664be821515ed159f43f265',
      getModelListUrl: '/openAPI/visualScreenEditor/getModelList',
      getModelDataUrl: '/openAPI/visualScreenEditor/getModelData',
    },
  };

  config.yapiCookieConfig = {
    name1: '_yapi_uid',
    name2: '_yapi_token',
  };

  config.docpCookieConfig = {
    name: 'aops-sessionId',
    domain: docpServerIp,
  };

  config.cookieConfig = {
    name: 'FLY_FISH_V2.0',
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

  config.multipart = {
    mode: 'file',
    fileSize: '50mb', // 文件上传的大小限制
  };

  config.static = {
    prefix: '/',
    dir: staticDir,
    // maxAge: 0,
    // preload: false,
    // dynamic: true,
    // buffer: false,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.logger = {
    dir: path.join(__dirname, `../logs/${appInfo.name}`),
  };

  config.customLogger = {
    // 请求响应日志
    accessLogger: {
      file: path.join(__dirname, `../logs/${appInfo.name}/access.log`),
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

  config.envMap = {
    development: 'development',
    test: 'test',
    prod: 'production',
    docker: 'docker',
    docp: 'docp',
  };

  return {
    ...config,
    ...userConfig,
  };
};
