'use strict';
const Service = require('egg').Service;

class MenuService extends Service {
  async getAll() {
    const { ctx } = this;

    const menuInfo = await ctx.model.Menu._find({}, null, { sort: '-create_time', limit: 1 }) || [];
    return menuInfo[0];
  }
}

module.exports = MenuService;
