/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-29 15:13:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-09 17:54:34
 */
/**
 * @description 大屏配置
 */
'use strict';

window.DATAVI_ENV = (function() {
  const apiDomain = '/gateway/lcap';

  return {
    debug: true,
    useHttpProxy: true,
    apiDomain,
    componentsDir: 'lcapWeb/www/components',
    apiSuccessCode: 200,

    yapiAddress: 'http://${CW_LOCAL_IP}:${CW_LOCAL_PORT}/lcapWeb/index.html#/api',

    screenAPI: {
      // 大屏展示和编辑用到的API
      getScreenData: '/applications', // 获取大屏数据
      saveScreenConf: '/applications/{id}/design', // 保存大屏配置
      uploadScreenImg: '/applications/img/{id}', // 上传大屏所需图片
      deleteUploadScreenImg: '/applications/img/{id}', // 删除上传的大屏所需图片
      getModelList: '/applications/getModelList', // 获取模型列表
      getModelData: '/applications/getModelData', // 获取模型数据
      getScreenComponentList: '/applications/components/list',
      getDataSearchData: 'http://${CW_LOCAL_IP}:${CW_LOCAL_PORT}/gateway/lcap-data-server/api/dataplateform/unit/query', // 获取数据查询数据
      getDataSearch: 'http://${CW_LOCAL_IP}:${CW_LOCAL_PORT}/gateway/lcap-data-server/api/dataplateform/unit/findAll',
      httpProxy: 'http://${CW_LOCAL_IP}:${CW_LOCAL_PORT}/gateway/lcap-data-server/api/dataplateform/apiProxy', // http代理服务
    },
  };
}());

