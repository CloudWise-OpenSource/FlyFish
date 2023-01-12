import { toMobx } from '@chaoswise/cw-mobx';
import { saveDataService, lookDataUsability, changeDataService, getDataDetailService } from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "NewDataManege",
  // 状态
  state: {
    searchParams: {},
    dataDetail: {},
    isJsonEditVisiable: false,
    data: []
  },
  effects: {
    // 数据源详情
    *getDataDetail(datasourceId,callback) {
      const res = yield getDataDetailService({datasourceId});
      this.setdataDetail(res.data)
      callback&&callback(res.data)
      
    },
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
    setdataDetail(data) {
      this.dataDetail = data
    },
    setIsJsonEditVisiable(flag) {
      this.isJsonEditVisiable = flag;
    },
    setData(data) {
      this.data = data;
    }
  },
};

export default toMobx(model);