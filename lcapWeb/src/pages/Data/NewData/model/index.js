import { toMobx } from '@chaoswise/cw-mobx';
import { saveDataService,lookDataUsability,changeDataService } from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "NewDataManege",
  // 状态
  state: {
    searchParams: {}, 
    isJsonEditVisiable:false,
    data:[]
  },
  effects: {
    // 新增数据源
    *saveData(params = {}, callback) {
      const res = yield saveDataService(params);
      callback && callback(res);
    },
     // 修改数据源
     *changeData(params = {}, callback) {
      const res = yield changeDataService(params);
      callback && callback(res);
    },
   // 可用性
   *dataUsability(params = {}, callback) {
    const res = yield lookDataUsability(params);
    callback && callback(res);
  },
  },
  reducers: {
    setIsJsonEditVisiable(flag){
      this.isJsonEditVisiable=flag;
    },
    setData(data){
      this.data=data;
    }
  },
};

export default toMobx(model);