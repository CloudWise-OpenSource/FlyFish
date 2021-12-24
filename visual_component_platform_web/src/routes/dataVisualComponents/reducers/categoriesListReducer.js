import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/categories';

const initState = {
    loading: false,
    categoriesList: {
        count: 0,               // 总数据量
        totalPages: 0,          // 总页数
        pageSize: 0,            // 分页中的数量
        currentPage: 0,         // 当前页数
        data: [
            /*{
                categories_id: 1,
                account_id: 1,
                type: 1,
                name: "test",
                config: "{\"a\":1}",
                deleted_at: 1,
                created_at: 1511335476178,
                updated_at: 1511335476178
            }*/
        ]
    },
};


categoriesListReducer.reducer = 'categoriesListReducer';
export default function categoriesListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_V_COMPONENT_CATEGORIES_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置数据存储列表列表
        case ActionTypes.FETCH_DID_V_COMPONENT_CATEGORIES_LIST:
            return update(state, {
                loading: { $set: false },
                categoriesList: { $set: action.categoriesList }
            });

        // 删除数据存储
        case ActionTypes.DEL_V_COMPONENT_CATEGORIES:
            return update(state, {
                // categoriesList: {
                //     data: {$set: T.lodash.filter(state.categoriesList.data, (item) => action.categories_ids.indexOf(item.categories_id) === -1)}
                // }
            });
    }

    return state;

}

