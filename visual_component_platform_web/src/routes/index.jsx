/**
 * Created by chencheng on 2017/6/12.
 */
import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter';
import {
    BrowserRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import { NoMatch } from './routeTool';

import CommonRoutes from './common';                               // 公共模块--相关路由,如:登录,注册...
import RbacRoutes from './rbac';                                   // 用户管理--相关路由
import DataVisualComponentsRoutes from './dataVisualComponents';   // 可视化组件--相关路由

/**
 * 检测是否登录
 * @return {*}
 */
const checkLoginRedirect = () => <Redirect to={T.auth.isLogin() ? window.ENV.login.defaultRedirectUrl : window.ENV.login.loginUrl} />;
/**
 * 路由配置
 * @constructor
 */
const Routes = () => (
    <BrowserRouter
        forceRefresh={!('pushState' in window.history)}
        keyLength={12}
    >
        <Switch>
            <Route exact path={EnumRouter.rootRoute} render={() => checkLoginRedirect()} />
            <Route exact path="/" render={() => checkLoginRedirect()}  />

            {/* 用户管理--路由 */}
            {RbacRoutes()}

            {/* 公共--路由 */}
            {CommonRoutes()}

			{/* 可视化组件--路由 */}
            {DataVisualComponentsRoutes()}

            {/* 404 NOT found */}
            <Route component={NoMatch} />

        </Switch>

    </BrowserRouter>
);

export default Routes;
