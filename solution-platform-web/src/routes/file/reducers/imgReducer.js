import update from 'immutability-helper';
import * as ActionTypes from '../constants/actionTypes/file';

const initState = {
    loading: false,
    imgList: {
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
    imgGroupList: {
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
    imgGroupList_:[]    //全部分组
};


const formatData = (data)=>{
    return data.map((item, idx)=>{
        item.key = idx;
        if(item.imgGroup){
            item.groupName = item.imgGroup.name;
        }
        return item
    })
}

imgReducer.reducer = 'imgReducer';
export default function imgReducer(state = initState, action) {

    switch (action.type) {
        case ActionTypes.FETCHING_GROUP_PAGE_LIST_STATUS:
            return update(state, {
                loading: { $set: true }
            });

        // 设置操作日志列表列表
        case ActionTypes.SET_IMG_GROUP_LIST:
            let imgGroupList = action.imgGroupList;
            if (imgGroupList.data){
                imgGroupList.data = formatData(imgGroupList.data);
                return update(state, {
                    imgGroupList: { $set: imgGroupList },
                    loading: { $set: false }
                });
            }else{
                return update(state, {
                    imgGroupList_: { $set: imgGroupList },
                    loading: { $set: false }
                });
            }
            
        // 设置操作日志列表列表
        case ActionTypes.SET_IMG_LIST:
            let imgList = action.imgList;
            imgList.data = formatData(imgList.data);
            return update(state, {
                imgList: { $set: imgList },
                loading: { $set: false }
            });
    }

    return state;

}

