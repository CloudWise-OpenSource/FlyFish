/**
 * Created by chencheng on 2017/6/17.
 */

import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';

const { postJSON, get } = T.request;

/**
 * 登录后台
 * @param {String} user_email
 * @param {String} user_password
 * @returns {Promise}
 */
export const login = (user_email, user_password) => postJSON(EnumAPI.login, { user_email, user_password });

/**
 * 退出登录
 * @returns {*}
 */
export const logout = () => get(EnumAPI.logout);
