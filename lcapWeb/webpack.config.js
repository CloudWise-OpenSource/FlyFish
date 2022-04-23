/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-06 10:32:18
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-04-14 10:03:20
 */
const path = require('path');
const modifyVars = require('./themes/dark.js');

// 详细扩展配置参考  https://www.npmjs.com/package/@chaoswise/scaffold

module.exports = {
  debugIe: false, // 是否在ie下调试(关闭热更新)
  useMultipleTheme: false, // 是否开启多主题
  isCombinePortal: false, // 是否开启对接portal的配置
  publicPath: '/',//对接portal时修改为/lcapWeb/，否则是/
  prettierFixed: false,
  hot:true,
  isNoticeUpdate: false, // 是否开启升级通知
  routerType: 'hash', // 路由类型browser|hash  默认 hash
  themes: [
    {
      name: 'light',
      entryPath: path.resolve(__dirname, './themes/light.js')
    },
    {
      name: 'dark',
      entryPath: path.resolve(__dirname, './themes/dark.js')
    }
  ],
  modifyVars, // 非多主题下样式变量

  htmlTagsPlugin: config => {
    config.tags = [
      'conf/env-config.js',
    ];
    return config;
  },
  htmlPlugin: config => {
    config.excludeAssets = [];
    config.title = 'FlyFish';
    return config;
  },
  copyPlugin:config=>{
    config.patterns.push({
      from:path.resolve(__dirname,'../src/assets/diff'),
      to:'diff'
    });
    config.patterns.push({
      from:path.resolve(__dirname,'../scripts'),
      to:'./scripts'
    });
    config.patterns.push({
      from:path.resolve(__dirname,'../lcapWeb.yaml'),
      to:'.'
    });
    return config;
  },
  devServer: config => {
    config.port = 8000;
    config.proxy = {
      "/api": {
        target: "http://10.2.3.56:7001",
        changeOrigin:true,
        pathRewrite: {
          "^/api": "",
        },
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader(
              'cookie',
              'locale=en-us; FLY_FISH_V2.0=CM0gjxPflfzqKGborcqydz1b7/3SJIfWUYx2nUSauPcGgiRI5zEX1uC4qOAqFyysvESpjN/mu92jsHT5K21vy4dgfi5TbvNsG+xhkMQRu0lgCvuGmS50WOku/ROZmiRmK1YigwUG0U6kHoZVhbW9vrouG5rOVY/iabCdw9LSaXfq4udNhZ3qyFOqex0K/CRT',
          );
        },
      },
    };
    return config;
  }
};
