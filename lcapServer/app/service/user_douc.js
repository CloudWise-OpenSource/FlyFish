'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const md5 = require('md5');
const _ = require('lodash');
const DEFAULT_PASSWORD = '123456';

class UserDoucService extends Service {
  async syncUser() {
    const { ctx, logger, config: { docpCookieConfig: { name: docpCookieName }, services: { douc: { baseURL } } } } = this;

    let syncUserInfo = {};
    const docpCookieValue = ctx.cookies.get(docpCookieName, { signed: false });
    const { userid: doucUserId, username: doucUsername, accountid } = ctx.headers;

    const lcapUsername = `docp-${accountid}-${doucUserId}`;
    logger.info(`douc user info: userid: ${doucUserId}, username: ${doucUsername}, lcapUsername: ${lcapUsername}`);

    const headers = {
      Cookie: `${docpCookieName}=${docpCookieValue}`,
    };

    const { iuser } = await ctx.http.get(baseURL + '/api/v1/auth?module=lcap', {}, { headers });
    const existsUserInfo = await ctx.model.User._findOne({ username: lcapUsername });
    syncUserInfo = existsUserInfo;

    const roleInfo = await ctx.model.Role._findOne({ name: iuser.isAdmin ? Enum.ROLE.ADMIN : Enum.ROLE.MEMBER });
    if (_.isEmpty(existsUserInfo)) {
      logger.info(`repeat username ${lcapUsername}!!!!!!!!!!!!!!!!!!!!!!!!!!`);
      const createUserInfo = {
        username: lcapUsername,
        phone: '',
        email: `${doucUsername}@yunzhihui.com`,
        password: md5(DEFAULT_PASSWORD),
        role: roleInfo.id,
        isDouc: true,
      };
      await ctx.model.User._create(createUserInfo);
      const userInfo = await ctx.model.User._findOne({ username: createUserInfo.username });
      syncUserInfo = userInfo;
    } else {
      const updateUseInfo = {};
      if (roleInfo.id !== existsUserInfo.role) updateUseInfo.role = syncUserInfo.role = roleInfo.id;
      if (!existsUserInfo.isDouc) updateUseInfo.isDouc = true;
      if (!_.isEmpty(updateUseInfo)) await ctx.model.User._updateOne({ id: existsUserInfo.id }, updateUseInfo);
    }

    return {
      userId: syncUserInfo.id,
      username: syncUserInfo.username,
      role: syncUserInfo.role,
      phone: syncUserInfo.phone,
      email: syncUserInfo.email,
    };
  }
}

module.exports = UserDoucService;
