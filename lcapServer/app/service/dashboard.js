'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

class DashboardService extends Service {
  async getOverviewInfo() {
    const { ctx, logger, config: { services: { yapi } } } = this;

    const applications = await ctx.model.Application._find({ status: Enum.COMMON_STATUS.VALID }, { is_lib: 1 });
    const components = await ctx.model.Component._find({ status: Enum.COMMON_STATUS.VALID }, { is_lib: 1 });
    const projectCount = await ctx.model.Project._count({ status: Enum.COMMON_STATUS.VALID });

    let yapiGroupCount = 0,
      yapiInterfaceCount = 0;
    try {
      const { errcode, errmsg, data: { interfaceCount, groupCount } } = await ctx.http.get(`${yapi.baseURL}/api/dashboard/overview`);
      if (errcode !== 0) {
        logger.error(`get overview error: ${errmsg}`);
      }

      yapiGroupCount = groupCount;
      yapiInterfaceCount = interfaceCount;
    } catch (error) {
      logger.error(`get overview error: ${JSON.stringify(error)}`);
    }

    const returnInfo = {
      project: projectCount,
      application: applications.length,
      component: components.length,
      tpl: {
        application: applications.filter(app => app.isLib).length,
        component: components.filter(component => component.isLib).length,
      },
      yapi: {
        group: yapiGroupCount || 0,
        api: yapiInterfaceCount || 0,
      },
    };

    return returnInfo || {};
  }
}

module.exports = DashboardService;
