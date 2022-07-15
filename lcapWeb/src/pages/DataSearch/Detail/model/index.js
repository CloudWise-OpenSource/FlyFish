import { toMobx } from "@chaoswise/cw-mobx";
import { successCode } from "@/config/global";
import { getDataSourceListService } from "../services";

const model = {
  // 唯一命名空间
  namespace: "DataSearchDetail",
  // 状态
  state: {
    dataSourceQuery: "",
    dataSourceList: [],
    dataSourceTableQuery: "",
    dataSourceTableList: [],
  },
  effects: {
    // 获取数据源
    *getDataSourceList(params) {
      const res = yield getDataSourceListService(params);
      if (res.code === successCode) {
        this.dataSourceList = res.data;
      }
    },
  },
  reducers: {},
};

export default toMobx(model);
