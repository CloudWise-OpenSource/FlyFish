'use strict';

window.DATAVI_ENV = (function () {
  const apiDomain = '/api';
  const windowOrigin = window.location.origin;

  return {
    debug: true,
    useHttpProxy: false,
    apiDomain,
    componentsDir: 'www/components',
    apiSuccessCode: 200,

    yapiAddress: `${windowOrigin}/lcapWeb/index.html#/api`,

    screenAPI: {
      // 大屏展示和编辑用到的API
      getScreenData: '/applications/info', // 获取大屏数据
      saveScreenConf: '/applications/{id}/design', // 保存大屏配置
      uploadScreenImg: '/applications/img/{id}', // 上传大屏所需图片
      deleteUploadScreenImg: '/applications/img/{id}', // 删除上传的大屏所需图片
      getModelList: '/applications/getModelList', // 获取模型列表
      getModelData: '/applications/getModelData', // 获取模型数据
      getScreenComponentList: '/applications/components/list',
      getDataSearchData: `${windowOrigin}/lcap-data-server/api/dataplateform/unit/query`, // 获取数据查询数据
      getDataSearch: `${windowOrigin}/lcap-data-server/api/dataplateform/unit/findAll`,
      httpProxy: `${windowOrigin}/lcap-data-server/api/dataplateform/apiProxy`, // http代理服务
    },
  };
})();
