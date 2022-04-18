import * as ActionTypes from '../constants/actionTypes/component';
import T from 'utils/T';
import {
    getComponentPageList,
    getComponentDetail,
    addComponent,
    updateComponent,
    delComponent,
    uploadComponentCover,
    changeVisibleComponent
} from '../webAPI/component';


/**
 * 获取组件分类分页列表
 * @param page
 * @param type
 * @param search
 * @returns {function(*)}
 */
export const getComponentPageListAction = (page, type, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_V_COMPONENT_LIST_STATUS });

    // 获取数据
    getComponentPageList(page, type, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_V_COMPONENT_LIST, componentList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};


/**
 * 删除组件
 * @param {Array} component_ids // 组件id
 * @returns {Promise}
 */
export const doDelComponent = (component_ids) => delComponent(component_ids);


/**
 * 删除状态
 * @param [Array] component_ids
 * @returns {{type: string, component_ids: *}}
 */
export const delComponentAction = (component_ids) => ({ type: ActionTypes.DEL_V_COMPONENT, component_ids });


/**
 * 获取组件详情
 * @param {Number} component_id
 * @returns {Promise}
 */
export const doGetComponentDetail = (component_id) => getComponentDetail(component_id);


/**
 * 添加组件
 * @param {Object} params
 * @param {String} params.componentList
 * @param {String} params.tag_id
 * @param {Function} onUploadProgress
 * @returns {Promise}
 */
export const doAddComponent = (params, onUploadProgress) => addComponent(params, onUploadProgress);


/**
 * 修改组件
 * @param {Object} params
 * @param {Object} params.component  组件包
 * @param {String} params.tag_id
 * @param {Number} params.component_id     组件ID
 * @returns {Promise}
 */
export const doUpdateComponent = (params) => updateComponent(params);

/**
 * 修改组件可见状态
 * @param {Object} params
 * @param {Number} params.component_id     组件ID
 * @param {Number} params.is_hide     组件是否可见
 * @returns {Promise}
 */
export const doChangeVisibleComponent = (params) => changeVisibleComponent(params);

/**
 * 上出组件封面
 * @param {Object} params
 * @param {Object} params.cover
 * @param {Number} params.component_id     组件ID
 * @returns {Promise}
 */
export const doUploadComponentCover = (params) => uploadComponentCover(params);

