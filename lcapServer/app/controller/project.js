'use strict';

const _ = require('lodash');

const BaseController = require('./base');
const CODE = require('../lib/error');

class ProjectController extends BaseController {
  async create() {
    const { ctx, app: { Joi }, service } = this;

    const addSchema = Joi.object().keys({
      name: Joi.string().required(),
      trades: Joi.array().items(Joi.object().keys({
        id: Joi.string().length(24),
        name: Joi.string().required(),
      })).required(),
      desc: Joi.string(),
    });
    const body = await addSchema.validateAsync(ctx.request.body);
    const createResult = await service.project.create(body);
    if (createResult.msg === 'Exists Already') {
      this.fail('新建失败, 项目名称已存在', null, CODE.ALREADY_EXISTS);
    } else {
      this.success('新建成功', createResult.data);
    }
  }

  async delete() {
    const { ctx, app: { Joi }, service } = this;
    const deleteSchema = Joi.object().keys({
      projectId: Joi.string().length(24).required(),
    });

    const { projectId } = await deleteSchema.validateAsync(ctx.params);
    const deleteResult = await service.project.delete(projectId);

    if (deleteResult.msg === 'Exists Already') {
      this.fail('删除失败, 项目中存在组件或者应用', null, CODE.FAIL);
    } else if (deleteResult.msg === 'No Auth') {
      this.fail('删除失败, 无权限', null, CODE.FAIL);
    } else {
      this.success('删除成功', { id: projectId });
    }
  }

  async edit() {
    const { ctx, app: { Joi }, service } = this;
    const editParamSchema = Joi.object().keys({
      projectId: Joi.string().length(24).required(),
    });

    const editBodySchema = Joi.object().keys({
      name: Joi.string().required(),
      trades: Joi.array().items(Joi.object().keys({
        id: Joi.string().length(24),
        name: Joi.string().required(),
      })).required(),
      desc: Joi.string().allow(''),
    });

    const { projectId } = await editParamSchema.validateAsync(ctx.params);
    const body = await editBodySchema.validateAsync(ctx.request.body);
    const editResult = await service.project.edit(projectId, body);

    const errInfo = editResult.data.error || null;
    if (editResult.msg === 'Exists Already') {
      this.fail('编辑失败, 组件名称已存在', errInfo, CODE.FAIL);
    } else {
      this.success('编辑成功', { id: projectId });
    }
  }

  async list() {
    const { ctx, app: { Joi }, service } = this;

    const listSchema = Joi.object().keys({
      key: Joi.string(),
      curPage: Joi.number(),
      pageSize: Joi.number(),
    });

    const { key, curPage, pageSize } = await listSchema.validateAsync(ctx.query);
    const options = {
      sort: '-update_time',
    };
    if (!_.isNil(curPage) && !_.isNil(pageSize)) {
      Object.assign(options, {
        skip: curPage * pageSize,
        limit: pageSize,
      });
    }

    const { list, total } = await service.project.getList({ key }, options);
    this.success('获取成功', { total, list, curPage, pageSize });
  }

  async info() {
    const { ctx, app: { Joi }, service } = this;

    const infoSchema = Joi.object().keys({
      projectId: Joi.string().length(24).required(),
    });

    const { projectId } = await infoSchema.validateAsync(ctx.params);
    const info = await service.project.getInfo(projectId);
    this.success('获取成功', info);
  }


}

module.exports = ProjectController;

