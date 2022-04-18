'use strict';

const _ = require('lodash');

const BaseController = require('./base');
const CODE = require('../lib/error');

class DashboardController extends BaseController {
  async overview() {
    const { service } = this;
    const dashboardInfo = await service.dashboard.getOverviewInfo();
    if (_.isEmpty(dashboardInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', dashboardInfo);
    }
  }
}

module.exports = DashboardController;

