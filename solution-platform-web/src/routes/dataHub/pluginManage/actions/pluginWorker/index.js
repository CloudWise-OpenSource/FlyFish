/**
 * Created by john on 2018/1/24.
 */
import {
    getWorkerList,
    startWorker,
    stopWorker
} from '../../webAPI/pluginWorker'

/**
 * 获取worker列表
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const doGetWorkerList = (instanceId,nodeIp,nodePort) => getWorkerList(instanceId,nodeIp,nodePort)

/**
 * 开启worker
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} workName
 */
export const doStartWorker = (instanceId,nodeIp,nodePort,workName) => startWorker(instanceId,nodeIp,nodePort,workName)

/**
 * 暂停worker
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} workName
 */
export const doStopWorker = (instanceId,nodeIp,nodePort,workName) => stopWorker(instanceId,nodeIp,nodePort,workName)
