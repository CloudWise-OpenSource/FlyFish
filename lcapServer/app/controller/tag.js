'use strict';

const BaseController = require('./base');
const Enum = require('../lib/enum');

class TagController extends BaseController {
  async getAll() {
    const { ctx, app: { Joi }, service } = this;

    const addSchema = Joi.object().keys({
      type: Joi.string().valid(...Object.values(Enum.TAG_TYPE)).required(),
    });
    const query = await addSchema.validateAsync(ctx.query);

    const list = await service.tag.getAll(query);
    this.success('获取成功', list);
  }
}

module.exports = TagController;

