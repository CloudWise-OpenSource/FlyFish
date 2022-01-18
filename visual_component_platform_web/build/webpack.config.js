/**
 * @description webpack 打包配置
 */

const FormatWebpackConf = require('./FormatWebpackConf');
const baseWebpackConf = require('./webpack.config.base');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const { webpack } = require('webpack');

module.exports = new FormatWebpackConf(baseWebpackConf)
	// 用于处理monaco-editor
	.use((webpackConf) => {
		webpackConf.plugins.push(
			new CopyWebpackPlugin([
				{
					from: 'web_modules/require.min.js',
					to: 'require.min.js',
				},
				{
					from: "web_modules/asserts",
					to: "asserts/",
				},
			]),
			new MonacoWebpackPlugin({
				// available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
				languages: ['json', 'html', 'javascript', 'css', 'less', 'scss', 'markdown', 'typescript', 'xml']
			})
		)
	})
	.end();

