module.exports = {
    // platform 静态资源前缀
    platformPrefix: "/",

    // 不需要验证是否登录的路由配置
    noCheckIsLoginRoutes: [
        "/web/rbac/user/login",
        "/web/visualComponents/devComponentIO/compileDevComponent",
        "/web/rbac/user/captcha",
        "/web/rbac/user/registry",
    ],
};
