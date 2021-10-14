
/**
 * @description webpack开发配置
 */
const baseConf = require('../../../webpack.config.base');
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

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
    mode: 'production',
    optimization: {
        minimizer: [
            // 优化js
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                uglifyOptions:{
                    output: {
                        // 最紧凑的输出
                        beautify: false,
                        // 删除所有的注释
                        comments: false,
                    },
                    compress: {
                        // 在UglifyJs删除没有用到的代码时不输出警告
                        warnings: false,

                        drop_console: false,
                        // 内嵌定义了但是只用到一次的变量
                        collapse_vars: true,
                        // 提取出出现多次但是没有定义成变量去引用的静态值
                        reduce_vars: true,
                    }
                }
            })
        ]
    },
    entry:{
        "WaterWaveBall/main":"./src/main.js",
        "WaterWaveBall/setting":"./src/setting.js",
    },
    output: {
        // 编译的目录
        path: path.resolve(__dirname, '../') + '/release/',
    },
    plugins: [
        
    ]
}, defaultConfig);

