import globalStore from '@/stores/globalStore';

function hocRouteWrapper(Com) {

  const {
    route
  } = Com.props;
  // 存储当前路由数据
  globalStore.updateCurrentRoute(route);
  return Com;
}

export default hocRouteWrapper;
