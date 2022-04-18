/**
 * Created by john on 2018/1/23.
 */
import * as actionTypes from '../../constants/actionTypes/pluginLog';
import update from 'immutability-helper';

const initState = {
    companyTableData:[]
};

PluginLogReducer.reducer='PluginLogReducer';
export default function PluginLogReducer(state=initState,action){
    switch(action.type){
        // 更新企业列表
        case actionTypes:{
            return update(state, {
                companyTableData: {$set: action.data.tableDataSource},
            })
        }
    }
    return state;
}
