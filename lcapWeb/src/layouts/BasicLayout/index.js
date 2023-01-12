import React, { useState, useEffect, useRef } from 'react';
import QS from 'querystring';
import { useHistory, Link } from 'react-router-dom';
import {
  BasicLayout,
  Icon,
  ThemeProvider,
  Menu,
  ConfigProvider,
  Dropdown,
} from '@chaoswise/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import logo from './assets/logo-icon.svg';
import gongzuotai from './assets/gongzuotai.png';
// import actions from '@/shared/mainActions';
import {
  loginout,
  getAuthMenuService,
  getNodeVersionService,
  getDevVersionService,
  getApimServerVersionService,
} from './services';
import { observer, connect, toJS } from '@chaoswise/cw-mobx';
import globalStore from '@/stores/globalStore';
// import ApiStore from '../../pages/ApiNew/ApiList/model/index';
const { getUserInfo, setMenuNameArr } = globalStore;
import versionJson from '../serviceVersion.json';
import componentStore from '../../pages/App/ComponentDevelop/model/index';
import portalStore from '@/stores/portalStore';

import styles from './index.less';
let isShowSide = true;

const Layout = observer((props) => {
  const {
    children,
    route, // 路由数据
    location,
  } = props;
  // const {  currentProjectInfo,currentGroupInfo } = ApiStore;
  const { currentRoute, userInfo } = globalStore;

  const { developingData } = componentStore;

  const history = useHistory();

  const currentPath = history.location.pathname;

  const { currentTheme } = ThemeProvider.useThemeSwitcher();
  const { locale } = ConfigProvider.useLocale();
  const intl = useIntl();
  const [authMenuData, setAuthMenuData] = useState(null);
  const [version, setVersion] = useState({
    product: '',
    web: '',
    nodeServer: '',
    devServer: '',
    apimWeb: '',
    apimServer: '',
  });

  const isScreenFrame = window.name === 'api_frame';
  useEffect(() => {
    getUserInfo((userInfo) => {
      let menu = null;
      // eslint-disable-next-line max-nested-callbacks
      menu = userInfo.authResults.map((item) => item.name);
      setMenuNameArr(menu);
      // eslint-disable-next-line max-nested-callbacks
      let routeData = route.routes.filter((item) => {
        if (item.routes) {
          // eslint-disable-next-line max-nested-callbacks
          item.routes = item.routes.filter((item2) => {
            return menu.includes(item2.name);
          });
        }
        return menu.includes(item.name);
      });

      const authMenu = getMenuData(routeData || []);
      setAuthMenuData(authMenu);
    });
    if (isScreenFrame) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML =
        '.cw-side,.cwlayout{ display:none !important } #singlespa-container{height:100% !important;top:0 !important}';
      document.getElementsByTagName('head').item(0).appendChild(style);
    }
    // getVersion();
  }, []);
  console.log('language', localStorage.getItem('language'));
  // useEffect(() => {
  //   // 更新全局状态通知子应用
  //   actions.setGlobalState({
  //     theme: currentTheme
  //   });
  // }, [currentTheme]);

  // useEffect(() => {
  //   // 更新全局状态通知子应用
  //   actions.setGlobalState({
  //     locale
  //   });
  // }, [locale]);

  const getVersion = async () => {
    //获取web版本和产品版本
    const { productVersion, lcapWebVersion, hash, apimWebVersion, apimHash } =
      versionJson;
    setVersion({
      ...version,
      product: productVersion || '',
      web: `${lcapWebVersion || ''}(${hash || ''})`,
      apimWeb: `${apimWebVersion || ''}(${apimHash || ''})`,
    });
    //获取node版本
    const res = await getNodeVersionService();
    if (res && res.code === 0) {
      const { hash, version: nodeVersion } = res.data;
      setVersion((version) => {
        return {
          ...version,
          nodeServer: `${nodeVersion || ''}(${hash || ''})`,
        };
      });
    }
    //获取dev版本
    const res2 = await getDevVersionService();
    if (res2 && res2.code === 0) {
      const { hash, version: devVersion } = res2.data;
      setVersion((version) => {
        return {
          ...version,
          devServer: `${devVersion || ''}(${hash || ''})`,
        };
      });
    }
    //获取apimServer版本
    const res3 = await getApimServerVersionService();
    if (res3 && res3.code === 0) {
      const { hash, version: apimServer } = res3.data;
      setVersion((version) => {
        return {
          ...version,
          apimServer: `${apimServer || ''}(${hash || ''})`,
        };
      });
    }
  };
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
        menu = res.authResults.map((item) => item.name);
      } else {
        menu = res.map((item) => item.name);
      }
      setMenuNameArr(menu);
      let routeData = route.routes.filter((item) => {
        if (item.routes) {
          item.routes = item.routes.filter((item2) => {
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
          icon: item.icon ? <span className={item.icon}></span> : null,
          hasAuth: true, // 根据实际权限判断
          children: getMenuData(item.routes),
        };
      }
      return {
        ...item,
        hasAuth: true, // 根据实际权限判断
        icon: item.icon ? <span className={item.icon}></span> : null,
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
    if (name === '开发组件') {
      history.push('/app/component-develop');
    } else {
      history.goBack();
    }
  };
  // 动态的返回文字
  const routeBackName = () => {
    // if (['分组管理','API授权','API访问控制'].includes(name)) {
    //   if (currentGroupInfo) {
    //     return `${currentProjectInfo.name}-${currentGroupInfo.groupName}`;
    //   }
    //   return '分组管理';
    // }
    if (name === '访问控制') {
      return '应用管理/访问控制';
    }
    if (name === '绑定API') {
      return '应用管理/绑定API';
    }
    if (name === '基本信息') {
      return '应用管理';
    }
    if (name === '数据源详情') {
      if (location.state && location.state.name) {
        return `数据源管理 / ${location.state.name}`;
      }
      return '数据源管理';
    }
    if (name === '编辑数据查询') {
      if (location.state && location.state.name) {
        return `数据查询/${location.state.name}`;
      }
      return '数据查询/编辑查询';
    }
    if (name === '新建数据组合查询') {
      if (location.state && location.state.name) {
        return `数据查询/新建${location.state.name}`;
      }
      return '数据查询/新建组合查询';
    }
    if (name === '编辑数据组合查询') {
      if (location.state && location.state.name) {
        return `数据查询/${location.state.name}`;
      }
      return '数据查询/编辑组合查询';
    }
    if (name === '项目详情') {
      if (location.state && location.state.name) {
        return `项目管理/${location.state.name}`;
      }
      return '项目管理';
    }
    if (name === '开发组件') {
      if (developingData) {
        return `开发组件/${developingData.name}`;
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
    if (
      name === '导出资源' ||
      name === '导入资源' ||
      name === '导出成功' ||
      name === '导入成功'
    ) {
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
  const rightMenu = (
    <Menu>
      <Menu.Item key='0' onClick={clearCookies}>
        <Icon type='logout' />
        <span style={{ textAlign: 'center' }}>退出</span>
      </Menu.Item>
    </Menu>
  );
  let title = backTitle || routeBackName();
  if (title && title.length > 20) {
    title = title.substring(0, 20) + '...';
  }
  const getTitle = (data = authMenuData) => {
    //portal传入的页面标题信息
    const title = portalStore.pageTitle;
    //是否显示页面标题
    const isShowPageTitle =
      portalStore.isShowPageTitle === undefined
        ? true
        : portalStore.isShowPageTitle;
    //isShowBack 为原是否显示返回方法 <-
    if (!isShowPageTitle && !showBack) {
      return null;
    }
    if (title && !showBack) {
      return title;
    }
  };
  if (window?.PORTALAPP?.isUseSiderMenu) {
    isShowSide = false;
  }
  return (
    <BasicLayout
      logo={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '2px',
          }}
        >
          <img src={logo} />
          <span style={{ fontSize: '16px', marginLeft: '8px' }}>
            智能业务运维
          </span>
        </div>
      }
      showSider={isShowSide}
      headerTitle='低代码开发平台Flyfish'
      showHead={!(window.isInPortal || isScreenFrame)} // 集成portal不显示头部
      showTopNavigation={false}
      customContent={false}
      showBack={showBack}
      backNavigationTitle={portalStore ? getTitle() : title}
      backIcon={<span className='goBackIcon'></span>}
      showBreadcrumb={true}
      breadcrumbOptions={{
        // 格式化面包屑数据
        formatData: (data) => {
          if (data.length > 1) {
            data.shift();
          }
          if (portalStore && portalStore.pageTitle) {
            data[0].name = portalStore.pageTitle;
          }
          return data;
        },
      }}
      headerExtra={
        // 可以放置其它功能按钮
        <Dropdown overlay={rightMenu} placement='bottomLeft'>
          <span style={{ cursor: 'pointer' }}>
            {localStorage.getItem('username')}
          </span>
        </Dropdown>
      }
      // onClickTopNavigation={check}
      onClickBack={goBack}
      menuOptions={{
        menuData: authMenuData || [], //权限路由
        // menuData: getMenuData(route.routes || [], []),//route里路由
        selectedKeys: [getActiveMenuKey()],
        onClick: onPathChange,
      }}
      // version={
      //   <span style={{ cursor: 'pointer', marginLeft: 5 }}>{version.product}</span>
      // }
      //       versionTooltip={
      //         `${intl.formatMessage({
      //           id: 'common.versionInfo',
      //           defaultValue: '版本信息'
      //         })
      //         }:
      // lcapWeb:${version.web}
      // lcapServer:${version.nodeServer}
      // lcapDevServer:${version.devServer}
      // apimWeb:${version.apimWeb}
      // apimServer:${version.apimServer}
      // }`
      //       }
    >
      {children}
    </BasicLayout>
  );
});

export default Layout;
