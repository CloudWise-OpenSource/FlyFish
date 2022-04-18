'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const Enum = require('../lib/enum');
class TradeService extends Service {
  async getList() {
    const { ctx } = this;
    const list = await ctx.model.Trade._find({ status: Enum.COMMON_STATUS.VALID });

    return {
      list,
    };
  }
}

module.exports = TradeService;
