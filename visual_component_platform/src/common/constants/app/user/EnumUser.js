/**
 * 用户状态
 * @type {{disable: number, normal: number}}
 */
exports.EnumUserStatus = {
    all: "all",     // 所有
    disable: 0,     // 禁用
    normal: 1,      // 正常
}


/**
 * 生成用户密码
 * @param user_password
 * @return {PromiseLike<ArrayBuffer>}
 */
exports.mkUserPassword = (user_password) => think.service('crypto').md5(user_password);
