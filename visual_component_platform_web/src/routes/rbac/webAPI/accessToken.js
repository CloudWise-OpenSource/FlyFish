import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 获取accessToken分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getAccessTokenPageList = (page, search = {}) => get(EnumAPI.aToken_getPageList, { page, search });


/**
 * 获取单个accessToken详情
 * @param {Number} access_key_id
 * @returns {Promise}
 */
export const getAccessTokenDetail = (access_key_id) => get(EnumAPI.aToken_getDetail, { access_key_id });

/**
 * 添加accessToken
 * @returns {Promise}
 */
export const addAccessToken = () => postJSON(EnumAPI.aToken_add);

/**
 * 删除accessToken
 * @param {Array} access_key_ids
 * @return {*}
 */
export const delAccessToken = (access_key_ids) => del(EnumAPI.aToken_del, {access_key_ids});


/**
 * 更新accessToken状态
 * @param {String} access_key_id
 * @param {Number} status
 * @return {*}
 */
export const updateAccessTokenStatus = (access_key_id, status) => put(EnumAPI.aToken_updateStatus, {access_key_id, status});
