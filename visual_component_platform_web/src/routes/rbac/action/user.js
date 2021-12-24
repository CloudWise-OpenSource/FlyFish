import * as ActionTypes from '../constants/actionTypes/user';
import T from 'utils/T';

import {
    getUserPageList,
    getUserDetail,
    addUser,
    updateUser,
    delUser,
    resetPassword
} from '../webAPI/user';

/**
 * 获取用户分页列表
 * @param page
 * @param user_status
 * @param search
 * @returns {function(*)}
 */
export const getUserPageListAction = (page, user_status, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_USER_LIST_STATUS });

    // 获取数据
    getUserPageList(page, user_status, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_USER_LIST, userList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 重置密码
 * @param {String} user_id
 * @param {String} old_password
 * @param {String} new_password
 * @returns {Promise}
 */
export const doResetPassword = (user_id, old_password, new_password) => resetPassword(user_id, old_password, new_password);


/**
 * 获取用户详情
 * @param {Number} user_id
 * @returns {Promise}
 */
export const doGetUserDetail = (user_id) => getUserDetail(user_id);

/**
 * 添加用户
 * @param {Object} params
 * @param {String} params.user_name
 * @param {String} params.user_email
 * @param {String} params.user_phone
 * @param {String} params.user_password
 * @returns {Promise}
 */
export const doAddUser = (params) => addUser(params);

/**
 * 修改用户
 * @param {Number} user_id
 * @param {Object} params
 * @param {String} [params.user_name]
 * @param {String} [params.user_email]
 * @param {String} [params.user_phone]
 * @returns {Promise}
 */
export const doUpdateUser = (user_id, params) => updateUser(user_id, params);

/**
 * 删除用户
 * @param {Array} user_id
 * @returns {Promise}
 */
 export const doDelUser = (user_id) => delUser(user_id);

 /**
  * 删除状态
  * @param {Array} user_id
  * @returns {{type: string, user_ids: *}}
  */
 export const delUserAction = (user_id) => ({ type: ActionTypes.DEL_USER, user_id }); 

