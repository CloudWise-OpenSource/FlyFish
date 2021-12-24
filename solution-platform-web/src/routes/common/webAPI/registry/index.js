/**
 * Created by chencheng on 2017/6/17.
 */

import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';

const { postJSON, get } = T.request;

/**
 * 登录注册
 * @param {String} user_email
 * @param {String} user_password
 * @returns {Promise}
 */
export const registry = (user_name, user_email, user_password, key, captcha) =>
    postJSON(EnumAPI.registry, {
        user_name,
        user_email,
        user_password,
        key,
        captcha,
    });

export const getCaptcha = () => get(EnumAPI.getCaptcha);
