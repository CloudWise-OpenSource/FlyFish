/**
 * Created by chencheng on 2017/6/10.
 */

window.ENV = (function () {
    var rootPath = '/pw/';     // 路由的根路径
    var apiDomain = '';    // api请求接口   测试服务器

    return {
        apiDomain: apiDomain,         // api请求接口   测试服务器
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
                rootPath + 'registry',
            ]
        },

        visualScreen: { // 可视化大屏配置
            coverBasePath: apiDomain + '/upload/screen/cover',  // 大屏封面的webPath
            showBigScreen: '/static/big_screen/index.production.html',     // 查看大屏的地址
            editBigScreen: '/static/big_screen/editor.production.html',    // 编辑大屏地址
        },

        mock: {
            apiDomain: 'http://127.0.0.1:8180',     // mockApi请求接口
            isStart: false,                         // 是否开启mock
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
    }
})();
