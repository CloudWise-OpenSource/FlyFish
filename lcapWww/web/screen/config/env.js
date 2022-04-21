/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-29 15:13:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-03-10 11:01:39
 */
/**
 * @description 大屏配置
 */
'use strict';

window.DATAVI_ENV = (function() {
  const apiDomain = '';

  return {
    debug: true,
    apiDomain,
    componentsDir: '/components',
    apiSuccessCode: 200,

    yapiAddress: 'http://127.0.0.1:3001',

    screenAPI: {
      // 大屏展示和编辑用到的API
      getScreenData: '/applications', // 获取大屏数据
      saveScreenConf: '/applications/{id}/design', // 保存大屏配置
      uploadScreenImg: '/applications/img/{id}', // 上传大屏所需图片
      deleteUploadScreenImg: '/applications/img/{id}', // 删除上传的大屏所需图片
      getModelList: '/applications/getModelList', // 获取模型列表
      getModelData: '/applications/getModelData', // 获取模型数据
      getScreenComponentList: '/applications/components/list',
    },
  };
}());

