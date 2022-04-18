'use strict';

const CODE = {
  SUCCESS: 0, // 成功
  FAIL: 1, // 失败

  INTERNAL_ERR: 1000, // 内部错误
  PARAM_ERR: 1001, // 参数错误
  AUTH_FAIL: 1002, // 验证失败
  ALREADY_EXISTS: 1003, // 已经存在
};

module.exports = CODE;
