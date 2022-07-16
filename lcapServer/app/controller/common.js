'use strict';
const BaseController = require('./base');

class MenuController extends BaseController {
  async getVersionInfo() {
    let versionInfo = {};
    try {
      versionInfo = require('../../serviceVersion.json');
    } catch (error) {
      console.log(error);
    }
    this.success('获取成功', versionInfo);
  }
}

module.exports = MenuController;

