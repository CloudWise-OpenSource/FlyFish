/**
 * Created by john on 2018/1/23.
 */
import * as actionTypes from '../../constants/actionTypes/pluginList';
import update from 'immutability-helper';

const initState = {
    loading:false,
    hostListData:[], //主机列表数据
    pluginListData:[], //插件列表数据
    pluginListParams:{ //插件列表参数
        page: 1,
        pageSize: 10,
        pluginType: "",
        ipList: []
    },
    totalCount: 0,
    pageCount: 0

};

PluginListReducer.reducer='PluginListReducer';
export default function PluginListReducer(state=initState,action){
    switch(action.type){

        case actionTypes.START_LOADING:
            return update(state,{
                loading:{$set:true}
            })
        // 更新主机列表
        case actionTypes.GET_PLUGIN_LIST:
            return update(state, {
                pluginListData: {$set: action.data},
                pluginListParams:{
                    page:{$set:action.page},
                    pageSize:{$set:action.pageSize}
                },
                totalCount:{$set:action.totalCount},
                pageCount:{$set:action.pageCount},
                loading:{$set:false}
            })

        case actionTypes.GET_HOST_LIST:
            return update(state,{
                hostListData:{$set:action.hostListData}
            })
        default:
            break;
    }
    return state;
}
