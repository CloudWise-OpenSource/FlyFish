/**
 * Created by john on 2018/1/23.
 */
import T from 'utils/T'
import * as actionTypes from '../../constants/actionTypes/pluginList'
import {
    getPluginList,
    getHostList,
    getPluginHostList,
    postDispatchPlugin,
    startPlugin,
    stopPlugin,
    unInstallPlugin
} from '../../webAPI/pluginList'

/**
 * 设置插件列表数据
 * @param {Object} allData
 * @param {Number} allData.page
 * @param {Number} allData.pageSize
 * @param {Number} allData.totalCount
 * @param {Number} allData.pageCount
 * @param {Array} allData.list
 * @returns {{type: string, data: *}}
 */
const setPluginList = (allData) => {
    const { page, pageSize, totalCount, pageCount, list} = allData;
    let arr = [];
    list.forEach((item,idx) => {
       let pluginLength = item.pluginList.length
        item.pluginList.forEach((itemx, num) => {
            let obj = {
                key: String(idx) + String(num),
                hubStatus: item.hubStatus,
                hostIp: item.nodeIp,
                pluginName: itemx.pluginName,
                pluginType: itemx.pluginType,
                pluginStatus: itemx.status,
                task: itemx.taskCount,       //当大于0时可点击跳转
                worker: item.hubStatus,               //当插件状态为使用中时，可点击跳转 1为使用中，0为暂停
                pluginId: itemx.pluginId,       //插件id
                nodePort: itemx.nodePort,        //端口
                instanceId:itemx.instanceId,
                hostNum:num,   // 用于合并行   同一ip下的插件索引
                pluginLen:pluginLength  //  用于合并行  同一ip下插件的总量
            }

            arr.push(obj)
        })
    })

    return{
        type:actionTypes.GET_PLUGIN_LIST,
        data:arr,
        page,
        pageSize,
        totalCount,
        pageCount
    }
}

/**
 * 开启loading
 * @returns {{type: string}}
 */
const setLoading = () => {
    return{
        type:actionTypes.START_LOADING
    }
}

/**
 * 获取插件列表
 * @param {Object} pluginListParams
 * @param {Number} pluginListParams.page
 * @param {Number} pluginListParams.pageSize
 * @param {String} pluginListParams.pluginType
 * @param {Array} pluginListParams.ipList
 * @returns {function(*)}
 */
export const getPluginListAction = (pluginListParams) => {
    return (dispatch) => {

        dispatch(setLoading())
        getPluginList(pluginListParams).then(resp=>{

            dispatch(setPluginList(resp.data))
        },resp=>{
            T.prompt.error(resp.msg)
        })

    }
}

/**
 * 获取主机列表
 * @param {Array} hostListData
 * @returns {{type: string, hostListData: *}}
 */
const setHostList = (hostListData) => {
    return{
        type:actionTypes.GET_HOST_LIST,
        hostListData
    }
}

/**
 * 获取主机列表
 * @returns {function(*)}
 */
export const getHostListAction = () => {
    return (dispatch) => {

        getHostList().then((resp)=>{
            dispatch(setHostList(resp.data))
        },(resp)=>{
            T.prompt.error(resp.msg)
        })
    }
}

/**
 * 获取插件主机列表
 * @param {Number} page
 * @param {Number} pageSize
 * @param {String} ip
 * @returns {Promise}
 */

export const doGetPluginHostList = (page,pageSize,ip) => getPluginHostList(page,pageSize,ip)

/**
 * 插件分发-提交
 * @param {Object} dispatchParams
 * @param {Object} dispatchParams.fromHost
 * @param {String} dispatchParams.pluginId
 * @param {Array} dispatchParams.toHostList
 * @returns {Promise}
 */
export const doPostDispatchPlugin = (dispatchParams) => postDispatchPlugin(dispatchParams)

/**
 * 启动插件
 * @param {Object} params
 * @param {String} params.nodeIp
 * @param {String} params.instanceId
 * @param {String} params.nodePort
 * @return {*}
 */
export const doStartPlugin = (params) => startPlugin(params)

/**
 * 暂停插件
 * @param {Object} params
 * @param {String} params.nodeIp
 * @param {String} params.instanceId
 * @param {String} params.nodePort
 * @return {*}
 */
export const doStopPlugin = (params) => stopPlugin(params)

/**
 * 卸载插件
 * @param {Object} params
 * @param {String} params.nodeIp
 * @param {String} params.instanceId
 * @param {String} params.nodePort
 * @return {*}
 */
export const doUnInstallPlugin = (params) => unInstallPlugin(params)
