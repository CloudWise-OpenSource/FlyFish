/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-06 10:32:18
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-07-11 18:04:45
 */
const path = require('path');
const modifyVars = require('./themes/dark.js');
// 详细扩展配置参考  https://www.npmjs.com/package/@chaoswise/scaffold

const config = {
  debugIe: false, // 是否在ie下调试(关闭热更新)
  useMultipleTheme: false, // 是否开启多主题
  isCombinePortal: true, // 是否开启对接portal的配置
  publicPath: '/lcapWeb/', //对接portal时修改为/lcapWeb/，否则是/
  prettierFixed: false,
  disableESLintPlugin: true,
  hot: true,
  isNoticeUpdate: false, // 是否开启升级通知
  routerType: 'hash', // 路由类型browser|hash  默认 hash
  themes: [
    {
      name: 'light',
      entryPath: path.resolve(__dirname, './themes/light.js'),
    },
    {
      name: 'dark',
      entryPath: path.resolve(__dirname, './themes/dark.js'),
    },
  ],
  modifyVars, // 非多主题下样式变量

  htmlTagsPlugin: (config) => {
    config.tags = ['conf/env-config.js'];
    return config;
  },
  htmlPlugin: (config) => {
    config.excludeAssets = [];
    config.title = 'FlyFish';
    return config;
  },
  copyPlugin: (config) => {
    config.patterns.push({
      from: path.resolve(__dirname, '../src/assets/diff'),
      to: 'diff',
    });
    config.patterns.push({
      from: path.resolve(__dirname, '../scripts'),
      to: './scripts',
    });
    config.patterns.push({
      from: path.resolve(__dirname, '../lcapWeb.yaml'),
      to: '.',
    });
    config.patterns.push({
      from: path.resolve(__dirname, '../www'),
      to: './www',
    });
    return config;
  },
  devServer: (config) => {
    config.port = 8000;
    config.proxy = {
      '/api': {
        target: 'http://10.2.2.249:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
        onProxyReq(proxyReq) {
          proxyReq.setHeader(
            'cookie',
            'locale=en-us; FLY_FISH_V2.0=jNP1eG7jeiXED7Go6d5P4YC8qGI5kJO8gYFT3VLlg8GX3XhTme7n3OhABxVbGjJNlTIc/EW06c8o+D4/bE1YaepqEiqb//d/jD4spssRx2z3T2SI5lWpPZPkJjhE9s4fHt3HPvzgkNIa6rO/X5om8nPznidjnpT9LDq7/NB1noS3r4fNt1CbzAKqlTugL7eC'
          );
        },
      },
      '/lcap-data-server': {
        target: 'http://10.2.2.249:18532',
        changeOrigin: true,
        pathRewrite: {
          '^/lcap-data-server': '',
        },
        onProxyReq(proxyReq) {
          proxyReq.setHeader(
            'cookie',
            'locale=en-us; FLY_FISH_V2.0=jNP1eG7jeiXED7Go6d5P4YC8qGI5kJO8gYFT3VLlg8GX3XhTme7n3OhABxVbGjJNlTIc/EW06c8o+D4/bE1YaepqEiqb//d/jD4spssRx2z3T2SI5lWpPZPkJjhE9s4fHt3HPvzgkNIa6rO/X5om8nPznidjnpT9LDq7/NB1noS3r4fNt1CbzAKqlTugL7eC'
          );
        },
      },
    };
    return config;
  },
};

module.exports = config;
