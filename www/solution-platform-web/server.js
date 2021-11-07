/**
 * Created by chencheng on 16-11-17.
 */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require('./build/webpack.config');
const tool = require('./scripts/tool');
// const host = tool.getLocalIP() || '0.0.0.0';
const host = 'localhost';
const port = 8001;        // 端口号
const mockHost = 'http://localhost:3000';	// mock服务主机+端口
const isOpenAnalyzer = false;		// 是否开启性能分析

// webpack 自动重新加载，采用inline
config.entry.app.push('webpack-dev-server/client?http://' + host + ':' + port + '/');

// 添加webpack包分析工具
if (isOpenAnalyzer) {
    config.plugins.push(new BundleAnalyzerPlugin({
        openAnalyzer: false,            // 禁止自动弹出浏览器窗口
        analyzerHost: '127.0.0.1',      // 主机ip
        analyzerPort: port + 100,             // 端口
    }));
}
// 启动服务
const server = new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,

    // 指定服务器内容指定目录
    contentBase: config.output.path,

    watchContentBase: true,

    // 对于某些系统，监听大量文件系统会导致大量的 CPU 或内存占用,这个选项可以排除一些巨大的文件夹
    watchOptions: {
        ignored: /node_modules/,
    },

    // 开启服务器的模块热替换(HMR)
    hot: false,

    // 当请求不存在的路由时，直接返回首页
    historyApiFallback: {
        index: "/public/",
        disableDotRule: true,
    },

    stats: {
        colors: true,
    },
    proxy: {
        "/apexAPI": {
            target: "http://171.12.11.11:23368/",
            pathRewrite: { "^/apexAPI": "" },
        },
    },
});

// 将其他路由，全部返回index.html
server.app.get('*', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
});

console.log('http://' + host + ':' + port);

server.listen(port, host);

