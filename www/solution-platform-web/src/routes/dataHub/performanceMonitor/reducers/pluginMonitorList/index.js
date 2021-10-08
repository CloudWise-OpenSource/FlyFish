/**
 * Created by willem on 2018/1/23.
 */
import * as actionTypes from '../../constants/actionTypes/pluginMonitorList';
import update from 'immutability-helper';

const initState = {
    hostAllList: {              // 主机列表
        list: [],
        isLoading: false        // select下拉菜单远程加载
    },
    monitorList: {              // 表格数据
        list: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
        isLoading: false,       // table加载状态
    },
};

pluginMonitorListReducer.reducer = 'pluginMonitorListReducer';
export default function pluginMonitorListReducer(state = initState, action) {
    switch (action.type) {
        // 更新主机列表
        case actionTypes.UPDATE_HOSTALLLIST: {
            return update(state, {
                hostAllList: {
                    $set: {
                        list: action.data,
                        isLoading: false
                    }
                }
            });
        }
        // 更新表格数据
        case actionTypes.UPDATE_PLUGINLIST: {
            return update(state, {
                monitorList: {
                    $set: {
                        ...action.data,
                        isLoading: false
                    },
                },
            });
        }
        // 开启表格加载
        case actionTypes.START_TABLELOADING: {
            return update(state, {
                monitorList: { $merge: { isLoading: true }},
            });
        }
        // 开启下拉菜单远程加载
        case actionTypes.START_SELECTLOADING: {
            return update(state, {
                hostAllList: { $merge: { isLoading: true }},
            });
        }
    }

    return state;
}
