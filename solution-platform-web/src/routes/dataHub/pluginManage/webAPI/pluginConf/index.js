/**
 * Created by john on 2018/1/23.
 */
import T from 'utils/T'
import EnumAPI from 'constants/EnumAPI'

/**
 * 获取配置文件列表
 * @param {Object} params
 * @param {String} params.instanceId
 * @param {String} params.nodeIp
 * @param {String} params.nodePort
 * @return {Promise}
 */
export const getConfFileList = (params) => T.request.postJSON(EnumAPI.getConfFileList,params)

/**
 * 获取配置详情
 * @param {Object} params
 * @param {String} params.fileName
 * @param {String} params.instanceId
 * @param {String} params.nodeIp
 * @param {String} params.nodePort
 * @return {Promise}
 */
export const getConfigContent = (params) => T.request.postJSON(EnumAPI.getConfigContent,params)

/**
 * 保存配置
 * @param {Object} params
 * @param {String} params.content
 * @param {String} params.fileName
 * @param {String} params.instanceId
 * @param {String} params.nodeIp
 * @param {String} params.nodePort
 * @return {Promise}
 */
export const saveConf = (params) => T.request.postJSON(EnumAPI.saveConf,params)
