'use strict';

const BaseController = require('./base');
class TradeController extends BaseController {
  async list() {
    const { service } = this;

    const { list } = await service.trade.getList();
    this.success('获取成功', { list });
  }
}

module.exports = TradeController;

