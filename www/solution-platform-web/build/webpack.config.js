/**
 * @description webpack 打包配置
 */

const FormatWebpackConf = require('./FormatWebpackConf');
const baseWebpackConf = require('./webpack.config.base');

module.exports = new FormatWebpackConf(baseWebpackConf).end();

