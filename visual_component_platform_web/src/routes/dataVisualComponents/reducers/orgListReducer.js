import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/organize';

const initState = {
    loading: false,
    orgList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                "org_id": 17,
                "account_id": 1,
                "name": "test",
                "description": "test",
                "deleted_at": 1,
                "created_at": 1512983392221,
                "updated_at": 1512983392221
            }*/
        ]
    },
};


orgListReducer.reducer = 'orgListReducer';
export default function orgListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_V_ORG_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置组织列表
        case ActionTypes.FETCH_DID_V_ORG_LIST:
            return update(state, {
                loading: { $set: false },
                orgList: { $set: action.orgList }
            });

        // 删除组织
        case ActionTypes.DEL_V_ORG:
            return update(state, {
                orgList: {
                    data: {$set: T.lodash.filter(state.orgList.data, (item) => action.org_ids.indexOf(item.org_id) === -1)}
                }
            });
    }

    return state;

}

