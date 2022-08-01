import React, { useState, useEffect, useRef } from 'react';
import QS from 'querystring';
import { useHistory, Link } from 'react-router-dom';
import {
  BasicLayout,
  Icon,
  ThemeProvider, Menu,
  ConfigProvider, Dropdown
} from '@chaoswise/ui';
import logo from './assets/logo-icon.svg';
import actions from '@/shared/mainActions';
import { loginout, getAuthMenuService } from './services';
import { observer,connect, toJS } from '@chaoswise/cw-mobx';
import globalStore from '@/stores/globalStore';
import ApiStore from '../../pages/ApiNew/ApiList/model/index';
const { getUserInfo, setMenuNameArr } = globalStore;

import styles from './index.less';
const Layout = observer((props) => {
  const {
    children,
    route, // 路由数据
    location
  } = props;
  const { currentGroupInfo } = ApiStore;
  const { currentRoute,userInfo } = globalStore;
  const history = useHistory();

  const currentPath = history.location.pathname;

  const { currentTheme } = ThemeProvider.useThemeSwitcher();
  const { locale } = ConfigProvider.useLocale();

  const [authMenuData, setAuthMenuData] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, []);
  useEffect(() => {
    if (userInfo) {
      getMenuInfo();
    }
  }, [userInfo]);
  useEffect(() => {
    // 更新全局状态通知子应用
    actions.setGlobalState({
      theme: currentTheme
    });
  }, [currentTheme]);

  useEffect(() => {
    // 更新全局状态通知子应用
    actions.setGlobalState({
      locale
    });
  }, [locale]);

  const getMenuInfo = async () => {
    let res = null;
    if (window.isInPortal) {
      res = await getAuthMenuService();
    } else {
      res = userInfo.menus;
    }
    if (res) {
      let menu = null;
      if (window.isInPortal) {
        menu= res.authResults.map(item => item.name);
      }else{
        menu= res.map(item => item.name);
      }
      setMenuNameArr(menu);
      let routeData = route.routes.filter(item => {
        if (item.routes) {
          item.routes = item.routes.filter(item2 => {
            return menu.includes(item2.name);
          });
        }
        return menu.includes(item.name);
      });
      const authMenu = getMenuData(routeData || []);
      setAuthMenuData(authMenu);
    }
  };
  /**
   * 通过路由配置文件生成menuData
   * @param {Arrary} routeData 路由配置
   */
  const getMenuData = (routeData) => {
    return routeData.map((item, index) => {
      if (item.routes) {
        return {
          ...item,
          icon: item.icon ? <Icon type={item.icon} /> : null,
          hasAuth: true, // 根据实际权限判断
          children: getMenuData(item.routes),
        };
      }
      return {
        ...item,
        hasAuth: true, // 根据实际权限判断
        icon: item.icon ? <Icon type={item.icon} /> : null
      };
    });
  };

  const onPathChange = (e) => {

    const menuProps = e.item.props;
    if (menuProps.target === 'open') {
      window.open(menuProps.url, 'target');
      return;
    }

    if (e.key === currentPath) {
      return;
    }
    history.push(e.key);
  };
  /**
   * 获取高亮菜单
   */
  const getActiveMenuKey = () => {

    // 映射高亮菜单
    if (currentRoute && currentRoute.activeMenuKey) {
      return currentRoute.activeMenuKey;
    }
    // 默认
    return currentPath;
  };

  // 获取当前路由下的配置，根据配置可进行一些定制化操作
  const { showBack, backTitle, name } = currentRoute;
  const goBack = () => {
    history.goBack();
  };
  // 动态的返回文字
  const routeBackName = () => {
    if (['分组管理','API授权','API访问控制'].includes(name)) {
      if (currentGroupInfo) {
        return currentGroupInfo.groupName;
      }
      return '分组管理';
    }
    if (name === '数据源详情') {
      if (location.search) {
        return `数据源管理 / ${QS.parse(location.search.slice(1)).name}`;
      }
      return '数据源管理';
    }
    if (name === "编辑数据查询") {
      if (location.search ) {
        return `数据查询/${QS.parse(location.search.slice(1)).name}`;
      }
      return "数据查询/编辑查询";
    }
    if (name === "新建数据组合查询") {
      if (location.state && location.state.name) {
        return `数据查询/新建${location.state.name}`;
      }
      return "数据查询/新建组合查询";
    }
    if (name === "编辑数据组合查询") {
      if (location.state && location.state.name) {
        return `数据查询/${location.state.name}`;
      }
      return "数据查询/编辑组合查询";
    }
    if (name === '项目详情') {
      if (location.state && location.state.name) {
        return `项目管理/${location.state.name}`;
      }
      return '项目管理';
    }
    if (name === '开发组件') {
      if (location.state && location.state.name) {
        return `开发组件/${location.state.name}`;
      }
      return '开发组件';
    }
    if (name === '组件记录') {
      if (location.state && location.state.name) {
        return `开发组件/${location.state.name}`;
      }
      return '开发组件';
    }
    if (name === '应用访问控制' || name === '应用绑定') {
      if (location.state && location.state.name) {
        return `应用管理/${location.state.name}`;
      }
      return '应用管理';
    }
    if (name === '导出资源' || name === '导入资源' || name === '导出成功' || name === '导入成功') {
      if (location.state && location.state.name) {
        return `管理/批量导入导出`;
      }
      return '管理';
    }
  };
  const clearCookies = () => {
    if (window.isInPortal) {
      window.location.href = `http://${window.location.host}/douc/api/v1/sso/logout?restapi=http://${window.location.host}/gateway/checkLogin&service=http://${window.location.host}`;
    } else {
      loginout();
      history.replace('/login');
    }
  };
  const rightMenu = (<Menu>
    <Menu.Item key="0" onClick={clearCookies}>
      <Icon type="logout" />
      <span style={{ textAlign: 'center' }} >退出</span>
    </Menu.Item>
  </Menu>);

  return (
    <BasicLayout
      logo={
        <div style={{ display: 'flex', alignItems: 'center', letterSpacing: '2px' }}>
          <img src={logo} />
          <span style={{ fontSize: '16px', marginLeft: '8px' }}>智能业务运维</span>
        </div>
      }
      headerTitle='低代码开发平台FlyFish'
      showHead={!window.isInPortal} // 嵌入大屏的不显示头部
      showTopNavigation={false}
      customContent={false}
      showBack={showBack}
      backNavigationTitle={backTitle || routeBackName()}
      showBreadcrumb={true}
      breadcrumbOptions={{
        // 格式化面包屑数据
        formatData: (data) => {
          if (data.length > 1) {
            data.shift();
          }
          return data;
        },
      }}
      headerExtra={ // 可以放置其它功能按钮
        <Dropdown overlay={rightMenu} placement="bottomLeft" >
          <span style={{ cursor: 'pointer' }}>{localStorage.getItem('username')}</span>
        </Dropdown>
      }
      // onClickTopNavigation={check}
      onClickBack={goBack}
      menuOptions={{
        menuData: authMenuData || [], //权限路由
        // menuData: getMenuData(route.routes || [], []),//route里路由
        selectedKeys: [getActiveMenuKey()],
        onClick: onPathChange
      }}
    >
      {children}
    </BasicLayout>
  );
});

export default Layout;
