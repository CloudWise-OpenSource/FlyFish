import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, postJSON, del, put } = T.request;

/**
 * 获取所有可视化组件分类
 * @returns {Promise}
 */
export const getAllCategories = () => get(EnumAPI.dvComponentsCategories_getAll);

/**
 * 获取可视化组件分类分页列表
 * @param {Number} page
 * @param {String} type
 * @param {Object} search
 * @returns {Promise}
 */
export const getCategoriesPageList = (page, type, search = {}) => get(EnumAPI.dvComponentsCategories_getPageList, { page, type, search });


/**
 * 获取单个可视化组件分类详情
 * @param {Number} categories_id
 * @returns {Promise}
 */
export const getCategoriesDetail = (categories_id) => get(EnumAPI.dvComponentsCategories_getDetail, { categories_id });

/**
 * 添加可视化组件分类
 * @param {String} name
 * @param {String} type
 * @returns {Promise}
 */
export const addCategories = (name, type) => {
    return postJSON(EnumAPI.dvComponentsCategories_addCategories, { name, type });
};

/**
 * 更新可视化组件分类
 * @param {Number} categories_id
 * @param {String} name
 * @param {String} type
 * @returns {Promise}
 */
export const updateCategories = (categories_id, name, type) => put(EnumAPI.dvComponentsCategories_updateCategories, { categories_id, name, type });

/**
 * 删除可视化组件分类
 * @param {Array} categories_ids
 * @returns {Promise}
 */
export const delCategories = (categories_ids) => del(EnumAPI.dvComponentsCategories_delCategories, { categories_ids });

