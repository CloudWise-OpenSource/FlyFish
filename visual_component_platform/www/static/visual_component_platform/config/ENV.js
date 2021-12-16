/**
 * Created by chencheng on 2017/6/10.
 */

window.ENV = (function () {
    var rootPath = '/pw/';     // 路由的根路径
    var publicPath = '/static/visual_component_platform/platform';     // webpack.output.publicPath
    var apiDomain = 'http://127.0.0.1:8363';    // api请求接口

    return {
        apiDomain: apiDomain,           // api请求接口
        rootPath: rootPath,             // 路由的根路径
        publicPath: publicPath,         // webpack.output.publicPath
        apiSuccessCode: 0,              // API接口响应成功的code

        visualComponent: { // 可视化组件配置
            getDevVisualUrl: (org_mark, component_mark) => apiDomain + '/static/dev_visual_component/dev_workspace/' + org_mark + '/' + component_mark + '/editor.html' // 获取开发可视化URL
        },

        login: {
            errorCode: 900,                                         // 未登录的error code
            isCheckLogin: true,                                     // web端是否验证登录
            cookieKey: '__vcp_login_user_info__',                   // 登录成功的cookie key, 用于验证当前页面是否登录
            defaultRedirectUrl: rootPath + 'visual/component/list', // 登录成功默认重定向的url
            loginUrl: rootPath + 'login',                           // 登录页面url

            noCheckIsLoginRoutes: [ // 不需要验证是否登录的路由配置
                rootPath + 'login',
            ]
        },

        platformClassify: [ // 平台分类
            {
                label: '组件开发平台',
                url: 'http://127.0.0.1:8363',
            },
            {
                label: '数据应用平台',
                url: 'http://127.0.0.1:8362',
            }
        ]
    };
})();
