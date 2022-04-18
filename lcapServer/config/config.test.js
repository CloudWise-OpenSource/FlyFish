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
