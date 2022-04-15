'use strict';

const Controller = require('egg').Controller;
const CODE = require('../lib/error');
class BaseController extends Controller {
  async success(msg, data = null) {
    const { ctx } = this;
    ctx.body = {
      code: CODE.SUCCESS,
      msg,
      data,
    };
    ctx.status = 200;
  }

  async fail(msg, data = null, code = CODE.INTERNAL_ERR) {
    const { ctx } = this;
    ctx.body = {
      code,
      msg,
      data,
    };
    ctx.status = 200;
  }
}

module.exports = BaseController;
