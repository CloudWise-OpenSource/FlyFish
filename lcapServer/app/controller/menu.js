'use strict';

const BaseController = require('./base');
class MenuController extends BaseController {
  async list() {
    const { service } = this;

    const result = await service.menu.getAll();
    this.success('获取成功', result.menus || []);
  }
}

module.exports = MenuController;

