'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');
class TradeService extends Service {
  async getList() {
    const { ctx } = this;
    const filter = {
      status: Enum.COMMON_STATUS.VALID,
    };
    const list = await ctx.model.Trade._find(filter);

    return {
      list,
    };
  }
}

module.exports = TradeService;
