/**
 * Created by willem on 2018/1/23.
 */

import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';

const { get, postJSON, all } = T.request;

/**
 * 获取主机列表
 */
export const getHostAllList = () => get(EnumAPI.hostAllList, {});

/**
 * 获取主机监控列表
 * @param {Number} page 当前页
 * @param {Number} pageSize 页数
 * @param {Array} ipList 主机地址数组
 * @param {String} order
 * @param {String} sortField
 */
export const getHostMonitorList = (page, pageSize, ipList, order, sortField) => postJSON(EnumAPI.hostMonitorList, { page, pageSize, ipList, order, sortField });

/**
 * 获取主机详情
 * @param {String} ip 主机ip地址
 * @param {String} timeRange 时间范围
 */
export const getHostDetails = (ip, timeRange) => all(
    postJSON(EnumAPI.hostCpu, { ip, timeRange }),
    postJSON(EnumAPI.hostMem, { ip, timeRange }),
    postJSON(EnumAPI.hostDisk, { ip, timeRange }),
    postJSON(EnumAPI.hostNet, { ip, timeRange }),
);
