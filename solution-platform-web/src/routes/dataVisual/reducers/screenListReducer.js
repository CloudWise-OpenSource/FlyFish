import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/bigScreen';

const initState = {
    loading: false,
    delScreenLoading: false,
    screenList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                screen_id: 1,
                account_id: 1,
                name: "test",
                cover: "",
            }*/
        ]
    }
};


screenListReducer.reducer = 'screenListReducer';
export default function screenListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_SCREEN_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置大屏列表列表
        case ActionTypes.FETCH_DID_SCREEN_LIST:
            return update(state, {
                loading: { $set: false },
                screenList: { $set: action.screenList }
            });

        // 删除大屏
        case ActionTypes.DEL_SCREEN:
            return update(state, {
                screenList: {
                    data: {$set: T.lodash.filter(state.screenList.data, (item) => action.screen_ids.indexOf(item.screen_id) === -1)}
                }
            });
    }

    return state;

}

