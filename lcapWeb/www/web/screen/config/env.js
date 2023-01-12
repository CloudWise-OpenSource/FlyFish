/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-29 15:13:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-12 17:18:36
 */
/**
 * @description 大屏配置
 */
'use strict';

window.DATAVI_ENV = (function () {
  const apiDomain = '';

  return {
    debug: true,
    useHttpProxy: true,
    apiDomain,
    componentsDir: 'www/components',
    uploadImgDir: '',
    apiSuccessCode: 200,

    screenAPI: {
      // 大屏展示和编辑用到的API
      getScreenData: '/flyfish/applications/info', // 获取大屏数据
      saveScreenConf: '/flyfish/applications/{id}/design', // 保存大屏配置
      uploadScreenImg: '/flyfish-dev/file/uploadFile', // 上传大屏所需图片
      uploadScreenCoverImg: '/flyfish-dev/applications/uploadAppCoverPic',
      getScreenComponentList: '/flyfish/components/list-with-category',
      getDataSearchData: `/flyfish/unit/query`, // 获取数据查询数据
      getDataSearch: `/flyfish/unit/findAll`,
      getDataSearchById: `/flyfish/unit`,
      getSearchComponentList: '/flyfish/components/list-with-id-name', //获取组件搜索数据
      httpProxy: `/flyfish/apiProxy`, // http代理服务
      getApplicationShare: '/flyfish/applications/{id}/share',
      saveApplicationShare: '/flyfish/applications/{id}/share',
      checkApplicationShareKey: '/flyfish/applications/checkShareKey',
      checkApplicationSharePassword: '/flyfish/applications/checkPwd',
      getScreenSourceList: '/flyfish/component-group/findList-by-category', // 获取资源列表
      getScreenSourceCategory: '/flyfish/component-gp-cat/list', // 获取资源分类
      getVariableList: '/flyfish/app-vars/list',
      saveVariable: '/flyfish/app-vars/',
      removeVariable: '/flyfish/app-vars/delete/',
    },
  };
})();
