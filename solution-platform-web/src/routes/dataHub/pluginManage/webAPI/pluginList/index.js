/**
 * Created by john on 2018/1/23.
 */
import T from 'utils/T'
import EnumAPI from 'constants/EnumAPI'

/**
 * 获取插件列表
 * @param {Object} pluginListParams
 * @param {Number} pluginListParams.page
 * @param {Number} pluginListParams.pageSize
 * @param {String} pluginListParams.pluginType
 * @param {Array} pluginListParams.ipList
 * @returns {Promise}
 */
export const getPluginList = (pluginListParams) => T.request.postJSON(EnumAPI.pluginList, pluginListParams);

/**
 * 获取主机列表
 * @return {Promise}
 */
export const getHostList = () => T.request.get(EnumAPI.hostAllList)

/**
 * 获取插件主机列表
 * @param {Number} page
 * @param {Number} pageSize
 * @param {String} ip
 * @return {Promise}
 */
export const getPluginHostList = (page,pageSize,ip) => T.request.get(EnumAPI.hostList,{page:page,pageSize:pageSize,ip:ip})

/**
 * 插件分发提交
 * @param dispatchParams
 * @param {Object} dispatchParams
 * @param {Object} dispatchParams.fromHost
 * @param {String} dispatchParams.pluginId
 * @param {Array} dispatchParams.toHostList
 * @return {Promise}
 */
export const postDispatchPlugin = (dispatchParams) => T.request.postJSON(EnumAPI.submitPlugin,dispatchParams)

/**
 * 启动插件
 * @param {Object} params
 * @param {String} params.nodeIp
 * @param {String} params.instanceId
 * @param {String} params.nodePort
 * @return {Promise}
 */
export const startPlugin = (params) => T.request.postJSON(EnumAPI.startPlugin,params)

/**
 * 暂停插件
 * @param {Object} params
 * @param {String} params.nodeIp
 * @param {String} params.instanceId
 * @param {String} params.nodePort
 * @return {Promise}
 */
export const stopPlugin = (params) => T.request.postJSON(EnumAPI.stopPlugin,params)

/**
 * 卸载插件
 * @param {Object} params
 * @param {String} params.nodeIp
 * @param {String} params.instanceId
 * @param {String} params.nodePort
 * @return {Promise}
 */
export const unInstallPlugin = (params) => T.request.postJSON(EnumAPI.uninstallPlugin,params)
