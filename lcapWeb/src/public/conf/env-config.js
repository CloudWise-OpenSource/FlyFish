/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-07 14:08:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-04-07 19:32:21
 */
window.lcapWebPublicpath = document.getElementById('singlespa-container')
  ? './lcapWeb/'// 同工程下package.json文件的packageName 字段自行修改
  : './';  // 统一此配置
window.LCAP_CONFIG = (function () {
  const isInPortal = !!document.querySelector('#singlespa-container');
  const hostname = '${CW_LOCAL_IP}';
  const port = '${CW_LOCAL_PORT}';
  const yapi_port = '${CW_YAPI_SERVER_PORT}';
  const code_port = '${CW_CODE_SERVER_PORT}';
  const static_dir = '${CW_INSTALL_APP_DIR}';
  const common_dir = 'lcapWeb/www';

  return isInPortal?
  {
    basename: "lcap", // 路由统一前缀，注册为微服务后必须有唯一值
    IP: "", // 后端服务IP地址
    screenEditAddress:`http://${hostname}:${port}/${common_dir}/web/screen/editor.html`,
    screenViewAddress: `http://${hostname}:${port}/${common_dir}/web/screen/index.html`,
    vscodeAddress: `http://${hostname}:${code_port}`,
    vscodeFolderPrefix: `${static_dir}/${common_dir}`,
    yapiAddress:`http://${hostname}:${yapi_port}`,
    apiDomain:'/gateway/lcap',
    wwwAddress:`http://${hostname}:${port}/${common_dir}`,
    snapshotAddress:`http://${hostname}:${port}`
  }:
  {
    basename: "", // 路由统一前缀，注册为微服务后必须有唯一值
    IP: "", // 后端服务IP地址
    screenEditAddress:`http://${hostname}:7001/web/screen/editor.html`,
    screenViewAddress: `http://${hostname}:7001/web/screen/index.html`,
    vscodeAddress: `http://${hostname}:8081`,
    vscodeFolderPrefix: '/data/www',
    yapiAddress:`http://${hostname}:3001`,
    apiDomain:'/api',
    wwwAddress:`http://${hostname}:7001`,
    snapshotAddress:`http://${hostname}:7001`
  };
})();
