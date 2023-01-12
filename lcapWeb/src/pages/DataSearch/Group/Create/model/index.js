import { toMobx } from "@chaoswise/cw-mobx";
import { createDataSearchService } from "../services";
import _ from "lodash";
import { successCode } from "@/config/global";

const defaultDataSearch = {
  type: null,
  setting: {
    combineInfo: [
      {
        key: new Date().getTime() + Math.ceil(Math.random() * 10000000),
        value: null,
      },
    ],
    queryType: null,
  },
};

const model = {
  // 唯一命名空间
  namespace: "DataGroupSearchCreate",
  // 状态
  state: {
    dataSearch: _.cloneDeep(defaultDataSearch),
  },
  effects: {
    // 保存项目
    *saveDataSearch(params = {}, callback) {
      const res = yield createDataSearchService(params);
      callback && callback(res);
    },
  },
  reducers: {
    setDataSearch(dataSearch) {
      this.dataSearch = dataSearch;
    },
    resetDataSearch() {
      this.dataSearch = _.cloneDeep(defaultDataSearch);
    },
  },
};

export default toMobx(model);
