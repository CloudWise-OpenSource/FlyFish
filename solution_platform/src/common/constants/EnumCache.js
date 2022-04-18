
/**
 * 生成web登录信息缓存的key
 * @param {Number} account_id
 * @param {Number} user_id
 * @returns {string}
 */
exports.mkWebLoginUserCacheKey = (account_id, user_id) => "tj_paas_" + account_id + '_' + user_id + '_' + Date.now();


/**
 * 生成admin登录信息缓存的key
 * @param user_id
 * @returns {string}
 */
exports.mkAdminLoginUserCacheKey = (user_id) => "tj_admin_" + user_id + '_' + Date.now();
