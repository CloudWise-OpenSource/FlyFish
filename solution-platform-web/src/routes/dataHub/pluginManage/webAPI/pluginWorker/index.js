/**
 * Created by john on 2018/2/1.
 */
import T from 'utils/T'
import EnumAPI from 'constants/EnumAPI'

/**
 * 获取worker列表
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const getWorkerList = (instanceId,nodeIp,nodePort) => T.request.postJSON(EnumAPI.getWorkerList,{instanceId,nodeIp,nodePort})

/**
 * 开启worker
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} workName
 */
export const startWorker = (instanceId,nodeIp,nodePort,workName) => T.request.postJSON(EnumAPI.startWorker,{instanceId,nodeIp,nodePort,workName})

/**
 * 暂停worker
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} workName
 */
export const stopWorker = (instanceId,nodeIp,nodePort,workName) => T.request.postJSON(EnumAPI.stopWorker,{instanceId,nodeIp,nodePort,workName})
