import * as ActionTypes from '../constants/actionTypes/operateLog';
import T from 'utils/T';

import {
    getOperateLogPageList,
    getAllUser
} from '../webAPI/operateLog';

/**
 * 获取操作日志分页列表
 * @param page
 * @param search
 * @returns {function(*)}
 */
export const getOperateLogPageListAction = (page, search = {}) => dispatch => {
    // 设置加载状态
    dispatch({ type: ActionTypes.FETCHING_OPERATE_LOG_LIST_STATUS });

    // 获取数据
    getOperateLogPageList(page, search).then((resp) => {
        dispatch({ type: ActionTypes.FETCH_DID_OPERATE_LOG_LIST, operateLogList: resp.data });
    }, (resp) => {
        T.prompt.error(resp.msg);
    });
};

/**
 * 获取所有的用户
 * @return {Promise}
 */
export const doGetAllUser = () => getAllUser();

