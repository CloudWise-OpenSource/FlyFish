/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-07 14:08:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-12-27 10:58:36
 */
window.FLYFISH_CONFIG = (function () {
  // 后端服务
  const windowOrigin = window.location.origin;
  // 服务端目录
  const static_dir = 'PRO_PATH/lcapWeb/lcapWeb';
  // www路径
  const common_dir = 'www';
  let config = {
    basename: 'flyfish', // 路由统一前缀，注册为微服务后必须有唯一值
    IP: '', // 后端服务IP地址
    screenEditAddress: `${windowOrigin}/${common_dir}/web/screen/editor.html`,
    screenViewAddress: `${windowOrigin}/${common_dir}/web/screen/index.html`,
    wwwAddress: `${common_dir}`,
    snapshotAddress: windowOrigin,

    apiDomain: `/flyfish`,
    //是否隐藏dwf入口,默认隐藏
    isHideDwfEntrance: true,
    //是否隐藏组件市场入口,默认展示
    isHideLcapMarketEntrance: false,
    //组件市场入口链接配置
    lcapMarketEntranceLink: `https://www.cloudwise.ai/flyFishComponents.html`,
    // 是否拆分组件模块
    isSplitComponentModule: false,
    devServerPrefix: `/flyfish-dev`,
    devServerExportPrefix: `/flyfish`,
    vscodeFolderPrefix: `${static_dir}${common_dir}`,
    vscodeAddress: '/lcapCode',
  };
  return config;
})();
