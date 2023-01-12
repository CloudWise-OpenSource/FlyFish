import { toMobx, toJS } from '@chaoswise/cw-mobx';
import { reqNewOutside, reqTestQuery, reqApiSelect, reqChangeOutside, reqDataUsability, reqSearchItemSelect } from '../services';
import _ from 'lodash';

const model = {
  // 唯一命名空间
  namespace: 'ProjectDetail',
  // 状态
  state: {
    endTableData: [], // 底部给后端的
    modalVisiable: false,
    lookDataJson: {}, //查询数据json
    addTableData: [],
    addTableColumns: [],
    searchItem: [],
    name: null,
    radioCheckId: null,
    monitorVisiable: false,
    exampleData: [],//选择指标底部数据
    fields: [],
    groupList:[],//api的下拉框数据
    methodList:[]

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
    //连接测试
    *query(params,callback) {
      const res = yield reqTestQuery(params);
      callback&&callback(res)
      let { exampleData, fields } = res.data
      this.exampleData = exampleData
      this.fields = fields
    },
    //调用api下拉框
    *getApiSelectData(datasourceId,callback) {
      let obj = {
        datasourceId,
      }
      const res = yield reqApiSelect(obj);
      this.setApiSelectData(res.data);
      callback&&callback(res.data.methodList)
    },
    // 是否有监控项数据
    *getSearchItem(datasourceId,callback) {
      let obj = {
        datasourceId,
        name: this.name
      }
      const res = yield reqSearchItemSelect(obj);
      this.setSearchItem(res.data);
      callback&&callback(res.data)
    },
  },
  reducers: {
    setApiSelectData({groupList,methodList}){
      this.groupList=groupList
      this.methodList=methodList
    },
    setTableData(exampleData, fields) {
      this.exampleData = exampleData
      this.fields = fields
    },
    setRadioCheckId(id) {
      this.radioCheckId = id
    },
    setMonitorVisiable(flag) {
      this.monitorVisiable = flag
    },
    setName(name) {
      this.name = name
    },
    setSearchItem(arr) {
      this.searchItem = arr
    },
    seTaddTableData(arr) {
      this.addTableData = [...arr];
    },
    setlookDataJson(res) {
      this.lookDataJson = res;
    },
    setActiveContent(item) {
      this.activeContent = item;
    },
    setResetData(data) {
      this.resetData = data;
    },
    setData(res) {
      this.showEditData = res.data;
    },
    setModalVisiable(flag) {
      this.modalVisiable = flag;
    },
    setEndTableData(arr) {
      this.endTableData = arr;
    },
    setAddTableColums(arr) {
      this.addTableColumns = arr;
    },
    setTableList(res, type) {
      if (type !== 'HTTP') {
        let { fields, exampleData } = res.data;
        let tableTop = [];
        for (const i in fields) {
          tableTop.push({ name: i, value: fields[i] });
        }
        this.bottomTable = exampleData;
        this.tableList = tableTop;
      } else {
        let { tableMeta } = res.data;
        let {
          params = {},
          header = {},
          requestBody = {},
          fields = {},
          exampleData = {},
        } = tableMeta;
        this.activeContent = {
          ...this.activeContent,
          header,
          params,
          requestBody,
        };
      }
    },
    setTreeList(res) {
      this.treeList = res;
    },
  },
};

export default toMobx(model);
