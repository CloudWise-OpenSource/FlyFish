/**
 * Created by chencheng on 16-10-11.
 */
const path = require("path");

let conf = {
	appEntry: "./src/index.js", //入口文件
	entryFileName: "./publish-index.html", //入口文件名称
	appName: "platform", //项目名称
	proxyPath: "/static/visual_component_platform/", //代理的前缀 注意：后面必须带斜线
	workerSensePath: "./web_modules/tj-sense/worker/worker-sense.js",
	webPath: path.resolve(__dirname, "../release"), //web目录
};

console.log(conf.webPath);

//清除字符串左右两侧的斜线
String.prototype.trimSlash = function () {
	return this.replace(/^\/|\/$/g, "");
};

//清除字符串左两侧的斜线
String.prototype.ltrimSlash = function () {
	return this.replace(/\/$/g, "");
};

//清除字符串右两侧的斜线
String.prototype.rtrimSlash = function () {
	return this.replace(/^\//g, "");
};

const exec = require("child_process").exec;
const fs = require("fs");
const clc = require("cli-color");

const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const webpackConf = require("../build/webpack.config");
const indexTplStr = require("./publishUtils/indexTpl");
const Tool = require("./publishUtils/tool");

console.log(clc.green("开始编译"));

/**
 * 错误处理方法
 * @param errorMsg
 */
function handleError(errorMsg) {
	//1.删除编译目录
	Tool.delDir(webpackConf.output.path);

	//2.删除入口文件
	fs.unlinkSync(conf.entryFileName);

	console.log(clc.yellow("错误:"));
	console.log(clc.red(errorMsg));

	process.exit();
}

/**
 * 告警处理方法
 * @param warnMsg
 */
function handleWarn(warnMsg) {
	console.log(clc.yellow("警告:"));
	console.log(clc.yellow(warnMsg));
}

//1.修改webpack的配置
webpackConf.entry.app = conf.appEntry;
webpackConf.output.publicPath = conf.proxyPath + conf.appName + "/";
webpackConf.output.path = conf.webPath.ltrimSlash() + "/" + conf.appName;
webpackConf.devtool = "";
webpackConf.plugins.push(
	new webpack.DefinePlugin({
		'process.assetsPath': `"${webpackConf.output.publicPath}/asserts"`
	})
)

// *************编译代码优化压缩*********************
webpackConf.mode = "production";
webpackConf.optimization.minimizer = [
	// 优化js
	new UglifyJsPlugin({
		cache: true,
		parallel: true,
		sourceMap: false,
		uglifyOptions: {
			output: {
				// 最紧凑的输出
				beautify: false,
				// 删除所有的注释
				comments: false,
			},
			warnings: false,

			compress: {
				// 在UglifyJs删除没有用到的代码时不输出警告

				drop_console: false,
				// 内嵌定义了但是只用到一次的变量
				collapse_vars: true,
				// 提取出出现多次但是没有定义成变量去引用的静态值
				reduce_vars: true,
			},
		},
	}),
	// 优化css
	new OptimizeCSSAssetsPlugin({}), // 优化css
];

//2.配置和生成入口文件index.html
let realIndexTpl = indexTplStr
	.replace("{$publicVendorCSS}", webpackConf.output.publicPath + "vendor.css")
	.replace("{$EnvConfJS}", conf.proxyPath + "config/ENV.js")
	.replace("{$runtime}", webpackConf.output.publicPath + "runtime.js")
	.replace("{$publicVendorJS}", webpackConf.output.publicPath + "vendor.js")
	.replace("{$publicAppJS}", webpackConf.output.publicPath + "app.js");

//验证发布目录是否存在
fs.stat(conf.webPath, function (err, stat) {
	if (err != null) {
		//创建发布目录
		fs.mkdirSync(conf.webPath);
	}

	//生成入口文件index.html
	fs.open(conf.entryFileName, "w", function (err, fd) {
		let buf = new Buffer(realIndexTpl);

		fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
			if (err) {
				handleError("生成入口文件index.html失败：" + err);
			} else {
				//打包编译platform
				doCompilerPlatform();
			}
		});
	});
});

function doCompilerPlatform() {
	webpack(webpackConf, function (err, stats) {
		let jsonStats = stats.toJson();
		if (jsonStats.errors.length > 0) {
			handleError(jsonStats.errors);
		}

		if (jsonStats.warnings.length > 0) {
			handleWarn(jsonStats.warnings);
		}

		let stepCount = 1;

		function isDone() {
			stepCount--;

			if (stepCount == 0) {
				console.log(clc.green("编译完成"));
			}
		}

		//1. copy worker-sense.js文件到编译目录下
		/*Tool.copyFileToDir(conf.workerSensePath,webpackConf.output.path,'worker-sense.js',function () {
            isDone();
        });*/

		//2. 将编译后的项目移动到发布目录

		//(1). move入口文件到发布目录
		fs.stat(conf.entryFileName, function (err, stat) {
			if (err == null) {
				if (stat.isFile()) {
					fs.renameSync(conf.entryFileName, conf.webPath + "/index.html");
					isDone();
				}
			}
		});
	});
}
