/**
 * Created by john on 2018/1/23.
 */
import * as actionTypes from '../../constants/actionTypes/pluginConf';
import update from 'immutability-helper';

const initState = {
    companyTableData:[]
};

PluginConfReducer.reducer='PluginConfReducer';
export default function PluginConfReducer(state=initState,action){
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
