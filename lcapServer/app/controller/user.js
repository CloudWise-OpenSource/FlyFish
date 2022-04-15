'use strict';

const BaseController = require('./base');
const _ = require('lodash');
const CODE = require('../lib/error');
const Enum = require('../lib/enum');

class UserController extends BaseController {
  async register() {
    const { ctx, app, service } = this;

    const UserRegisterSchema = app.Joi.object().keys({
      username: app.Joi.string().required(),
      phone: app.Joi.string().length(11).required(),
      email: app.Joi.string().email().required(),
      password: app.Joi.string().required(),
      rePassword: app.Joi.ref('password'),
    });
    const { value: createUserInfo } = ctx.validate(UserRegisterSchema, ctx.request.body);
    const userInfo = await service.user.userRegister(createUserInfo);
    if (userInfo.msg === 'user exists') {
      this.fail('注册失败, 用户已存在', null, CODE.FAIL);
    } else {
      this.success('注册成功', { id: _.get(userInfo, [ 'data', 'id' ]) });
    }
  }

  async login() {
    const { ctx, app, service } = this;

    const UserLoginSchema = app.Joi.object().keys({
      username: app.Joi.string().required(),
      password: app.Joi.string().required(),
    });
    ctx.validate(UserLoginSchema, ctx.request.body);

    const { username, password } = ctx.request.body;

    const userInfo = await service.user.userLogin(username, password);
    if (userInfo.msg === 'Account Or Password Error') {
      this.fail('登录失败, 账号或密码错误', null, CODE.FAIL);
    } else if (userInfo.msg === 'User Status Error') {
      this.fail('登录失败, 用户状态异常', null, CODE.FAIL);
    } else if (userInfo.msg === 'No Auth') {
      this.fail('登录失败, 无权限', null, CODE.FAIL);
    } else {
      const cookieToSet = {
        userId: userInfo.data.id,
        username: userInfo.data.username,
        role: userInfo.data.role,
        phone: userInfo.data.phone,
        email: userInfo.data.email,
      };
      ctx.helper.setCookie(cookieToSet);

      this.success('登录成功', { id: userInfo.data.id });
    }
  }

  async logout() {
    const { ctx, app } = this;

    const UserLogoutSchema = app.Joi.object().keys({
      id: app.Joi.string().required(),
    });
    ctx.validate(UserLogoutSchema, ctx.request.body);

    const { id } = ctx.request.body;

    ctx.helper.clearCookie();

    this.success('登出成功', { id });
  }

  async getInfo() {
    const { ctx, app, service } = this;

    const getUserInfoSchema = app.Joi.object().keys({
      id: app.Joi.string(),
    });
    ctx.validate(getUserInfoSchema, ctx.query);

    const { id } = ctx.params;

    const userInfo = await service.user.getUserInfo(id);

    if (_.isEmpty(userInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', userInfo);
    }
  }

  async getApiToken() {
    const { ctx, app, service } = this;

    const getUserInfoSchema = app.Joi.object().keys({
      id: app.Joi.string(),
      lang: app.Joi.string(),
      __timestap: app.Joi.string(),
    });
    ctx.validate(getUserInfoSchema, ctx.query);

    const { id } = ctx.params;

    const userInfo = await service.user.getUserInfo(id);

    if (_.isEmpty(userInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', userInfo.yapiAuthorization);
    }
  }

  async updateUserInfo() {
    const { ctx, app, service } = this;

    const updateUserInfoSchema = app.Joi.object().keys({
      password: app.Joi.string(),
      status: app.Joi.valid(..._.values(Enum.COMMON_STATUS)),
      phone: app.Joi.string(),
      email: app.Joi.string().email(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(updateUserInfoSchema, ctx.request.body);

    await service.user.updateUserInfo(id, requestData);

    this.success('更新成功', { id });
  }

  async getList() {
    const { ctx, app, service } = this;

    const getUserInfoSchema = app.Joi.object().keys({
      id: app.Joi.string(),
      username: app.Joi.string(),
      phone: app.Joi.string(),
      email: app.Joi.string(),
      status: app.Joi.valid(..._.values(Enum.COMMON_STATUS)),

      curPage: app.Joi.number().default(0),
      pageSize: app.Joi.number().default(10),
    });
    const { value: requestData } = ctx.validate(getUserInfoSchema, ctx.request.body);

    const userList = await service.user.getUserList(requestData);

    const returnInfo = {
      total: userList.total,
      curPage: requestData.curPage,
      pageSize: requestData.pageSize,
      list: userList.data,
    };

    this.success('获取成功', returnInfo);
  }

  async updateAppConfig() {
    const { ctx, app, service } = this;
    const userInfo = ctx.userInfo;

    const updateUserAppConfigSchema = app.Joi.object();
    const { value: applicationId } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.applicationId);
    const { value: requestData } = ctx.validate(updateUserAppConfigSchema, ctx.request.body);
    await service.user.updateAppConfig(userInfo.userId, applicationId, requestData);

    this.success('更新成功', { id: userInfo.userId });
  }

  async getAppConfig() {
    const { ctx, app, service } = this;
    const userInfo = ctx.userInfo;

    const { value: applicationId } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.applicationId);
    const configInfo = await service.user.getAppConfig(userInfo.userId, applicationId);

    this.success('获取成功', configInfo);
  }
}

module.exports = UserController;

