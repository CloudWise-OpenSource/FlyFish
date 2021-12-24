import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/accessToken';

const initState = {
    loading: false,
    accessTokenList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                access_key_id: 1,
                access_key_secret: 1,
                status: "",
                deleted_at: 1,
                created_at: 1511335476178,
                updated_at: 1511335476178
            }*/
        ]
    },
};


accessTokenListReducer.reducer = 'accessTokenListReducer';
export default function accessTokenListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_ACCESS_TOKEN_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置accessToken列表列表
        case ActionTypes.FETCH_DID_ACCESS_TOKEN_LIST:
            return update(state, {
                loading: { $set: false },
                accessTokenList: { $set: action.accessTokenList }
            });

        // 删除accessToken
        case ActionTypes.DEL_ACCESS_TOKEN:
            return update(state, {
                accessTokenList: {
                    data: {$set: T.lodash.filter(state.accessTokenList.data, (item) => action.access_key_ids.indexOf(item.access_key_id) === -1)}
                }
            });
    }

    return state;

}

