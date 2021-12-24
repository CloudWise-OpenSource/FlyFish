import update from 'immutability-helper';
import T from 'utils/T';
import * as ActionTypes from '../constants/actionTypes/group';

const initState = {
    loading: false,
    groupList: [],
};

/**
 * 删除指定的group
 * @param groupList
 * @param group_id
 * @returns {Array}
 */
const delGroupById = (groupList, group_id) => {
	let newGroups = [];

	for (let i = 0; i < groupList.length; i++){
		let group = groupList[i];

		if (Array.isArray(group.children) && group.children.length > 0) {
			group.children = delGroupById(group.children, group_id);
		}

		if (group.group_id != group_id) {
			newGroups.push(group);
		}
	}

	return newGroups;
};


groupListReducer.reducer = 'groupListReducer';
export default function groupListReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_GROUP_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置分组列表列表
        case ActionTypes.FETCH_DID_GROUP_LIST:
            return update(state, {
                loading: { $set: false },
                groupList: { $set: action.groupList }
            });

        // 删除分组
        case ActionTypes.DEL_GROUP:
            return update(state, {
                groupList: {$set: delGroupById(state.groupList, action.group_id)}
            });
    }

    return state;

}

