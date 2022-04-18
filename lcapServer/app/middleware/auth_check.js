'use strict';
const CODE = require('../lib/error');
const _ = require('lodash');

module.exports = config => {
  return async function authCheck(ctx, next) {
    const { reqUrlWhiteList, syncUserList, docpCookieConfig: { name: docpCookieName }, cookieConfig: { name }, services: { douc: { baseURL } }, apiKey } = config;

    const docpCookieValue = ctx.cookies.get(docpCookieName, { signed: false });
    const lcapCookieValue = ctx.cookies.get(name, { signed: false });

    // 白名单
    if (reqUrlWhiteList.includes(ctx.url)) {
      await next();

    // docp用户鉴权
    } else if (docpCookieValue) {
      const userInfo = await ctx.service.userDouc.syncUser();
      if (!userInfo.username || !userInfo.userId || !userInfo.role) {
        ctx.body = {
          code: CODE.AUTH_FAIL,
          msg: 'AUTH FAIL',
          data: null,
        };
        return;
      }

      if (syncUserList.includes(ctx.url)) await ctx.service.userYapi.syncUser(userInfo);
      ctx.userInfo = userInfo;
      await next();

    // lcap用户鉴权
    } else if (lcapCookieValue) {
      const userInfo = ctx.helper.getCookie();
      if (!userInfo.username || !userInfo.userId || !userInfo.role) {
        ctx.body = {
          code: CODE.AUTH_FAIL,
          msg: 'AUTH FAIL',
          data: null,
        };
        return;
      }

      if (syncUserList.includes(ctx.url)) await ctx.service.userYapi.syncUser(userInfo);
      ctx.userInfo = userInfo;
      await next();
    } else if (ctx.apiKey === apiKey) {
      await next();
    } else {
      ctx.body = {
        code: CODE.AUTH_FAIL,
        msg: 'AUTH FAIL',
        data: null,
      };
      return;
    }
  };
};

