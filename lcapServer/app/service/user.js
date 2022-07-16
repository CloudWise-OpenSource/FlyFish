'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const md5 = require('md5');
const _ = require('lodash');
class UserService extends Service {
  async userRegister(createUserInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const existsUsers = await ctx.model.User._findOne({ username: createUserInfo.username });
    if (!_.isEmpty(existsUsers)) {
      returnData.msg = 'user exists';
      return returnData;
    }

    const initRoleInfo = await ctx.model.Role._findOne({ name: Enum.ROLE.MEMBER });
    createUserInfo.password = md5(createUserInfo.password);
    createUserInfo.role = initRoleInfo.id;
    await ctx.model.User._create(createUserInfo);
    const userInfo = await ctx.model.User._findOne({ username: createUserInfo.username });

    returnData.data = userInfo;

    return returnData;
  }

  async userLogin(username, password) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const userInfo = await ctx.model.User._findOne({ username, password: md5(password) });
    if (_.isEmpty(userInfo)) {
      returnData.msg = 'Account Or Password Error';
      return returnData;
    }

    if (_.isEmpty(userInfo.status) || userInfo.status === Enum.COMMON_STATUS.INVALID) {
      returnData.msg = 'User Status Error';
      return returnData;
    }

    if (userInfo.role) {
      const roleInfo = await ctx.model.Role._findOne({ id: userInfo.role, status: Enum.COMMON_STATUS.VALID });
      if (_.isEmpty(roleInfo)) {
        returnData.msg = 'No Auth';
        return returnData;
      }
    } else {
      returnData.msg = 'No Auth';
      return returnData;
    }

    // sync yapi user
    userInfo.isAdmin = false;
    if (userInfo.role) {
      const roleInfo = await ctx.model.Role._findOne({ id: userInfo.role });
      userInfo.isAdmin = roleInfo.name === Enum.ROLE.ADMIN;
    }

    returnData.data = userInfo;
    return returnData;
  }

  async getUserInfo(userId) {
    const { ctx } = this;
    let userInfo = {};

    if (!userId) {
      const curUserInfo = ctx.userInfo;
      userId = curUserInfo.userId;
    }

    userInfo = await ctx.model.User._findOne({ id: userId }) || {};
    userInfo.isAdmin = false; userInfo.menus = [];
    if (userInfo.role) {
      const roleInfo = await ctx.model.Role._findOne({ id: userInfo.role });
      userInfo.isAdmin = roleInfo.name === Enum.ROLE.ADMIN;
      userInfo.menus = roleInfo.menus || [];
    }
    return userInfo || {};
  }

  async updateUserInfo(id, requestData) {
    const { ctx } = this;
    const { status, password, phone, email } = requestData;

    const updateData = {};
    if (status) updateData.status = status;
    if (password) updateData.password = md5(password);

    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    await ctx.model.User._updateOne({ id }, updateData);
  }

  async getAppConfig(userId, appId) {
    const { ctx } = this;

    const userInfo = await ctx.model.User._findOne({ id: userId }) || {};

    return _.get(userInfo, [ 'applicationConfig', appId ], {});
  }

  async updateAppConfig(userId, appId, requestData) {
    const { ctx } = this;

    const updateData = {
      applicationConfig: {
        [appId]: requestData,
      },
    };
    await ctx.model.User._updateOne({ id: userId }, updateData);
  }

  async getUserList(requestData) {
    const { ctx } = this;

    const { id, username, status, phone, email } = requestData;

    const queryCond = {};
    if (id) queryCond.id = id;
    if (username) queryCond.username = { $regex: _.escapeRegExp(username) };
    if (phone) queryCond.phone = { $regex: _.escapeRegExp(phone) };
    if (email) queryCond.email = { $regex: _.escapeRegExp(email) };
    if (status) queryCond.status = status;

    const total = await ctx.model.User._count(queryCond);
    const data = await ctx.model.User._find(queryCond, null, { sort: '-update_time', skip: requestData.curPage * requestData.pageSize, limit: requestData.pageSize });

    return { total, data };
  }
}

module.exports = UserService;
