'use strict';

module.exports = () => {
  return async function notFoundHandler(ctx, next) {
    await next();
    if (ctx.status === 404 && !ctx.body) {
      ctx.body = {
        code: 404,
        msg: 'Not Found',
        data: null,
      };
      ctx.logger.error(ctx.body);
      ctx.status = 200;
    }
  };
};
