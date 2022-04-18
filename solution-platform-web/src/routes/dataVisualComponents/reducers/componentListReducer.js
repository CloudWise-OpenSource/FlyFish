import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/component';

const initState = {
    loading: false,
    componentList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 15,            // 分页中的数量
        currentPage: 1,         // 当前页数
        data: [
            /*{
                "component_id": 17,
                "categories_id": 1,
                "account_id": 1,
                "type": "1",
                "name": "test",
                "component_mark": "test",
                "is_developping": 1,
                "is_published": 0,
                "deleted_at": 1,
                "created_at": 1512983392221,
                "updated_at": 1512983392221
            }*/
        ]
    },
};


componentListReducer.reducer = 'componentListReducer';
export default function componentListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_V_COMPONENT_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置数据存储列表列表
        case ActionTypes.FETCH_DID_V_COMPONENT_LIST:
            return update(state, {
                loading: { $set: false },
                componentList: { $set: action.componentList }
            });

        // 删除数据存储
        case ActionTypes.DEL_V_COMPONENT:
            return update(state, {
                // componentList: {
                //     data: {$set: T.lodash.filter(state.componentList.data, (item) => action.component_ids.indexOf(item.component_id) === -1)}
                // }
            });
    }

    return state;

}

