import * as ActionTypes from '../constants/actionTypes/group';
import T from 'utils/T';

import {
    getGroupPageList,
	getAllGroupTree,
    getGroupDetail,
    addGroup,
    updateGroup,
    delGroup,
    getUserByGroup,
    updateGroupMember
} from '../webAPI/group';

import {getAllUser} from "../webAPI/user";

/**
 * 获取分组列表
 * @param search
 * @returns {function(*)}
 */
export const getGroupPageListAction = (search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_GROUP_LIST_STATUS });

    // 获取数据
	getAllGroupTree(search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_GROUP_LIST, groupList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 删除分组
 * @param {Number} group_id
 * @returns {Promise}
 */
export const doDelGroup = (group_id) => delGroup(group_id);

/**
 * 删除状态
 * @param {Number} group_id
 * @returns {{type: string, group_id: *}}
 */
export const delGroupAction = (group_id) => ({ type: ActionTypes.DEL_GROUP, group_id });

/**
 * 获取分组详情
 * @param {Number} group_id
 * @returns {Promise}
 */
export const doGetGroupDetail = (group_id) => getGroupDetail(group_id);

/**
 * 添加分组
 * @param {Object} params
 * @param {String} params.group_name
 * @param {String} params.description
 * @returns {Promise}
 */
export const doAddGroup = (params) => addGroup(params);

/**
 * 修改分组
 * @param {Number} group_id
 * @param {Object} params
 * @param {String} [params.group_name]
 * @param {String} [params.description]
 * @returns {Promise}
 */
export const doUpdateGroup = (group_id, params) => updateGroup(group_id, params);


/**
 * 获取所有的用户和分组下的用户
 * @param {Number} group_id
 * @return {*}
 */
export const doGetAllUserAndGroupUser = (group_id) => T.request.all(getAllUser(), getUserByGroup(group_id));


/**
 * 更新分组中的成员
 * @param {Number} group_id
 * @param {Array} addUsers
 * @param {Array} delUsers
 * @return {Promise}
 */
export const doUpdateGroupMember = (group_id, addUsers, delUsers) => updateGroupMember(group_id, addUsers, delUsers);

