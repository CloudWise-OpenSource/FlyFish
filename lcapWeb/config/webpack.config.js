/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-06 10:32:18
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-28 17:06:15
 */
const path = require('path');
const modifyVars = require('./themes/dark.js');

const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');

// 详细扩展配置参考  https://www.npmjs.com/package/@chaoswise/scaffold

const args = process.argv;

const isApi = args[3] === 'api';

const config = {
  debugIe: false, // 是否在ie下调试(关闭热更新)
  useMultipleTheme: false, // 是否开启多主题
  isCombinePortal: true, // 是否开启对接portal的配置
  publicPath: '', //对接portal时修改为/lcapWeb/，否则是/
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
    config.title = 'LCAP';
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
  build: (config) => {
    config.optimization.minimizer[0] = new TerserPlugin({
      exclude: /(www||conf)/,
      terserOptions: {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
          comparisons: false,
          inline: 2,
          drop_console: true,
        },
        mangle: {
          safari10: true,
        },
        keep_classnames: false,
        keep_fnames: false,
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
    });
    return config;
  },
  devServer: (config) => {
    config.port = 8000;
    config.proxy = {
      '/flyfish': {
        target: `http://10.2.3.56:8089`,
        changeOrigin: true,
      },
    };
    return config;
  },
};

const filePath = path.resolve(__dirname, '../package.json');
let data = '';
try {
  data = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (error) {
  console.log(error);
}
if (data) {
  const packageData = JSON.parse(data);
  packageData.packageName = isApi ? 'apiWeb' : 'lcapWeb';
  try {
    fs.writeFileSync(filePath, JSON.stringify(packageData, '', '\t'), {
      encoding: 'utf-8',
    });
  } catch (error) {
    console.log(error);
  }
}
if (isApi) {
  (config.publicPath = '/apiWeb/'),
    (config.entry = (config) => {
      config.index[1] = path.resolve(__dirname, '../src/apiEntry/index.js');
      return config;
    });
}

module.exports = config;
