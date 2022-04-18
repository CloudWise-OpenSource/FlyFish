import * as ActionTypes from '../constants/actionTypes/accessToken';
import T from 'utils/T';

import {
    getAccessTokenPageList,
    getAccessTokenDetail,
    addAccessToken,
    updateAccessTokenStatus,
    delAccessToken
} from '../webAPI/accessToken';

/**
 * 获取AccessToken分页列表
 * @param page
 * @param search
 * @returns {function(*)}
 */
export const getAccessTokenPageListAction = (page, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_ACCESS_TOKEN_LIST_STATUS });

    // 获取数据
    getAccessTokenPageList(page, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_ACCESS_TOKEN_LIST, accessTokenList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 删除AccessToken
 * @param {Array} access_key_ids
 * @returns {Promise}
 */
export const doDelAccessToken = (access_key_ids) => delAccessToken(access_key_ids);

/**
 * 删除状态
 * @param [Array] access_key_ids
 * @returns {{type: string, access_key_ids: *}}
 */
export const delAccessTokenAction = (access_key_ids) => ({ type: ActionTypes.DEL_ACCESS_TOKEN, access_key_ids });

/**
 * 获取AccessToken详情
 * @param {Number} access_key_id
 * @returns {Promise}
 */
export const doGetAccessTokenDetail = (access_key_id) => getAccessTokenDetail(access_key_id);

/**
 * 添加AccessToken
 * @returns {Promise}
 */
export const doAddAccessToken = () => addAccessToken();

/**
 * 修改AccessToken
 * @param {String} access_key_id
 * @param {Number} status
 * @returns {Promise}
 */
export const doUpdateAccessTokenStatus = (access_key_id, status) => updateAccessTokenStatus(access_key_id, status);

