/**
 * Created by chencheng on 2017/6/17.
 */


import {
	login,
	logout
} from '../../webAPI/login';

/**
 * 执行登陆
 * @param user_email
 * @param user_password
 * @returns {Promise}
 */
export const doLoginAction = (user_email, user_password) => login(user_email, user_password);

/**
 * 退出登录
 * @returns {*}
 */
export const doLogoutAction = () => logout();
