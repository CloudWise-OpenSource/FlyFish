/**
 * Created by john on 2018/1/23.
 */
import T from 'utils/T'
import EnumAPI from 'constants/EnumAPI'

/**
 * 获取日志列表
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const getLogList = (instanceId,nodeIp,nodePort) => T.request.postJSON(EnumAPI.getLogListAPI,{instanceId,nodeIp,nodePort})

/**
 * 获取日志内容
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 */
export const getLogContent = (instanceId,nodeIp,nodePort,fileName) => T.request.postJSON(EnumAPI.getLogContentAPI,{instanceId,nodeIp,nodePort,fileName})
