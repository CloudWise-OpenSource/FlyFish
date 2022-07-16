'use strict';
// 用户来源
exports.USER_FROM = {
  DOUC: 'douc',
  SELF: 'self',
};

// 数据来源
exports.DATA_FROM = {
  LCAP_INIT: 'lcap-init',
};

// 组件类型
exports.COMPONENT_TYPE = {
  COMMON: 'common', // 公共组件
  PROJECT: 'project', // 项目组件
};

// 组件适配数据源
exports.COMPONENT_ALLOW_DATA_SOURCE = {
  ALLOW: 1,
  NOT_ALLOW: 0,
};

// 缩略图类型
exports.SNAPSHOT_TYPE = {
  AUTO: 1, // 自动生成
  CUSTOM: 2, // 自定义
};


// 组件开发状态
exports.COMPONENT_DEVELOP_STATUS = {
  DOING: 'doing', // 开发中
  ONLINE: 'online', // 已上线
};

// 可用状态
exports.COMMON_STATUS = {
  VALID: 'valid', // 可用的
  INVALID: 'invalid', // 不可用的
};

// 是否删除
exports.IS_DELETE = {
  NOT_DELETE: 0,
  DELETE: 1,
};

exports.APP_DEVELOP_STATUS = {
  DOING: 'doing', // 开发中
  TESTING: 'testing', // 测试中
  DELIVERED: 'delivered', // 已交付
  DEMO: 'demo', // demo
};

exports.ROLE = {
  ADMIN: '管理员',
  MEMBER: '成员',
};

// 应用类型
exports.APP_TYPE = {
  '2D': '2D',
  '3D': '3D',
};

// 标签类型
exports.TAG_TYPE = {
  APPLICATION: 'application',
  COMPONENT: 'component',
};

// 监控中心仪表盘类型
exports.DASHBOARD_TYPE = {
  INTERNAL: 1,
  CUSTOM: 2,
};

// 资源类型
exports.RESOURCE_TYPE = {
  APPLICATION: 'application',
  COMPONENT: 'component',
};

// 资源渲染阶段
exports.RENDER_STAGE = {
  DOING: 'doing', // 渲染中
  UNDONE: 'undone', // 未开始
  DONE: 'done', // 完成
};

// 资源渲染状态
exports.RENDER_STATUS = {
  SUCCESS: 'success', // 资源渲染成功
  FAIL: 'fail', // 资源渲染失败
};
