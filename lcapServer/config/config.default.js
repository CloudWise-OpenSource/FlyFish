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

  const mongodbIp = '127.0.0.1';
  const mongodbPort = 27017;
  // const mongodbUsername = '${CW_MONGODB_USERNAME}';
  // const mongodbPassword = encodeURIComponent('${CW_MONGODB_PASSWORD}');

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

  config.bodyParser = {
    jsonLimit: '50mb',
    formLimit: '50mb',
  };

  config.mongoose = {
    clients: {
      flyfish: {
        url: `mongodb://${mongodbIp}:${mongodbPort}/flyfish`,
        // url: `mongodb://${mongodbUsername}:${mongodbPassword}@${mongodbIp}:${mongodbPort}/flyfish?authSource=test`,
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

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // 路由鉴权白名单
  config.reqUrlWhiteList = [
    '/users/login',
    '/users/register',

    /applications\/info\/\w{24}/,
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
    innerComponentCategoryIds: [ '19700101', '197001010', '197001011', '19700102', '197001020' ],
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
    web: {
      baseURL: 'http://127.0.0.1:8089',
    },
    chrome: {
      host: '127.0.0.1',
      port: chromePort,
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
  };

  config.cookieConfig = {
    name: 'FLY_FISH_V2.0',
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

  config.replaceTpl = {
    componentIdTpl: '${ComponentIdTpl}',
    editorCssTpl: '${EditorCssTpl}',
    editorEnvTpl: '${EditorEnvTpl}',
    editorDataViTpl: '${EditorDataViTpl}',
    editorJsTpl: '${EditorJsTpl}',

    indexEnvTpl: '${IndexEnvTpl}',
    indexDataViTpl: '${IndexDataViTpl}',
    envComponentDirTpl: '${EnvComponentDirTpl}',
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
