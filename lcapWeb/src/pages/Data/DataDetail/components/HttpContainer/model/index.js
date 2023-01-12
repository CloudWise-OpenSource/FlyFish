import { toMobx, toJS } from '@chaoswise/cw-mobx';
import { reqNewOutside, reqChangeOutside, reqDataUsability } from '../services';
import _ from 'lodash';

const model = {
  // 唯一命名空间
  namespace: 'ProjectDetail',
  // 状态
  state: {
    columns: [],//定义字段
    dataColumns:[],//数据表
    lookDataJson: {}, //查询数据json
    addModalVisiable:false,
    addTableData: [],
    columnsData:[],
    dataColumnsData:[],
  },
  effects: {
    // 是否有数据
    *httpDataLink(params, callback) {
      const res = yield reqDataUsability(params);
      this.setlookDataJson(res.data);
      callback && callback(res);
    },
    // 新增表结构
    *newOutside(params, callback) {
      const res = yield reqNewOutside(params);
      callback && callback(res);
    },
    // 修改表结构
    *changeOutside(params, callback) {
      const res = yield reqChangeOutside(params);
      callback && callback(res);
    },
  },
  reducers: {
    setDataColumns(dataColumns){
      this.dataColumns=dataColumns
    },
    setDataColumnsData(dataColumnsData){
      this.dataColumnsData=dataColumnsData
    },
    setAddModalVisiable(flag){
      this.addModalVisiable=flag
    },
    setColumnsData(columnsData){
      this.columnsData=columnsData
    },
    setlookDataJson(res) {
      this.lookDataJson = res;
    },
  },
};

export default toMobx(model);
 