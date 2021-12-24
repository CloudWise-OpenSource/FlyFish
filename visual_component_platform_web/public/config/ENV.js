/**
 * Created by chencheng on 2017/6/10.
 */

window.ENV = (function () {
    var rootPath = '/';     // 路由的根路径
    var publicPath = '/public';     // webpack.output.publicPath
    var apiDomain = "/apexAPI";    // api请求接口   测试服务器
    var coderDomain = "http://127.0.0.1:8080";    // vscode web server   测试服务器
    // var apiDomain = 'http://vc-dev.tianjishuju.com';    // api请求接口   测试服务器

    return {
					apiDomain: apiDomain,
					coderDomain: coderDomain,
					rootPath: rootPath, // 路由的根路径
					publicPath: publicPath, // webpack.output.publicPath
					apiSuccessCode: 0, // API接口响应成功的code

					visualComponent: {
						// 可视化组件配置
						getDevVisualUrl: (org_mark, component_mark) =>
							apiDomain +
							"/static/dev_visual_component/dev_workspace/" +
							org_mark +
							"/" +
							component_mark +
							"/editor.html", // 获取开发可视化URL
					},

					login: {
						errorCode: 900, // 未登录的error code
						isCheckLogin: true, // web端是否验证登录
						cookieKey: "__vcp_login_user_info__", // 登录成功的cookie key, 用于验证当前页面是否登录
						defaultRedirectUrl: rootPath + "visual/component/list", // 登录成功默认重定向的url
						loginUrl: rootPath + "login", // 登录页面url

						// 不需要验证是否登录的路由配置
						noCheckIsLoginRoutes: [rootPath + "login", rootPath + "registry"],
					},

					platformClassify: [
						// 平台分类
						{
							label: "数据处理平台",
							url: "http://ff-dev.tianjishuju.com/de/dataSource/list",
						},
						{
							label: "组件开发平台",
							url: "http://vc-dev.tianjishuju.com/de/visual/component/list",
						},
						{
							label: "数据应用平台",
							url: "http://solution-dev.tianjishuju.com/de/dataVisual/bigScreen",
						},
					],
				};
})();
