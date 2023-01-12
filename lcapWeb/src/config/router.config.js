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
      path: '/login',
      component: '@/pages/Login/UserLayout',
    },
    {
      path: '/view',
      component: '@/pages/view',
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      dynamic: false,
      routes: [
        {
          icon: 'fuzhimoban',
          name: '应用创建',
          path: '/app',
          component: '@/pages/App',
          routes: [
            {
              name: '项目管理',
              path: '/app/project-manage',
              component: '@/pages/App/ProjectManage',
            },
            {
              name: '项目详情',
              path: '/app/:id/project-detail/:name',
              component: '@/pages/App/ProjectDetail',
              hideInMenu: true,
              activeMenuKey: '/app/project-manage',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            {
              name: '应用开发',
              path: '/app/apply-develop',
              component: '@/pages/App/ApplyDevelop',
            },

            {
              name: '组件列表',
              path: '/app/component-develop',
              component: '@/pages/App/ComponentDevelop',
            },
            {
              name: '开发组件',
              path: '/app/code-develop/:id',
              component: '@/pages/App/ComponentDevelop/components/codeDevelop',
              hideInMenu: true,
              activeMenuKey: '/app/component-develop',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            { from: '/app', to: '/app/project-manage' },
          ],
        },
        {
          icon: 'tupushujuyuan',
          name: '数据源管理',
          path: '/data',
          component: '@/pages/Data',
          routes: [
            {
              name: '数据源管理',
              path: '/data/data-manage',
              hideInMenu: true,
              activeMenuKey: '/data',
              component: '@/pages/Data/DataManage',
            },
            {
              name: '创建数据源',
              hideInMenu: true,
              activeMenuKey: '/data',
              path: '/data/new-data',
              component: '@/pages/Data/NewData',
              showBack: true,
              backTitle: '数据源管理/创建数据源',
            },
            {
              name: '编辑数据源',
              hideInMenu: true,
              activeMenuKey: '/data',
              path: '/data/:id/change-data',
              component: '@/pages/Data/NewData',
              showBack: true,
              backTitle: '数据源管理/编辑数据源',
            },
            {
              name: '数据源详情',
              path: '/data/:id/data-detail',
              component: '@/pages/Data/DataDetail',
              hideInMenu: true,
              activeMenuKey: '/data',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            { from: '/data', to: '/data/data-manage' },
          ],
        },
        {
          icon: 'shujuchaxun',
          name: '数据查询',
          path: '/data-search',
          component: '@/pages/DataSearch',
          routes: [
            {
              name: '数据查询',
              path: '/data-search/search-manage',
              hideInMenu: true,
              activeMenuKey: '/data-search',
              component: '@/pages/DataSearch/List',
            },
            {
              name: '新建查询',
              hideInMenu: true,
              activeMenuKey: '/data-search',
              path: '/data-search/create',
              component: '@/pages/DataSearch/Create',
              showBack: true,
              backTitle: '数据查询/新建查询',
            },
            {
              name: '编辑数据查询',
              path: '/data-search/:id/edit',
              component: '@/pages/DataSearch/Edit',
              hideInMenu: true,
              activeMenuKey: '/data-search',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            {
              name: '新建数据组合查询',
              hideInMenu: true,
              activeMenuKey: '/data-search',
              path: '/data-search/create-group-search/:type',
              component: '@/pages/DataSearch/Group/Create',
              showBack: true,
              backTitle: '',
            },
            {
              name: '编辑数据组合查询',
              path: '/data-search/:id/edit-group-search',
              component: '@/pages/DataSearch/Group/Edit',
              hideInMenu: true,
              activeMenuKey: '/data-search',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            { from: '/data-search', to: '/data-search/search-manage' },
          ],
        },
        {
          icon: 'yonghuguanli',
          name: '用户管理',
          path: '/user',
          component: '@/pages/User',
          routes: [
            {
              name: '用户列表',
              path: '/user/user-manage',
              component: '@/pages/User/UserManage',
            },
            {
              name: '角色列表',
              path: '/user/role-manage',
              component: '@/pages/User/RoleManage',
            },
            {
              name: '导出资源',
              path: '/user/batchExport/batch-import-export',
              component:
                '@/pages/User/BatchImportExport/components/batchExport',
              hideInMenu: true,
              activeMenuKey: '/user/batch-import-export',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            {
              name: '导入资源',
              path: '/user/bulkImport/batch-import-export',
              component: '@/pages/User/BatchImportExport/components/bulkImport',
              hideInMenu: true,
              activeMenuKey: '/user/batch-import-export',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            {
              name: '导出成功',
              path: '/user/exportSuccess/batch-import-export',
              component:
                '@/pages/User/BatchImportExport/components/exportSuccess',
              hideInMenu: true,
              activeMenuKey: '/user/batch-import-export',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            {
              name: '导入成功',
              path: '/user/importSuccess/batch-import-export',
              component:
                '@/pages/User/BatchImportExport/components/importSuccess',
              hideInMenu: true,
              activeMenuKey: '/user/batch-import-export',
              showBack: true,
              backTitle: '', //如果二级或三级路由有返回模式，返回显示的文字
            },
            { from: '/user', to: '/user/user-manage' },
          ],
        },
        { from: '/', to: '/app/project-manage' },
      ],
    },
  ],
};
