import { toMobx, toJS } from '@chaoswise/cw-mobx';
import { reqNewOutside, reqTestQuery, reqApiSelect, reqChangeOutside, reqDataUsability, reqSearchItemSelect } from '../services';
import _ from 'lodash';

const model = {
  // 唯一命名空间
  namespace: 'apiContainer',
  // 状态
  state: {
    columns: [],//定义字段
    columnsData:[],
    dataColumns:[],//数据表
    dataColumnsData:[],
    responseData: null,
    addModalVisiable:false,
    requestValue:null


  },
  effects: {
    //连接测试
    *query(params) {
      const res = yield reqTestQuery(params);
      this.responseData = res.data
    },
    // 修改表结构
    *changeOutside(params, callback) {
      const res = yield reqChangeOutside(params);
      callback && callback(res);
    },
  },
  reducers: {
    setRequestValue(value){
      this.requestValue=value
    },
    setDataColumns(dataColumns){
      this.dataColumns=dataColumns
    },
    setDataColumnsData(dataColumnsData){
      this.dataColumnsData=dataColumnsData
    },
    setColumnsData(columnsData){
      this.columnsData=columnsData
    },
    setcolumns(columns){
      this.columns=columns
    },
    setAddModalVisiable(flag){
      this.addModalVisiable=flag
    }
  },
};

export default toMobx(model);
