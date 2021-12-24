/**
 * Created by willem on 2018/1/23.
 */
import * as actionTypes from '../../constants/actionTypes/hostMonitorList';
import T from 'utils/T';
import {
    getHostAllList,
    getHostMonitorList,
    getHostDetails
} from '../../webAPI/hostMonitorList';


/**
 * 获取主机列表
 * @returns {function(*)}
 */
export const getHostAllListAction = () => {
    return (dispatch) => {
        // 开启下拉菜单加载状态
        dispatch(startSelectFetching());
        getHostAllList().then(resp => {
            // 更新主机列表
            dispatch(updateHostAllList(resp.data));
        }, resp => {
            T.prompt.error(resp.msg);
        });
    };
};

/**
 * 获取主机监控列表
 * @param {Number} page 当前页
 * @param {Number} pageSize 页数
 * @param {Array} ipList
 * @param {String} order
 * @param {String} sortField
 * @returns {function(*)}
 */
export const getHostMonitorListAction = (page, pageSize, ipList = [], order = '', sortField = '') => {
    return (dispatch) => {
        // 开启表格加载状态
        dispatch(startTableLoading());
        getHostMonitorList(page, pageSize, ipList, order, sortField).then(resp => {
            // 更新插件监控列表
            dispatch(updateHostMonitorList(resp.data));
        }, resp => {
            T.prompt.error(resp.msg);
        });
    };
};

/**
 * 获取主机详情----state操作方式，非reducer
 * @param {String} ip
 * @param {String} timeRange 时间范围
 * @returns {function(*)}
 */
export const doGetHostDetails = (ip, timeRange) => getHostDetails(ip, timeRange);


/**
 * 更新主机列表数据
 * @param {Array} data 主机列表数据
 */
export const updateHostAllList = (data) => ({ type: actionTypes.UPDATE_HOSTALLLIST, data });

/**
 * 更新主机监控列表数据
 * @param {Array} data
 */
export const updateHostMonitorList = (data) => ({ type: actionTypes.UPDATE_HOSTLIST, data });

/**
 * 开启表格加载状态
 */
export const startTableLoading = () => ({ type: actionTypes.START_TABLELOADING });

/**
 * 开启下拉菜单加载状态
 */
export const startSelectFetching = () => ({ type: actionTypes.START_SELECTLOADING });
