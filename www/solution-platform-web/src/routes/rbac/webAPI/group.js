import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 获取分组分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getGroupPageList = (page, search = {}) => get(EnumAPI.group_getPageList, { page, search });

/**
 * 获取所有分组
 * @param {Object} search
 * @return {Promise}
 */
export const getAllGroupTree = (search = {}) => get(EnumAPI.group_getAll, search);

/**
 * 获取单个分组详情
 * @param {Number} group_id
 * @returns {Promise}
 */
export const getGroupDetail = (group_id) => get(EnumAPI.group_getDetail, { group_id });

/**
 * 添加分组
 * @param {Object} params
 * @param {String} params.group_name
 * @param {String} params.description
 * @returns {Promise}
 */
export const addGroup = (params = {}) => {
    return postJSON(EnumAPI.group_add, params);
};

/**
 * 修改分组
 * @param {Number} group_id
 * @param {Object} params
 * @param {String} params.group_name
 * @param {String} params.description
 * @returns {Promise}
 */
export const updateGroup = (group_id, params = {}) => put(EnumAPI.group_update, Object.assign({group_id}, params));

/**
 * 删除分组
 * @param {Number} group_id
 * @returns {Promise}
 */
export const delGroup = (group_id) => del(EnumAPI.group_del, { group_id });


/**
 * 依据分组获取用户
 * @param {Number} group_id
 * @return {Promise}
 */
export const getUserByGroup = (group_id) => get(EnumAPI.group_userByGroup, { group_id });

/**
 * 更新分组中的成员
 * @param {Number} group_id
 * @param {Array} addUsers
 * @param {Array} delUsers
 * @return {Promise}
 */
export const updateGroupMember = (group_id, addUsers, delUsers) => put(EnumAPI.group_updateGroupMember, { group_id, addUsers, delUsers });
