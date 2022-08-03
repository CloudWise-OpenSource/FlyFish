/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-07 14:08:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-07-18 16:13:55
 */
window.LCAP_CONFIG = (function () {
  //后端服务
  const hostname = 'local_ip';
  const fontPort = "8089";
  const backPort = '';
  //服务端目录
  const static_dir = 'PRO_PATH/lcapWeb/lcapWeb';
  //协议
  const httpProtocol = 'http';
  //www路径
  const common_dir = 'www';
  //code-server端口
  const code_port = '';

  let config = {
    basename: 'lcap', // 路由统一前缀，注册为微服务后必须有唯一值
    IP: '', // 后端服务IP地址
    screenEditAddress: fontPort
      ? `${httpProtocol}://${hostname}:${fontPort}/${common_dir}/web/screen/editor.html`
      : `${httpProtocol}://${hostname}/${common_dir}/web/screen/editor.html`,
    screenViewAddress: fontPort
      ? `${httpProtocol}://${hostname}:${fontPort}/${common_dir}/web/screen/index.html`
      : `${httpProtocol}://${hostname}/${common_dir}/web/screen/index.html`,
    wwwAddress: `${common_dir}`,
    snapshotAddress: backPort
      ? `${httpProtocol}://${hostname}:${backPort}`
      : `${httpProtocol}://${hostname}:${fontPort}`,

    apiDomain: '/api',//api代理
    javaApiDomain: '/lcap-data-server',

    // 是否拆分组件模块
    isSplitComponentModule: false,
    onlyApiModule:false,//是否独立部署api
    componentSplitApiPrefix: `/api`,
    vscodeFolderPrefix: `${static_dir}/${common_dir}`,
    vscodeAddress: code_port
      ? `${httpProtocol}://${hostname}:${code_port}`
      : '/lcapCode',
  };
  return config;
})();
