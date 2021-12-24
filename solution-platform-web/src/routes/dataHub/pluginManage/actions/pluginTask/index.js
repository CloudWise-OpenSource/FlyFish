/**
 * Created by john on 2018/1/24.
 */
import {
    getTaskList,
    getCreateData,
    getEditData,
    saveEditTask,
    delTask
} from '../../webAPI/pluginTask'

/**
 * 获取任务列表
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const doGetTaskList = (instanceId,nodeIp,nodePort) => getTaskList(instanceId,nodeIp,nodePort)

/**
 * 获取创建任务默认数据
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const doGetCreateData = (instanceId,nodeIp,nodePort) => getCreateData(instanceId,nodeIp,nodePort)

/**
 * 获取编辑默认数据
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 */
export const doGetEditData = (instanceId,nodeIp,nodePort,fileName) => getEditData(instanceId,nodeIp,nodePort,fileName)

/**
 * 任务-保存编辑
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 * @param {string} content
 */
export const doSaveEditTask = (instanceId,nodeIp,nodePort,fileName,content) => saveEditTask(instanceId,nodeIp,nodePort,fileName,content)

/**
 * 删除任务
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 */
export const doDelTask = (instanceId,nodeIp,nodePort,fileName) => delTask(instanceId,nodeIp,nodePort,fileName)
