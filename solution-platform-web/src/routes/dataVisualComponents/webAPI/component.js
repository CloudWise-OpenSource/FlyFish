import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, del, upload } = T.request;

/**
 * 获取可视化组件分页列表
 * @param {Number} page
 * @param {String} type
 * @param {Object} search
 * @returns {Promise}
 */
export const getComponentPageList = (page, type, search = {}) => get(EnumAPI.dvComponents_getPageList, { page, type, search });


/**
 * 获取单个可视化组件详情
 * @param {Number} component_id
 * @returns {Promise}
 */
export const getComponentDetail = (component_id) => get(EnumAPI.dvComponents_getDetail, { component_id });

/**
 * 添加可视化组件
 * @param {Object} params
 * @param {String} params.componentList
 * @param {String} params.tag_id
 * @param {Function} onUploadProgress
 * @returns {Promise}
 */
export const addComponent = (params = {}, onUploadProgress) => {
    return upload(EnumAPI.dvComponents_addComponent, params, onUploadProgress);
};

/**
 * 更新可视化组件
 * @param {Object} params
 * @param {Object} params.component  组件包
 * @param {Number} params.component_id     组件ID
 * @param {String} params.tag_id
 * @returns {Promise}
 */
export const updateComponent = (params) => upload(EnumAPI.dvComponents_updateComponent, params);

/**
 * 更新可视化组件可见状态
 * @param {Object} params
 * @param {Number} params.component_id     组件ID
 * @param {Number} params.is_hide 是否隐藏
 * @returns {Promise}
 */
export const changeVisibleComponent = (params) => upload(EnumAPI.dvComponents_changeVisible, params);

/**
 * 上出可视化组件封面
 * @param {Object} params
 * @param {Object} params.cover
 * @param {Number} params.component_id     组件ID
 * @returns {Promise}
 */
export const uploadComponentCover = (params) => upload(EnumAPI.dvComponents_uploadComponentCover, params);

/**
 * 删除可视化组件
 * @param {Array} component_ids
 * @returns {Promise}
 */
export const delComponent = (component_ids) => del(EnumAPI.dvComponents_delComponent, { component_ids });

