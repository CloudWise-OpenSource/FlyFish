/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-05-11 15:22:39
 * @LastEditors: tiger.wang
 * @LastEditTime: 2022-05-18 19:05:03
 */
// 2022-05-18 7:05
module.exports = {
  loadingComponent: "@/components/Loading", // 路由按需加载 loading组件
  noAuthShow: "@/components/NoAuth", // 无权限展示效果
  hocRouteWrapper: "@/components/hocRouteWrapper", // 每个路由可以通过高阶组件进行处理
  routes: [
    {
      path: "/404", // 路径
      code: "44", // 唯一code，权限校验用，无code代办无权限
      exact: true, // 是否精确匹配
      dynamic: false, // 是否懒加载
      component: "@/pages/Error",
    },
    {
      path: "/login",
      component: "@/pages/Login/UserLayout",
    },
    {
      path: "/",
      component: "@/layouts/BasicLayout",
      dynamic: false,
      routes: [
        {
          icon: "pie-chart",
          name: "应用创建",
          path: "/app",
          component: "@/pages/App",
          routes: [
            {
              name: "项目管理",
              path: "/app/project-manage",
              component: "@/pages/App/ProjectManage",
            },
            {
              name: "项目详情",
              path: "/app/:id/project-detail",
              component: "@/pages/App/ProjectDetail",
              hideInMenu: true,
              activeMenuKey: "/app/project-manage",
              showBack: true,
              backTitle: '' //如果二级或三级路由有返回模式，返回显示的文字
            },
            {
              name: "应用开发",
              path: "/app/apply-develop",
              component: "@/pages/App/ApplyDevelop",
            },

            {
              name: "组件开发",
              path: "/app/component-develop",
              component: "@/pages/App/ComponentDevelop",
            },
            {
              name: "开发组件",
              path: "/app/:id/code-develop",
              component: "@/pages/App/ComponentDevelop/components/codeDevelop",
              hideInMenu: true,
              activeMenuKey: "/app/component-develop",
              showBack: true,
              backTitle: '' //如果二级或三级路由有返回模式，返回显示的文字
            },
            { from: "/app", to: "/app/project-manage" },
          ],
        },
        {
          icon: "pie-chart",
          name: "用户管理",
          path: "/user",
          component: "@/pages/User",
          routes: [
            {
              name: "用户列表",
              path: "/user/user-manage",
              component: "@/pages/User/UserManage",
            },
            {
              name: "角色列表",
              path: "/user/role-manage",
              component: "@/pages/User/RoleManage",
            },
            { from: "/user", to: "/user/user-manage" },
          ],
        },
        { from: "/", to: "/app" },
      ],
    },
  ],
};

