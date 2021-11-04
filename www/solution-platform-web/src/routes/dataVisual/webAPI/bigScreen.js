import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, del, upload, post, put, download } = T.request;

/**
 * 获取大屏分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getScreenPageList = (page, search = {}) => get(EnumAPI.dvScreen_getPageList, { page, search });

/**
 * 获取单个大屏详情
 * @param {Number} screen_id
 * @returns {Promise}
 */
export const getScreenDetail = (screen_id) => get(EnumAPI.dvScreen_getDetail, { screen_id });

/**
 * 添加大屏
 * @param {String} name
 * @param {File} cover
 * @param {Object} url
 * @param {Number} status
 * @returns {Promise}
 */
export const addScreen = (name, cover, url, status) => {
    return upload(EnumAPI.dvScreen_add, {
        name,
        cover,
        url,
        status,
        tag_id: null,
    });
};

/**
 * 更新大屏
 * @param {Number} screen_id
 * @param {String} name
 * @param {File} cover
 * @param {Number} status
 * @returns {Promise}
 */
export const updateScreen = (screen_id, name, cover, url, status) =>
    upload(EnumAPI.dvScreen_update, {
        screen_id,
        name,
        cover,
        url,
        status,
        tag_id: null,
    });

/**
 * 删除大屏
 * @param {Array} screen_ids
 * @returns {Promise}
 */
export const delScreen = (screen_ids) => del(EnumAPI.dvScreen_delete, { screen_ids });

/**
 * 解锁大屏
 * @param  screen_id
 * @returns {Promise}
 */
export const unlockScreen = (screen_id) => put(EnumAPI.dvScreen_unlock, { screen_id });

/**
 * 复制大屏
 * @param screen_id
 * @param name
 * @param {File} cover
 * @param {Number} status
 * @returns {*}
 */
export const copyScreen = (screen_id, name, cover, url, status) =>
    upload(EnumAPI.dvScreen_copy, {
        screen_id,
        name,
        cover,
        url,
        status,
        tag_id: null,
    });

/**
 * 获取已删除大屏列表
 * @param page
 * @returns {*}
 */
export const getDelScreenPageList = (page) => get(EnumAPI.dvScreen_getDelPageList, { page });

/**
 * 还原已删除大屏
 * @param screen_ids
 * @returns {*}
 */
export const undoDelScreen = (screen_ids) => post(EnumAPI.dvScreen_undoDelete, { screen_ids });

/**
 * 下载大屏部署包
 * @param screen_id
 * @returns {*}
 */
export const downloadScreen = (screen_id) => download(EnumAPI.dvScreen_downloadScreen, { screen_id }, { responseType: 'blob' });
