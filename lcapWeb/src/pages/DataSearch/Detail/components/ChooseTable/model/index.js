import { toMobx } from "@chaoswise/cw-mobx";
import { successCode } from "@/config/global";
import { getTableListService } from "../services";

const model = {
  // 唯一命名空间
  namespace: "DataSearchDetail_ChooseDataSourceTable",
  // 状态
  state: {
    tableQuery: "",
    tableList: [],
  },
  effects: {
    // 获取数据源
    *getTableList(params) {
      const res = yield getTableListService(params);
      if (res.code === successCode) {
        this.tableList = res.data ? res.data : [];
      }
    },
  },
  reducers: {
    setTableQuery(tableQuery) {
      this.tableQuery = tableQuery;
    },
  },
};

export default toMobx(model);
