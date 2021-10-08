/**
 * Created by john on 2018/2/7.
 */
import {
    getLogTypeList,
    getCollectData,
    getCollectList,
    getDetail
} from "../../webAPI/monitorList"

/**
 * 获取日志类型列表
 */
export const doGetLogTypeList = () => getLogTypeList()

/**
 * 获取采集数据
 * @param {string} logType
 * @param {string} pluginType
 * @param {string} timeRange
 */
export const doGetCollectData = (logType,pluginType,timeRange) => getCollectData(logType,pluginType,timeRange)

/**
 * 获取采集列表
 * @param {string} logType
 * @param {number} page
 * @param {number} pageSize
 * @param {string} pluginType
 * @param {string} timeRange
 */
export const doGetCollectList = (logType,page,pageSize,pluginType,timeRange) => getCollectList(logType,page,pageSize,pluginType,timeRange)
/**
 * 获取详情
 * @param logType
 * @param timeRange
 * @param ip
 * @param pluginType
 */
export const doGetDetail = (logType,timeRange,ip,pluginType) => getDetail(logType,timeRange,ip,pluginType)
