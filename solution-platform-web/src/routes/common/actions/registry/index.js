/**
 * Created by chencheng on 2017/6/17.
 */

import { registry, getCaptcha } from '../../webAPI/registry';

/**
 * 执行登陆
 * @param user_email
 * @param user_password
 * @returns {Promise}
 */
export const doRegistryAction = (
    user_name,
    user_email,
    user_password,
    key,
    captcha
) => registry(user_name, user_email, user_password, key, captcha);

export const doGetCaptchaAction = () => getCaptcha();
