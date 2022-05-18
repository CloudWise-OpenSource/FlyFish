'use strict';

const BaseController = require('./base');

class DashboardController extends BaseController {
  async overview() {
    this.success('获取成功', null);
  }
}

module.exports = DashboardController;

