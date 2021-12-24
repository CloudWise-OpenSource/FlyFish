import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, formatUrlParams, postJSON, del, put, upload } = T.request;

/**
 * 获取图片分组列表
 * @param {Number} page
 * @param {String} name
 * @param {Boolean} is_all
 * @returns {Promise}
 */
export const getImgGroupPageList = (page, is_all, name = {}) => get(formatUrlParams(EnumAPI.getImgGroupPageList), { page, is_all, name });

/**
 * 添加图片分组
 * @param name
 * @param flag
 * @return {Promise}
 */
export const addImgGroup = (name, flag) => postJSON(formatUrlParams(EnumAPI.addImgGroup), { name, flag });

/**
 * 删除图片分组
 * @param id
 * @return {Promise}
 */
export const delImgGroup = (id) => del(formatUrlParams(EnumAPI.delImgGroup), { id });

/**
 * 更新图片分组
 * @param id
 * @param name
 * @return {Promise}
 */
export const updateImgGroup = (id, name) => put(formatUrlParams(EnumAPI.updateImgGroup), { id, name });

/**
 * 获取图片列表
 * @param {Number} page
 * @param {Boolean} is_all
 * @param {String} name
 * @returns {Promise}
 */
export const getImgPageList = (page, is_all, name = {}) => get(formatUrlParams(EnumAPI.getImgPageList), { page, is_all, name });

/**
 * 添加图片
 * @param {String} name
 * @param {String} flag
 * @return {Promise}
 */
export const addImg = (file, name, desc, extendDesc, group_id) => upload(formatUrlParams(EnumAPI.addImg), { file, name, desc, extendDesc, group_id });

/**
 * 删除图片
 * @param {Number} id
 * @return {Promise}
 */
export const delImg = (id) => del(formatUrlParams(EnumAPI.delImg), { id });

/**
 * 更新图片
 * @param {Number} id
 * @param {String} name
 * @return {Promise}
 */
export const updateImg = (id, file, name, desc, extendDesc, group_id) => upload(formatUrlParams(EnumAPI.updateImg), { id, file, name, desc, extendDesc, group_id });
