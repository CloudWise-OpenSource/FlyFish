/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-07 14:08:25
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-04-15 15:13:54
 */

window.LCAP_CONFIG = (function () {
  const hostname = '10.2.3.153';
  
  return {
    basename: "", // 路由统一前缀，注册为微服务后必须有唯一值
    IP: "", // 后端服务IP地址
    screenEditAddress:`http://${hostname}:7001/web/screen/editor.html`,
    screenViewAddress: `http://${hostname}:7001/web/screen/index.html`,
    vscodeAddress: `http://${hostname}:8081`,
    vscodeFolderPrefix: '/data/app/lcapEE/lcapWww',
    yapiAddress:`http://${hostname}:3001`,
    apiDomain:'/api',
    wwwAddress:`http://${hostname}:7001`,
    snapshotAddress:`http://${hostname}:7001`
  };
})();
