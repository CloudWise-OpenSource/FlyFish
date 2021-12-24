/**
 * Created by john on 2018/1/31.
 */
import T from 'utils/T'
import EnumAPI from 'constants/EnumAPI'

/**
 * 获取任务列表
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const getTaskList = (instanceId,nodeIp,nodePort) => T.request.postJSON(EnumAPI.getTaskList,{instanceId,nodeIp,nodePort})

/**
 * 获取创建任务默认数据
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 */
export const getCreateData = (instanceId,nodeIp,nodePort) => T.request.postJSON(EnumAPI.getCreateData,{instanceId,nodeIp,nodePort})

/**
 * 获取编辑默认数据
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 */
export const getEditData = (instanceId,nodeIp,nodePort,fileName) => T.request.postJSON(EnumAPI.getEditData,{instanceId,nodeIp,nodePort,fileName})

/**
 * 任务-保存编辑
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 * @param {string} content
 */
export const saveEditTask = (instanceId,nodeIp,nodePort,fileName,content) => T.request.postJSON(EnumAPI.saveEditTask,{instanceId,nodeIp,nodePort,fileName,content})

/**
 * 删除任务
 * @param {string} instanceId
 * @param {string} nodeIp
 * @param {string} nodePort
 * @param {string} fileName
 */
export const delTask = (instanceId,nodeIp,nodePort,fileName) => T.request.postJSON(EnumAPI.delTask,{instanceId,nodeIp,nodePort,fileName})
