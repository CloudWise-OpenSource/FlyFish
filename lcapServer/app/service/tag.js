'use strict';
const Service = require('egg').Service;

class TagService extends Service {
  async getAll(params) {
    const { ctx } = this;
    const list = await ctx.model.Tag._find(params, null, { sort: '-update_time' });
    return list;
  }
}

module.exports = TagService;
