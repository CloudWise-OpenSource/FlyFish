/**
 * Created by john on 2018/1/23.
 */
import {
    getConfFileList,
    getConfigContent,
    saveConf
} from '../../webAPI/pluginConf'

/**
 * 获取配置文件列表
 * @param {Object} params
 * @param {String} params.instanceId
 * @param {String} params.nodeIp
 * @param {String} params.nodePort
 * @return {*}
 */
export const doGetConfFileList = (params) => getConfFileList(params)

/**
 * 获取配置详情
 * @param {Object} params
 * @param {String} params.fileName
 * @param {String} params.instanceId
 * @param {String} params.nodeIp
 * @param {String} params.nodePort
 * @return {*}
 */
export const doGetConfigContent = (params) => getConfigContent(params)

/**
 * 保存配置
 * @param {Object} params
 * @param {String} params.content
 * @param {String} params.fileName
 * @param {String} params.instanceId
 * @param {String} params.nodeIp
 * @param {String} params.nodePort
 * @return {*}
 */
export const doSaveConf = (params) => saveConf(params)
