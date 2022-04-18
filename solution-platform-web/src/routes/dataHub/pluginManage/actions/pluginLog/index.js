/**
 * Created by john on 2018/1/23.
 */
import {
    getLogList,
    getLogContent
} from '../../webAPI/pluginLog'

/**
 * 获取日志列表
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const doGetLogList = (instanceId,nodeIp,nodePort) => getLogList(instanceId,nodeIp,nodePort)

/**
 * 获取日志内容
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 */
export const doGetLogContent = (instanceId,nodeIp,nodePort,fileName) => getLogContent(instanceId,nodeIp,nodePort,fileName)

