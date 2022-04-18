import cookiesUtil from 'js-cookie';
import queryString from 'query-string';
import _ from 'lodash';
import * as store from './storage';
const EnumLoginInfoKey = '__login_info__';

class Auth {

    constructor(){
        // 登录成功的cookie key
        this.loginSuccessCookieKey = window.ENV.login.cookieKey;
    }
    /**
     * 验证是否登录
     * @returns {boolean}
     */
    isLogin() {
        return window.ENV.login.isCheckLogin ? cookiesUtil.get(this.loginSuccessCookieKey) : true;
    }

    /**
     * 登录成功重定向
     * @param {Object} history // 当前的history对象
     */
    loginSuccessRedirect(history) {
        const urlParams = queryString.parse(history.location.search);
        let redirectUrl = window.ENV.login.defaultRedirectUrl;

        if (_.isPlainObject(urlParams) && 'redirect_uri' in urlParams ) {
            redirectUrl = decodeURIComponent(urlParams['redirect_uri']);
        } 

        // history.push(redirectUrl);
        window.location.href = redirectUrl;
    }

     /**
     * 保存登录信息
     * @param loginInfo
     */
      setLoginInfo(loginInfo){
        store.setStorage(EnumLoginInfoKey, loginInfo);
    }

    /**
     * 获取登录信息
     * @return {*}
     */
    getLoginInfo(){
        return store.getStorage(EnumLoginInfoKey);
    }


}

export default new Auth();
