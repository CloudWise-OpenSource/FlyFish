import { toMobx } from "@chaoswise/cw-mobx";
import { editDataSearchService, getDataSearchService } from "../services";
import { successCode } from "@/config/global";

const model = {
  // 唯一命名空间
  namespace: "DataSearchEdit",
  // 状态
  state: {
    dataSearch: {},
  },
  effects: {
    *getDataSearch(id) {
      const res = yield getDataSearchService(id);
      if (res.code === successCode) {
        if (res.data.setting && res.data.setting.combineInfo) {
          res.data.setting.combineInfo = res.data.setting.combineInfo.map(item => { 
            return {
              key: new Date().getTime() + Math.ceil(Math.random() * 10000000),
              value: item,
            };
          });
        }
        this.setDataSearch(res.data);
      }
    },
    // 保存项目
    *saveDataSearch(params = {}, callback) {
      const res = yield editDataSearchService(params);
      callback && callback(res);
    },
  },
  reducers: {
    setDataSearch(dataSearch) {
      this.dataSearch = dataSearch;
    },
  },
};

export default toMobx(model);
