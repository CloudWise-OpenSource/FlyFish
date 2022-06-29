/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-05-31 14:07:19
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-05-31 17:08:56
 */
module.exports = {
  loadingComponent: '@/components/Loading', // 路由按需加载 loading组件
  noAuthShow: '@/components/NoAuth', // 无权限展示效果
  hocRouteWrapper: '@/components/hocRouteWrapper', // 每个路由可以通过高阶组件进行处理
  routes: [
    {
      path: '/404', // 路径
      code: '44', // 唯一code，权限校验用，无code代办无权限
      exact: true, // 是否精确匹配
      dynamic: false, // 是否懒加载
      component: '@/pages/Error',
    },
    {
      path: '/',
      component: '@/layouts/BasicLayoutApi',
      dynamic: false,
      routes: [
        {
          path: "/api",
          icon: "pie-chart",
          name: "API应用服务层",
          component: "@/pages/ApiNew",
          routes: [
            {
              name: "API列表",
              path: "/api/api-list",
              component: "@/pages/ApiNew/ApiList/index.js",
            },
            {
              name: "API访问控制",
              path: "/api/accessControl/:id",
              component: "@/pages/ApiNew/ApiList/components/AccessControl/index.js",
              hideInMenu: true,
              activeMenuKey: "/api/api-list",
              showBack: true
            },
            {
              name: "API授权",
              path: "/api/authorize/:id",
              component: "@/pages/ApiNew/ApiList/components/ApiAuthorize/index.js",
              hideInMenu: true,
              activeMenuKey: "/api/api-list",
              showBack: true
            },
            {
              name: "分组管理",
              path: "/api/group",
              component: "@/pages/ApiNew/ApiList/components/groupManage/index.jsx",
              hideInMenu: true,
              activeMenuKey: "/api/api-list",
              showBack: true
            },
            {
              name: "应用管理",
              path: "/api/api-manage",
              component: "@/pages/ApiNew/ApiManage/index.js",
            },
            { from: "/api", to: "/api/api-list" },
          ]
        },
        { from: "/", to: "/api" },
      ]
    }
  ],
};
