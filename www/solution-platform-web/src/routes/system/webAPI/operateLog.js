import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';
const { get, formatUrlParams } = T.request;

/**
 * 获取操作日志分页列表
 * @param {Number} page
 * @param {Object} search
 * @returns {Promise}
 */
export const getOperateLogPageList = (page, search = {}) => get(formatUrlParams(EnumAPI.system_operateLogList + "?a=1", {a: {b:1}}), { page, search });

/**
 * 获取所有的用户
 * @return {Promise}
 */
export const getAllUser = () => get(EnumAPI.user_getAll);
