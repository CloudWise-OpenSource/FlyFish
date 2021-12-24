import * as ActionTypes from '../constants/actionTypes/role';
import T from 'utils/T';

import {
    getRolePageList,
    getRoleDetail,
    addRole,
    updateRole,
    delRole,
    getUserByRole,
    updateRoleMember
} from '../webAPI/role';

import { getAllUser } from '../webAPI/user';

/**
 * 获取角色分页列表
 * @param page
 * @param search
 * @returns {function(*)}
 */
export const getRolePageListAction = (page, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_ROLE_LIST_STATUS });

    // 获取数据
    getRolePageList(page, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_ROLE_LIST, roleList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg); 
    });
};

/**
 * 删除角色
 * @param {Array} role_ids
 * @returns {Promise}
 */
export const doDelRole = (role_ids) => delRole(role_ids);

/**
 * 删除状态
 * @param {Array} role_ids
 * @returns {{type: string, role_ids: *}}
 */
export const delRoleAction = (role_ids) => ({ type: ActionTypes.DEL_ROLE, role_ids });

/**
 * 获取角色详情
 * @param {Number} role_id
 * @returns {Promise}
 */
export const doGetRoleDetail = (role_id) => getRoleDetail(role_id);

/**
 * 添加角色
 * @param {Object} params
 * @param {String} params.role_name
 * @param {String} params.description
 * @returns {Promise}
 */
export const doAddRole = (params) => addRole(params);

/**
 * 修改角色
 * @param {Number} role_id
 * @param {Object} params
 * @param {String} [params.role_name]
 * @param {String} [params.description]
 * @returns {Promise}
 */
export const doUpdateRole = (role_id, params) => updateRole(role_id, params);

/**
 * 获取所有的用户和角色下的用户
 * @param {Number} role_id
 * @return {*}
 */
export const doGetAllUserAndRoleUser = (role_id) => T.request.all(getAllUser(), getUserByRole(role_id));


/**
 * 更新角色中的成员
 * @param {Number} role_id
 * @param {Array} addUsers
 * @param {Array} delUsers
 * @return {Promise}
 */
export const doUpdateRoleMember = (role_id, addUsers, delUsers) => updateRoleMember(role_id, addUsers, delUsers);

