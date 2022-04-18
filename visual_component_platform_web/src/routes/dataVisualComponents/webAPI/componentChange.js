import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get } = T.request;

/**
 * 获取可视化组件分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getComponentChangePageList = (component_id, page, pageSize) => get(EnumAPI.dvComponents_getChangePageList, {component_id, start: page, limit: pageSize });

/**
 * 获取单个可视化组件详情
 * @param {Number} component_id
 * @returns {Promise}
 */
export const getComponentChangeDetail = (component_id, hash) => get(EnumAPI.dvComponents_getChangeDetail, { component_id, hash }, {isHtml: true, responseType: 'text/html'});
