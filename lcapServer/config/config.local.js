/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const staticDir = path.join(__dirname, '../www');
  const commonDirPath = '';

  const serverIp = '0.0.0.0';
  const serverPort = 7001;

  const yapiServerIp = '10.2.3.56';
  const yapiServerPort = 3001;

  const mongodbIp = '10.2.2.254';
  const mongodbPort = 18017;

  const docpServerIp = '10.0.14.73';
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

  config.httpProxy = {
    '/gatewayApi': {
      target: `http://${docpServerIp}:${docpServerPort}`,
      changeOrigin: true,
      secure: false,
    },
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    clients: {
      flyfish: {
        url: `mongodb://admin:${encodeURIComponent('Yzh@redis_123')}@${mongodbIp}:${mongodbPort}/flyfish?authSource=test`,
        options: {
          useUnifiedTopology: true,
        },
      },
    },
  };

  config.pathConfig = {
    staticDir,
    commonDirPath,
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

  config.cluster = {
    listen: {
      hostname: serverIp,
      port: serverPort,
    },
  };

  config.specialId = {
    // 筛选框组件id
    componentId1: '6220579b706a880c8d848c54',
  };

  config.docpCookieConfig = {
    name: 'aops-sessionId',
    domain: docpServerIp,
  };

  return {
    ...config,
    ...userConfig,
  };
};
