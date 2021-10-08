/**
 * Created by willem on 2018/1/25.
 */
import T from 'utils/T';
import EnumAPI from 'constants/EnumAPI';


const { get, postJSON, all } = T.request;

/**
 * 获取采集监控列表
 * @param {Number} page 当前页
 * @param {Number} pageSize 页数
 * @param {Array} ipList 主机地址数组
 * @param {String} order
 * @param {String} sortField
 */
export const getCollectMonitorList = (page, pageSize, ipList, order, sortField) =>
    postJSON(EnumAPI.pluginMonitorList, { page, pageSize, ipList, order, sortField });
/**
 * 获取日志类型列表
 */
export const getLogTypeList = () => postJSON(EnumAPI.getLogTypeListAPI,{page:1,pageSize:10000})

/**
 * 获取采集数据
 * @param {string} logType
 * @param {string} pluginType
 * @param {string} timeRange
 */
export const getCollectData = (logType,pluginType,timeRange) => postJSON(EnumAPI.getCollectDataAPI,{logType,pluginType,timeRange})

/**
 * 获取采集列表
 * @param {string} logType
 * @param {number} page
 * @param {number} pageSize
 * @param {string} pluginType
 * @param {string} timeRange
 */
export const getCollectList = (logType,page,pageSize,pluginType,timeRange) => postJSON(EnumAPI.getCollectListAPI,{logType,page,pageSize,pluginType,timeRange})

/**
 * 获取详情
 * @param logType
 * @param timeRange
 * @param ip
 * @param pluginType
 */
export const getDetail = (logType,timeRange,ip,pluginType) => postJSON(EnumAPI.getDetailAPI,{logType,timeRange,ip,pluginType})
