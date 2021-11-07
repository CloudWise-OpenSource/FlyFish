import * as ActionTypes from '../constants/actionTypes/bigScreen';
import T from 'utils/T';
import {
    getScreenPageList,
    getScreenDetail,
    addScreen,
    updateScreen,
    delScreen,
    copyScreen,
    getDelScreenPageList,
    undoDelScreen,
    unlockScreen,
    downloadScreen
} from '../webAPI/bigScreen';

/**
 * 获取大屏分页列表
 * @param page
 * @param search
 * @returns {function(*)}
 */
export const getScreenPageListAction = (page, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_SCREEN_LIST_STATUS });

    // 获取数据
    getScreenPageList(page, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_SCREEN_LIST, screenList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 删除大屏
 * @param {Array} screen_ids // 大屏id
 * @returns {Promise}
 */
export const doDelScreen = (screen_ids) => delScreen(screen_ids);

/**
 * 解锁大屏
 * @param screen_id
 * @return {*}
 */
export const doUnlockScreen = (screen_id) => unlockScreen(screen_id);

/**
 * 删除状态
 * @param [Array] screen_ids
 * @returns {{type: string, screen_ids: *}}
 */
export const delScreenAction = (screen_ids) => ({ type: ActionTypes.DEL_SCREEN, screen_ids });

/**
 * 获取大屏详情
 * @param {Number} screen_id
 * @returns {Promise}
 */
export const doGetScreenDetail = (screen_id) => getScreenDetail(screen_id);

/**
 * 添加大屏
 * @param {String} name
 * @param {File} cover
 * @param {Number} status
 * @returns {Promise}
 */
export const doAddScreen = (name, cover, url, status) => addScreen(name, cover, url, status);

/**
 * 修改大屏
 * @param {Number} screen_id
 * @param {String} name
 * @param {File} cover
 * @param {Number} status
 * @returns {Promise}
 */
export const doUpdateScreen = (screen_id, name, cover, url, status) => updateScreen(screen_id, name, cover, url, status);

/**
 * 复制大屏
 * @param screen_id
 * @param name
 * @param {File} cover
 * @param {Number} status
 * @returns {*}
 */
export const doCopyScreen = (screen_id, name, cover, url, status) => copyScreen(screen_id, name, cover, url, status);

/**
 * 获取已删除大屏列表
 * @param page
 * @returns {*}
 */
export const doGetDelScreenPageList = (page) => getDelScreenPageList(page);

export const doUndoDelScreen = (screen_ids) => undoDelScreen(screen_ids);

/**
 * 下载大屏部署包
 * @param screen_id
 * @param name
 * @param cover
 * @returns {*}
 */
export const doDownloadScreen = (screen_id) => downloadScreen(screen_id);
