import {
    getComponentChangePageList,
    getComponentChangeDetail,
} from '../webAPI/componentChange';

/**
 * 获取组件分类分页列表
 * @param component_id
 * @param pageSize
 * @param pageSize
 * @returns {function(*)}
 */
 export const doGetComponentChangePageListAction = (component_id, page, pageSize) => getComponentChangePageList(component_id, page, pageSize);

/**
 * 获取组件详情
 * @param {Number} component_id
 * @param {string} hash
 * @returns {Promise}
 */
 export const doGetComponentChangeDetailAction = (component_id, hash) => getComponentChangeDetail(component_id, hash)