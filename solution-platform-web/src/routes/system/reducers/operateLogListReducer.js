import update from 'immutability-helper';
import * as ActionTypes from '../constants/actionTypes/operateLog';

const initState = {
    loading: false,
    operateLogList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                operate_log_id: 1,
                account_id: 1,
                log_type: 1,
                user_id: "test",
                content: "test",
                created_at: 1511335476178,
            }*/
        ]
    },
};


operateLogListReducer.reducer = 'operateLogListReducer';
export default function operateLogListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_OPERATE_LOG_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置操作日志列表列表
        case ActionTypes.FETCH_DID_OPERATE_LOG_LIST:
            return update(state, {
                loading: { $set: false },
                operateLogList: { $set: action.operateLogList }
            });
    }

    return state;

}

