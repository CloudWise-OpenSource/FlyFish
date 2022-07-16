'use strict';
const Service = require('egg').Service;

class MenuService extends Service {
  async getAll() {
    const { ctx } = this;

    const menuInfo = await ctx.model.Menu._findOne({}, null, { sort: '-create_time', limit: 1 });
    return menuInfo;
  }
}

module.exports = MenuService;
