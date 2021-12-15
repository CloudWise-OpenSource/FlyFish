module.exports = [
    // 代理平台的静态页面
    [/^\/pw\/(.*)/i, '/web/view/index/platform', 'get'],
    [/^\/proxyDataHub\/(.*)/i, 'web/proxy', 'rest'],
];
