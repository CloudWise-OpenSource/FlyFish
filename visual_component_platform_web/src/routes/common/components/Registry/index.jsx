import styles from './index.scss';
import PropTypes from 'prop-types';
// import Parser from 'html-react-parser';

import { PureComponent } from 'react';
import { Button } from 'antd';

import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter';
import { doRegistryAction, doGetCaptchaAction } from '../../actions/registry';

const rightLoginImg = require('./img/right_login.png');

export default class Registry extends PureComponent {
    static contextTypes = {
        store: PropTypes.object.isRequired,
        router: PropTypes.object.isRequired
    };

    constructor() {
        super();
        this.state = {
            user_name: '',
            user_email: '',
            user_password: '',
            re_user_password: '',
            key: '',
            captcha: '',
            captcha_svg: '',
            loading: false
        };
    }

    componentDidMount() {
        this.getCaptcha();
    }

    onEnterDown = (e) => (e.keyCode === 13 ? this.onSubmit() : null);

    onSubmit = () => {
        const { user_name, user_email, user_password, re_user_password, key, captcha } = this.state;
        if (user_password.trim() !== re_user_password.trim()) return T.prompt.error('两次密码输入不一致');

        this.setState({ loading: true }, () => {
            doRegistryAction(user_name, user_email, user_password, key, captcha).then((resp) => {
                this.setState({ loading: false }, () => {
                    T.auth.setLoginInfo(resp.data);
                    window.location.href = EnumRouter.v_component_list;
                });
            }, (resp) => {
                this.setState({ loading: false });
                T.prompt.error(resp.msg);
            });
        });
    }

    getCaptcha = () => {
        doGetCaptchaAction().then(resp => {
            this.setState({
                key: resp.data.key,
                captcha_svg: resp.data.captcha.replace('\\', ''),
            });
        }, (resp) => {
            T.prompt.error(resp.msg);
        });
    }

    render() {
        return (<div className={styles.login}>
            <div className={styles.login_box}>
                <div className={styles.login_box_left}>
                    <div className={styles.login_top}>用户注册</div>
                    <input
                        type="text"
                        value={this.state.user_name}
                        className={styles.login_email}
                        onChange={(e) => this.setState({ user_name: e.target.value.trim() })}
                        placeholder="用户名"
                        onKeyDown={this.onEnterDown}
                    />
                    <input
                        type="text"
                        value={this.state.user_email}
                        className={styles.login_email}
                        onChange={(e) => this.setState({ user_email: e.target.value.trim() })}
                        placeholder="邮箱"
                        onKeyDown={this.onEnterDown}
                    />
                    <input
                        type="password"
                        value={this.state.user_password}
                        className={styles.login_password}
                        onChange={(e) => this.setState({ user_password: e.target.value.trim() })}
                        placeholder="密码"
                        onKeyDown={this.onEnterDown}
                    />
                    <input
                        type="password"
                        value={this.state.re_user_password}
                        className={styles.login_password}
                        onChange={(e) => this.setState({ re_user_password: e.target.value.trim() })}
                        placeholder="再次输入密码"
                        onKeyDown={this.onEnterDown}
                    />
                    <div className={styles.captcha_box}>
                        <input
                            type="text"
                            value={this.state.captcha}
                            className={styles.captcha}
                            onChange={(e) => this.setState({ captcha: e.target.value.trim() })}
                            placeholder="验证码"
                            onKeyDown={this.onEnterDown}
                        />
                        <div dangerouslySetInnerHTML={{ __html: this.state.captcha_svg }} onClick={this.getCaptcha} />
                    </div>

                    <Button
                        className={styles.btn_login} loading={this.state.loading ? { delay: 300 } : false}
                        onClick={this.onSubmit}
                    >
                        注&nbsp;&nbsp;册
                    </Button>
                </div>
                <img src={rightLoginImg} className={styles.img_right} alt="login-right" />
            </div>
        </div>);
    }
}
