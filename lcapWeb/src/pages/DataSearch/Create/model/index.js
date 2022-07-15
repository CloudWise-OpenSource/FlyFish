import { toMobx } from "@chaoswise/cw-mobx";
import { createDataSearchService } from "../services";
import _ from "lodash";
import { successCode } from "@/config/global";
import { dataSearchTypeMappings } from "@/pages/DataSearch/constants/enum";

const defaultDataSearch = {
  queryType: dataSearchTypeMappings.basic.id,
  datasourceId: null,
  datasourceName: "",
  tableName: "",
  unitId: null,
  queryName: "",
  projectId: null,
  setting: {},
  sql: "",
};

const model = {
  // 唯一命名空间
  namespace: "DataSearchCreate",
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
