/**
 * Created by chencheng on 2017/6/10.
 */

window.ENV = (function () {
    var rootPath = '/pw/';     // 路由的根路径
    var apiDomain = 'http://127.0.0.1:8364';    // api请求接口   测试服务器
    var coderDomain = "http://127.0.0.1:8081";    // vscode web server   测试服务器

    return {
        apiDomain: apiDomain,         // api请求接口   测试服务器
        coderDomain: coderDomain,
        rootPath: rootPath,           // 路由的根路径
        apiSuccessCode: 0,    // API接口响应成功的code

        login: {
            errorCode: 900,                                 // 未登录的error code
            isCheckLogin: true,                            // web端是否验证登录
            cookieKey: '__login_solution_user_info__',               // 登录成功的cookie key, 用于验证当前页面是否登录
            defaultRedirectUrl: rootPath + 'dataVisual/bigScreen',  // 登录成功默认重定向的url
            loginUrl: rootPath + 'login',                   // 登录页面url

            // 不需要验证是否登录的路由配置
            noCheckIsLoginRoutes: [
                rootPath + 'login',
            ]
        },

        visualScreen: { // 可视化大屏配置
            coverBasePath: apiDomain + '/upload/screen/cover',  // 大屏封面的webPath
            showBigScreen: '/static/big_screen/index.html',     // 查看大屏的地址
            editBigScreen: '/static/big_screen/editor.html',    // 编辑大屏地址
        },
        visualComponent: {
            // 可视化组件配置
            getDevVisualUrl: (org_mark, component_mark) =>
                apiDomain +
                '/static/dev_visual_component/dev_workspace/' +
                org_mark +
                '/' +
                component_mark +
                '/editor.html', // 获取开发可视化URL
        },

        mock: {
            apiDomain: 'http://127.0.0.1:8180',     // mockApi请求接口
            isStart: false,                         // 是否开启mock
        }
    }
})();
