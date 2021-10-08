/**
 * web 登录用户信息的cookie key
 * @type {string}
 */
exports.EnumLoginUserInfo = {
    key: think.config('custom.cookieKey.login_user_info'),           // cookie key
    expire: 24 * 3600 * 1000,             // 过期时间： 24小时
}
