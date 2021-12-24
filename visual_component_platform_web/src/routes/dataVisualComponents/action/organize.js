import * as ActionTypes from '../constants/actionTypes/organize';
import T from 'utils/T';
import {
    getOrgPageList,
    getOrgDetail,
    addOrg,
    updateOrg,
    delOrg,
    getOrgAll,
} from '../webAPI/organize';

/**
 * 获取所有组织
 * @return {Promise}
 */
export const doGetOrgAll = () => getOrgAll();

/**
 * 获取组织分页列表
 * @param page
 * @param search
 * @returns {function(*)}
 */
export const getOrgPageListAction = (page, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_V_ORG_LIST_STATUS });

    // 获取数据
    getOrgPageList(page, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_V_ORG_LIST, orgList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};


/**
 * 删除组织
 * @param {Array} org_ids // 组织id
 * @returns {Promise}
 */
export const doDelOrg = (org_ids) => delOrg(org_ids);


/**
 * 删除状态
 * @param [Array] org_ids
 * @returns {{type: string, org_ids: *}}
 */
export const delOrgAction = (org_ids) => ({ type: ActionTypes.DEL_V_ORG, org_ids });


/**
 * 获取组织详情
 * @param {Number} org_id
 * @returns {Promise}
 */
export const doGetOrgDetail = (org_id) => getOrgDetail(org_id);


/**
 * 添加组织
 * @param {Object} params
 * @param {String} params.name                // 组织名称
 * @param {String} params.description      // 组织标识
 * @returns {Promise}
 */
export const doAddOrg = (params) => addOrg(params);


/**
 * 修改组织
 * @param {Object} params
 * @param {String} params.name  组织名称
 * @param {Number} params.description     组织分类
 * @returns {Promise}
 */
export const doUpdateOrg = (params) => updateOrg(params);


