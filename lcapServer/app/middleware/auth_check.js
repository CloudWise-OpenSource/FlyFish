'use strict';
const CODE = require('../lib/error');
module.exports = config => {
  return async function authCheck(ctx, next) {
    const { reqUrlWhiteList, cookieConfig: { name }, apiKey } = config;

    const lcapCookieValue = ctx.cookies.get(name, { signed: false });

    // 白名单
    const splitPaths = ctx.url.split('/');
    for (let i = 0; i < reqUrlWhiteList.length; i++) {
      const whiteUrl = reqUrlWhiteList[i];
      for (const path of splitPaths) {
        if (path.length === 24) reqUrlWhiteList[i] = whiteUrl.replace(':id', path);
      }
    }
    if (reqUrlWhiteList.some(url => ctx.url === url)) {
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
