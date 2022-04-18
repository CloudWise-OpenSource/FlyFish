import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 获取用户分页列表
 * @param {Number} page
 * @param {Number} user_status
 * @param {Object} search
 * @returns {Promise}
 */
export const getUserPageList = (page, user_status, search = {}) => get(EnumAPI.user_getPageList, { page, user_status, search });

/**
 * 获取所有用户
 * @return {Promise}
 */
export const getAllUser = () => get(EnumAPI.user_getAll);

/**
 * 获取单个用户详情
 * @param {Number} user_id
 * @returns {Promise}
 */
export const getUserDetail = (user_id) => get(EnumAPI.user_getDetail, { user_id });

/**
 * 添加用户
 * @param {Object} params
 * @param {String} params.user_name
 * @param {String} params.user_email
 * @param {String} params.user_phone
 * @param {String} params.user_password
 * @returns {Promise}
 */
export const addUser = (params = {}) => {
    return postJSON(EnumAPI.user_add, params);
};

/**
 * 修改用户
 * @param {Number} user_id
 * @param {Object} params
 * @param {String} params.user_name
 * @param {String} params.user_email
 * @param {String} params.user_phone
 * @returns {Promise}
 */
export const updateUser = (user_id, params = {}) => put(EnumAPI.user_update, Object.assign({user_id}, params));

/**
 * 删除用户
 * @param {Array} user_id
 * @returns {Promise}
 */
 export const delUser = (user_id) => del(EnumAPI.user_del, { user_id });

/**
 * 重置密码
 * @param {String} user_id
 * @param {String} old_password
 * @param {String} new_password
 * @returns {Promise}
 */
export const resetPassword = (user_id, old_password, new_password) => put(EnumAPI.user_resetPassword, { user_id, old_password, new_password });
