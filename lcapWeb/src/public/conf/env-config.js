window.LCAP_CONFIG = (function () {
  // 后端服务
  const windowOrigin = window.location.origin;
  // 服务端目录
  const static_dir = 'PRO_PATH/lcapWeb/lcapWeb';
  // www路径
  const common_dir = 'www';

  const config = {
    basename: 'lcap', // 路由统一前缀，注册为微服务后必须有唯一值
    screenEditAddress: `${windowOrigin}/${common_dir}/web/screen/editor.html`,
    screenViewAddress: `${windowOrigin}/${common_dir}/web/screen/index.html`,
    wwwAddress: common_dir,
    snapshotAddress: windowOrigin,
    apiDomain: '/api', // api代理
    javaApiDomain: '/lcap-data-server',
    isSplitComponentModule: false, // 是否拆分组件模块
    onlyApiModule: false, // 是否独立部署api
    componentSplitApiPrefix: '/api',
    vscodeFolderPrefix: `${static_dir}/${common_dir}`,
    vscodeAddress: '/lcapCode',
  };
  return config;
})();
