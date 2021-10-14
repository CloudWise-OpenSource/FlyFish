
/**
 * @description webpack开发配置
 */
const baseConf = require('../../../webpack.config.base');
const path = require('path');
const _ = require('lodash');

const defaultConfig = { 
  ...baseConf, 
  module: {
      ...baseConf.module,
      rules: (baseConf.module.rules || []).map(v => {
          if (v.use && Array.isArray(v.use) && v.use.find(s => s.loader === 'less-loader')) {
              v = {
                  ...v,
                  use: v.use.map(s => {
                      if (s.loader === 'less-loader') {
                          s = {
                              ...s,
                              options: {
                                  ...s.options,
                                  javascriptEnabled: true,
                                  modifyVars: {
                                      "ant-prefix": "ant4",
                                  }
                              }
                          };
                      }
                      return s;
                  })
              }
          }
          return v;
      })
  } 
}

module.exports = _.defaultsDeep({
    // 用于生成源代码的mapping
    devtool: '#source-map',
    mode: 'development',
    entry:{
        "FoldLineChart/main":"./src/main.js",
        "FoldLineChart/setting":"./src/setting.js",
    },
    output: {
        // 编译的目录
        path: path.resolve(__dirname, '../') + '/components/',
    },
}, defaultConfig);

