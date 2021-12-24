import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/role';

const initState = {
    loading: false,
    roleList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                role_id: 1,
                account_id: 1,
                role_name: "test",
                description: "test",
                deleted_at: 1,
                created_at: 1511335476178,
                updated_at: 1511335476178
            }*/
        ]
    },
};


roleListReducer.reducer = 'roleListReducer';
export default function roleListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_ROLE_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置角色列表列表
        case ActionTypes.FETCH_DID_ROLE_LIST:
            return update(state, {
                loading: { $set: false },
                roleList: { $set: action.roleList }
            });

        // 删除角色
        case ActionTypes.DEL_ROLE:
            return update(state, {
                // roleList: {
                //     data: {$set: T.lodash.filter(state.roleList.data, (item) => action.role_ids.indexOf(item.role_id) === -1)}
                // }
            });
    }

    return state;

}

