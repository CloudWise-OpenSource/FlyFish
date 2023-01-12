import { toMobx, toJS } from '@chaoswise/cw-mobx';
import { reqTableServer, reqTreeListServer, reqDetail, reqChangeOutside, reqDeleteOneServer, reqNewOutside, reqDataUsability } from "../services";
import _ from "lodash";
import { successCode } from "@/config/global";
import { message } from "@chaoswise/ui";

const model = {
  // 唯一命名空间
  namespace: "DataDetailStore",
  // 状态
  state: {
    tableList: [],
    bottomTable: [],
    activeData: {},
    activeContent: {}, //右侧contain值
    endTableData: [],// 底部给后端的
    headerArr: [],
    getNewData: false,
    paramsArr: [],
    tableId: '' //表id

  },
  effects: {
    // 右侧表格
    *getTableList(params, type, callback) {
      const res = yield reqTableServer(params);
      if (res.code !== successCode) {
        message.error(res.msg || '获取表格失败，请重新查询');
      }
      this.setTableList(res, type);
      callback && callback(res);
    },
    // 新增表结构
    *newOutside(params, callback) {
      const res = yield reqNewOutside(params);
      callback && callback();
    },
    // 获取详情
    *getDetail(params, callback) {
      const res = yield reqDetail(params);
      this.activeData = res.data;
      callback && callback(res.data);
    },

  },
  reducers: {
    setgetNewData() {
      this.getNewData = false
    },
    resetBottomTable() {
      this.bottomTable = [];
    },
    setEndTableData(arr) {
      this.endTableData = arr;
    },
    setActiveContent(item) {
      this.activeContent = item;
    },
    setData(res) {
      this.showEditData = res.data;
    },
    resetTableList() {
      this.tableList = [];
    },
    resetAllData() {
      this.tableList = [];
      this.bottomTable = [];
      this.activeContent = null;
      this.headerArr = [];
      this.paramsArr = [];
      this.getNewData = true
    },
    setTableList(res, type) {
      if (!res.data) {
        this.bottomTable = [];
        this.tableList = [];
        this.activeContent = {};
        this.headerArr = [],
          this.paramsArr = [];
      }
      if (type !== 'HTTP' && type !== 'Redis'&& type !== 'Zabbix') {
        if (res.data) {
          let { fields = {}, exampleData = {} } = res.data;
          let tableTop = [];
          for (const i in fields) {
            tableTop.push({ name: i, value: fields[i] });
          }
          this.bottomTable = exampleData;
          this.tableList = tableTop;
          this.activeContent = fields;

        }

      } else if (type == 'Redis') {
        if (res.data) {
          let { fields = {}, exampleData = {}, tableMeta = {}, tableId = '' } = res.data;
          this.tableId = tableId;
          let tableTop = [];
          for (const i in fields) {
            tableTop.push({ name: i, value: fields[i] });
          }
          this.bottomTable = exampleData;
          this.tableList = tableTop;
          this.activeContent = {
            datasourceId: res.data.datasourceId,
            ...tableMeta
          };
        }
      } else if (type == 'Zabbix') {
        this.activeContent=res.data
      } else {
        let { tableMeta = {}, tableId = '' } = res.data;
        this.tableId = tableId;
        if (tableMeta) {
          let { params = {}, header = {}, fields = {}, requestBody = {}, exampleData = {} } = tableMeta;
          this.headerArr = header,
            this.paramsArr = params;
          this.activeContent = {
            ...this.activeContent,
            header,
            params,
            requestBody,
            fields,
            exampleData
          };
        }

      }

    },
    setHeader(arr) {
      this.headerArr = arr;
    },
    setParams(arr) {
      this.paramsArr = arr;
    },
  },
};

export default toMobx(model);