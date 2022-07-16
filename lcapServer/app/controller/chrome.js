'use strict';

const BaseController = require('./base');

class ChromeController extends BaseController {
  async screenshot() {
    const { ctx, app } = this;
    const checkSchema = app.Joi.object().keys({
      url: app.Joi.string().require(),
      savePath: app.Joi.string().require(),
    });
    const { value: requestData } = ctx.validate(checkSchema, ctx.request.body);

    await ctx.helper.screenshot(requestData.url, requestData.savePath);
    this.success('gen成功');
  }
}

module.exports = ChromeController;

