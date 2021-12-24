import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 获取角色分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getRolePageList = (page, search = {}) => get(EnumAPI.role_getPageList, { page, search });

/**
 * 获取所有角色
 * @return {Promise}
 */
export const getAllRole = () => get(EnumAPI.role_getAll);

/**
 * 获取单个角色详情
 * @param {Number} role_id
 * @returns {Promise}
 */
export const getRoleDetail = (role_id) => get(EnumAPI.role_getDetail, { role_id });

/**
 * 添加角色
 * @param {Object} params
 * @param {String} params.role_name
 * @param {String} params.description
 * @returns {Promise}
 */
export const addRole = (params = {}) => {
    return postJSON(EnumAPI.role_add, params);
};

/**
 * 修改角色
 * @param {Number} role_id
 * @param {Object} params
 * @param {String} params.role_name
 * @param {String} params.description
 * @returns {Promise}
 */
export const updateRole = (role_id, params = {}) => put(EnumAPI.role_update, Object.assign({role_id}, params));

/**
 * 删除角色
 * @param {Array} role_ids
 * @returns {Promise}
 */
export const delRole = (role_ids) => del(EnumAPI.role_del, { role_ids });


/**
 * 依据角色获取用户
 * @param {Number} role_id
 * @return {Promise}
 */
export const getUserByRole = (role_id) => get(EnumAPI.role_userByRole, { role_id });

/**
 * 更新角色中的成员
 * @param {Number} role_id
 * @param {Array} addUsers
 * @param {Array} delUsers
 * @return {Promise}
 */
export const updateRoleMember = (role_id, addUsers, delUsers) => put(EnumAPI.role_updateRoleMember, { role_id, addUsers, delUsers });
