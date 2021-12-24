import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 获取可视化组织分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getOrgPageList = (page, search = {}) => get(EnumAPI.dvOrg_getPageList, { page, search });

/**
 * 获取所有组织
 * @return {Promise}
 */
export const getOrgAll = () => get(EnumAPI.dvOrg_getAll);


/**
 * 获取单个可视化组织详情
 * @param {Number} org_id
 * @returns {Promise}
 */
export const getOrgDetail = (org_id) => get(EnumAPI.dvOrg_getDetail, { org_id });

/**
 * 添加可视化组织
 * @param {Object} params
 * @param {String} params.name  组织名称
 * @param {String} params.description    描述
 * @returns {Promise}
 */
export const addOrg = (params = {}) => {
    return postJSON(EnumAPI.dvOrg_add, params);
};

/**
 * 更新可视化组织
 * @param {Object} params
 * @param {String} params.name  组织名称
 * @param {Number} params.description     描述
 * @returns {Promise}
 */
export const updateOrg = (params) => put(EnumAPI.dvOrg_update, params);

/**
 * 删除可视化组织
 * @param {Array} org_ids
 * @returns {Promise}
 */
export const delOrg = (org_ids) => del(EnumAPI.dvOrg_del, { org_ids });

