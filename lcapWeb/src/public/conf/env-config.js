/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-07 14:08:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-23 15:46:18
 */
window.lcapWebPublicpath = document.getElementById('singlespa-container')
  ? './lcapWeb/' // 同工程下package.json文件的packageName 字段自行修改
  : './'; // 统一此配置
window.LCAP_CONFIG = (function () {
  const hostname = '${CW_LOCAL_IP}';
  const port = '${CW_LOCAL_PORT}';
  const static_dir = '${CW_INSTALL_APP_DIR}';

  const httpProtocol = 'http';
  const common_dir = 'lcapWeb/www';
  const code_port = '';

  let config = {
    basename: 'lcap', // 路由统一前缀，注册为微服务后必须有唯一值
    IP: '', // 后端服务IP地址
    screenEditAddress: port
      ? `${httpProtocol}://${hostname}:${port}/${common_dir}/web/screen/editor.html`
      : `${httpProtocol}://${hostname}/${common_dir}/web/screen/editor.html`,
    screenViewAddress: port
      ? `${httpProtocol}://${hostname}:${port}/${common_dir}/web/screen/index.html`
      : `${httpProtocol}://${hostname}/${common_dir}/web/screen/index.html`,
    wwwAddress: `${common_dir}`,
    snapshotAddress: port
      ? `${httpProtocol}://${hostname}:${port}`
      : `${httpProtocol}://${hostname}`,

    apiDomain: '/gateway/lcap',
    javaApiDomain: '/gateway/lcap-data-server',
    testDomain: '/api',

    // 是否拆分组件模块
    isSplitComponentModule: true,
    componentSplitApiPrefix: `/gateway/lcap-dev`,
    vscodeFolderPrefix: `${static_dir}/${common_dir}`,
    vscodeAddress: code_port
      ? `${httpProtocol}://${hostname}:${code_port}`
      : `${httpProtocol}://${hostname}`,
  };
  //本地调试时放开下边
  // {
  //   basename: "", // 路由统一前缀，注册为微服务后必须有唯一值
  //   IP: "", // 后端服务IP地址
  //   screenEditAddress: `${httpProtocol}://${hostname}:7001/web/screen/editor.html`,
  //   screenViewAddress: `${httpProtocol}://${hostname}:7001/web/screen/index.html`,
  //   vscodeAddress: `${httpProtocol}://${hostname}:8081`,
  //   vscodeFolderPrefix: "/data/www",
  //   // yapiAddress: `${httpProtocol}://${hostname}:3001`,
  //   apiDomain: "/api",
  //   javaApiDomain: "",
  //   wwwAddress: `${httpProtocol}://${hostname}:7001`,
  //   snapshotAddress: `${httpProtocol}://${hostname}:7001`,
  // };
  return config;
})();
