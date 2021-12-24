import PropTypes from 'prop-types';
import styles from './index.scss';
import { Component } from 'react';
import { Button } from 'antd';

import T from 'utils/T';
import { doLoginAction } from '../../actions/login';

import logo from './img/logo.svg';

const rightLoginImg = require('./img/right_login.png');

export default class Login extends Component {
    static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            user_email: '',
            user_password: '',
            loading: false
        };
    }

    onEnterDown = (e) => e.keyCode === 13 ? this.onSubmit() : null;

    onSubmit = () => {
        const { user_email, user_password } = this.state;

        this.setState({ loading: true }, () => {
            doLoginAction(user_email, user_password).then((resp) => {
                this.setState({ loading: false }, () => {
                    T.auth.setLoginInfo(resp.data);
                    T.auth.loginSuccessRedirect(this.context.router.history);
                });
            }, (resp) => {
                this.setState({ loading: false });
                T.prompt.error(resp.msg);
            });
        });
    }

    render() {
        return (
            <div className={styles.login}>
                <img src={logo} className={styles["img-top"]} alt="login-top" />
                <div className={styles["login_box"]}>
                    <div className={styles["login_box_left"]}>
                        <div className={styles["login_top"]}>登录</div>
                        <input
                            type="text"
                            value={this.state.user_email}
                            className={styles["login_email"]}
                            onChange={(e) => this.setState({user_email: e.target.value.trim()})}
                            placeholder="邮箱"
                            onKeyDown={this.onEnterDown}
                        />
                        <input
                            type="password"
                            value={this.state.user_password}
                            className={styles["login_password"]}
                            onChange={(e) => this.setState({user_password: e.target.value.trim()})}
                            placeholder="密码"
                            onKeyDown={this.onEnterDown}
                        />

                        <Button
                            className={styles["btn_login"]} loading={this.state.loading ? { delay: 300 } : false}
                            onClick={this.onSubmit}
                        >
                            登&nbsp;&nbsp;录
                        </Button>
                        <a href={`${window.ENV.rootPath}registry`} className={styles.to_registry}>还没有账号？去注册</a>
                    </div>
                    <img src={rightLoginImg} className={styles["img_right"]} alt="login-right" />
                </div>
            </div>
        );
    }
}
