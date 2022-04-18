'use strict';
const CODE = require('../lib/error');
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      let status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      ctx.logger.error(err);

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        code: CODE.INTERNAL_ERR,
        msg: error,
        data: null,
      };

      // joi error
      if (status === 422) {
        status = 200;
        ctx.body.code = CODE.PARAM_ERR;
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};

