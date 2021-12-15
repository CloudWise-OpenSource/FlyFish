/**
 * @description webpack发布配置
 */

module.exports = (org_mark, component_mark) => `
/**
 * @description webpack开发配置
 */
const baseConf = require('../../../webpack.config.base');
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

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
        "${component_mark}/main":"./src/main.js",
        "${component_mark}/setting":"./src/setting.js",
    },
    output: {
        // 编译的目录
        path: path.resolve(__dirname, '../') + '/release/',
    },
    plugins: [
        
    ]
}, baseConf);

`;
