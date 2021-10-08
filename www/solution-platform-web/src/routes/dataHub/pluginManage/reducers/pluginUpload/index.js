/**
 * Created by john on 2018/1/23.
 */
import * as actionTypes from '../../constants/actionTypes/pluginUpload';
import update from 'immutability-helper';

const initState = {
    hostListData:[]
};


PluginUploadReducer.reducer='PluginUploadReducer';
export default function PluginUploadReducer(state=initState,action){
    switch(action.type){
        // 更新主机列表
        case actionTypes:{
            return update(state, {
                hostListData: {$set: action.data.tableDataSource},
            })
        }
    }
    return state;
}
