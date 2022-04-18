import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/user';

const initState = {
    loading: false,
    userList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                user_id: 1,
                account_id: 1,
                user_email: "",
                user_name: "test",
                deleted_at: 1,
                created_at: 1511335476178,
                updated_at: 1511335476178
            }*/
        ]
    },
};


userListReducer.reducer = 'userListReducer';
export default function userListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_USER_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置用户列表列表
        case ActionTypes.FETCH_DID_USER_LIST:
            return update(state, {
                loading: { $set: false },
                userList: { $set: action.userList }
            });

        // 删除用户
        case ActionTypes.DEL_USER:
            return update(state, {
                // userList: {
                //     data: {$set: T.lodash.filter(state.userList.data, (item) => action.user_id !== item.user_id)}
                // }
            });
    }

    return state;

}

