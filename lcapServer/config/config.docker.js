/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
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
        url: 'mongodb://flyfish-mongo:27017/flyfish',
        options: {
          useUnifiedTopology: true,
        },
      },
    },
  };

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '0.0.0.0',
    },
  };

  config.cookieConfig = {
    name: 'FLY_FISH_V2.0',
    encryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
  };

  const staticDir = path.join(__dirname, '../www');
  const commonDirPath = '';

  config.pathConfig = {
    staticDir,
    commonDirPath,
  };

  config.static = {
    prefix: '/',
    dir: staticDir,
    maxAge: 0,
    preload: false,
    dynamic: true,
    buffer: false,
  };

  config.services = {
    douc: {
      baseURL: '',
    },
    yapi: {
      baseURL: 'http://flyfish-yapi:3001',
      tokenEncryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
