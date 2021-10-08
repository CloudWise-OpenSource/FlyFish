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
 * 获取hub监控列表
 * @param {Number} page 当前页
 * @param {Number} pageSize 页数
 * @param {Array} ipList 主机地址数组
 * @param {String} order
 * @param {String} sortField
 */
export const getHubMonitorList = (page, pageSize, ipList, order, sortField) => postJSON(EnumAPI.hubMonitorList, { page, pageSize, ipList, order, sortField });

/**
 * 获取插件cpu使用率 + 获取插件内存使用率
 * @param {String} instanceId
 * @param {String} timeRange 时间范围
 */
export const getHubDetails = (instanceId, timeRange) => all(postJSON(EnumAPI.hubCpu, { instanceId, timeRange }), postJSON(EnumAPI.hubMem, { instanceId, timeRange }));
