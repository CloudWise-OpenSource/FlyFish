'use strict';
const CODE = require('../lib/error');
module.exports = config => {
  return async function authCheck(ctx, next) {
    const { reqUrlWhiteList, cookieConfig: { name }, apiKey } = config;

    const lcapCookieValue = ctx.cookies.get(name, { signed: false });
    if (reqUrlWhiteList.some(url => ctx.url.match(new RegExp(url)))) {
      await next();

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
