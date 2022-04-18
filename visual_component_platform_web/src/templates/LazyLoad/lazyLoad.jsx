import PropTypes from 'prop-types';
import T from 'utils/T';

import { Spin } from 'antd';
import { Component as ReactComponent } from 'react';
import { STORE_INJECT } from 'store.js';

const injectReducers = (reducers) => ({ [STORE_INJECT]: { reducers }});

@T.decorator.contextTypes('store')
@T.decorator.contextTypes('router')
@T.decorator.propTypes({
    // 延迟加载函数
    lazyLoader: PropTypes.func.isRequired,
    reducers: PropTypes.oneOfType([
        PropTypes.func.isRequired,
        PropTypes.arrayOf(
            PropTypes.func.isRequired
        ).isRequired,
    ]),
})
export default class LazyLoadTpl extends ReactComponent {

    state = {
        Component: null
    };

    componentDidMount() {
        // --验证是否登录--
        const loginConf = window.ENV.login;
        const currentUri = this.context.router.history.location.pathname;
        if (loginConf.noCheckIsLoginRoutes.indexOf(currentUri) === -1 && !T.auth.isLogin()){
            this.context.router.history.push(loginConf.loginUrl + '?redirect_uri=' + encodeURIComponent(currentUri));
            return false;
        }


        if (!this.state.Component) {
            // 挂载完成后,开始加载远程组件
            this.props.lazyLoader(Component => this.setState({
                Component: Component.default
            }));
        }
    }

    render() {
        const Component = this.state.Component;

        if (Component) {
            if (!T.lodash.isUndefined(this.props.reducers)) {
                this.context.store.dispatch(injectReducers(
                    T.lodash.isArray(this.props.reducers) ? this.props.reducers : [this.props.reducers]
                ));
            }

            return <Component {...this.props} />;
        }

        // 默认显示加载动画
        return <Spin size="large" wrapperClassName="page-loading" />;

    }
}
