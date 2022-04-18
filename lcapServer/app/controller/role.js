'use strict';

const BaseController = require('./base');
const _ = require('lodash');
const CODE = require('../lib/error');

class RolesController extends BaseController {
  async add() {
    const { ctx, app, service } = this;

    const addRoleSchema = app.Joi.object().keys({
      name: app.Joi.string().required(),
      desc: app.Joi.string().allow(''),
    });

    const { value: createRoleInfo } = ctx.validate(addRoleSchema, ctx.request.body);
    const roleInfo = await service.role.add(createRoleInfo);
    if (roleInfo.msg === 'Exists Already') {
      this.fail('添加失败, 该角色存已存在', null, CODE.FAIL);
    } else {
      this.success('添加成功', { id: _.get(roleInfo, [ 'data', 'id' ]) });
    }
  }

  async login() {
    const { ctx, app, service } = this;

    const UserLoginSchema = app.Joi.object().keys({
      username: app.Joi.string().required(),
      password: app.Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    });
    ctx.validate(UserLoginSchema, ctx.request.body);

    const { username, password } = ctx.request.body;

    const userInfo = await service.user.userLogin(username, password);

    const cookieToSet = {
      userId: userInfo.id,
      username: userInfo.username,
      role: userInfo.role,
      phone: userInfo.phone,
      email: userInfo.email,
    };
    ctx.helper.setCookie(cookieToSet);

    if (_.isEmpty(userInfo)) {
      this.fail('登录失败', null, CODE.FAIL);
    } else {
      this.success('登录成功', { id: userInfo.id });
    }
  }

  async delete() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const deleteInfo = await service.role.delete(id);
    if (deleteInfo.msg === 'Exists Already') {
      this.fail('删除失败, 该角色中存在正常用户', null, CODE.FAIL);
    } else if (deleteInfo.msg === 'Can Not Delete') {
      this.fail('删除失败, 该角色禁止删除', null, CODE.FAIL);
    } else {
      this.success('删除成功', { id });
    }
  }

  async getInfo() {
    const { ctx, app, service } = this;

    const getRoleInfoSchema = app.Joi.object().keys({
      id: app.Joi.string().required(),
    });
    ctx.validate(getRoleInfoSchema, ctx.params);

    const { id } = ctx.params;

    const result = await service.role.getRoleInfo(id);

    this.success('获取成功', result);
  }

  async updateBasicInfo() {
    const { ctx, app, service } = this;

    const addRoleBasicInfoSchema = app.Joi.object().keys({
      desc: app.Joi.string().allow(''),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(addRoleBasicInfoSchema, ctx.request.body);

    await service.role.updateBasicInfo(id, requestData);
    this.success('更新成功', { id });
  }

  async updateMembersInfo() {
    const { ctx, app, service } = this;

    const addRoleBasicInfoSchema = app.Joi.object().keys({
      members: app.Joi.array().items(app.Joi.string()).required(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(addRoleBasicInfoSchema, ctx.request.body);

    await service.role.updateMembersInfo(id, requestData);

    this.success('更新成功', { id });
  }

  async updateAuthInfo() {
    const { ctx, app, service } = this;

    const addRoleBasicInfoSchema = app.Joi.object().keys({
      menus: app.Joi.array().items(app.Joi.object().keys({
        name: app.Joi.string(),
        url: app.Joi.string(),
        index: app.Joi.number().default(1),
      })).required(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(addRoleBasicInfoSchema, ctx.request.body);

    await service.role.updateAuthInfo(id, requestData);

    this.success('更新成功', { id });
  }

  async getList() {
    const { ctx, app, service } = this;

    const getRoleInfoSchema = app.Joi.object().keys({
      id: app.Joi.string(),
      name: app.Joi.string(),

      curPage: app.Joi.number().default(0),
      pageSize: app.Joi.number().default(10),
    });
    const { value: requestData } = ctx.validate(getRoleInfoSchema, ctx.request.body);

    const roleList = await service.role.getRoleList(requestData);

    const returnInfo = {
      total: roleList.total,
      curPage: requestData.curPage,
      pageSize: requestData.pageSize,
      list: roleList.data,
    };

    this.success('获取成功', returnInfo);
  }

  async getAll() {
    const { service } = this;

    const roleList = await service.role.getAll();
    this.success('获取成功', roleList);
  }
}

module.exports = RolesController;

