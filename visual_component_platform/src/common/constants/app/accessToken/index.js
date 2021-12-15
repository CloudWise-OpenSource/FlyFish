const uuid = require('uuid');

/**
 * accessToken状态
 * @type {{disable: number, normal: number}}
 */
exports.EnumAccessTokenStatus = {
    all: "all",     // 所有
    disable: 0,     // 禁用
    normal: 1,      // 启用
};


/**
 * 生成AccessKeyID
 * @return {PromiseLike<ArrayBuffer>}
 */
exports.mkAccessKeyID = () => think.service('crypto').md5("access_key_id" + uuid.v1());

/**
 * 生成AccessKeySecret
 * @return {PromiseLike<ArrayBuffer>|*}
 */
exports.mkAccessKeySecret = () => think.service('crypto').md5("access_key_secret" + uuid.v1());

/**
 * 生成AccessToken
 * @return {PromiseLike<ArrayBuffer>|*}
 */
exports.mkAccessToken = () => think.service('crypto').md5("access_token" + uuid.v1());
