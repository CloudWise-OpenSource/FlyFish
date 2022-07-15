import { toMobx } from "@chaoswise/cw-mobx";
import { successCode } from "@/config/global";
import { getDataSourceListService } from "../services";

const model = {
  // 唯一命名空间
  namespace: "DataSearchDetail_ChooseDataSource",
  // 状态
  state: {
    dataSourceQuery: "",
    dataSourceList: [],
  },
  effects: {
    // 获取数据源
    *getDataSourceList(params) {
      const res = yield getDataSourceListService(params);
      if (res.code === successCode) {
        this.dataSourceList = res.data ? res.data.data : [];
      }
    },
  },
  reducers: {
    setDataSourceQuery(dataSourceQuery) {
      this.dataSourceQuery = dataSourceQuery;
    },
  },
};

export default toMobx(model);
