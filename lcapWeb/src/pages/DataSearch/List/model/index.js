import { toMobx } from '@chaoswise/cw-mobx';
import { getDataSearchListService, deleteDataSearchService } from '../services';
import _ from 'lodash';
import { successCode } from '@/config/global';

const model = {
  // 唯一命名空间
  namespace: 'DataSearchList',
  // 状态
  state: {
    searchParams: {},
    DataList: [], //项目列表
    total: 0,
    pageNo: 1,
    pageSize: 10,
    activeData: null, //选中数据
  },
  effects: {
    // 获取数据源列表
    *getDataList(params = {}, callback = () => {}) {
      let options = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      const res = yield getDataSearchListService(options);
      callback && callback(res.data, res);
      if (res.code === successCode) {
        this.setDataList(res);
      }
    },
    // 删除项目
    *deleteData(params = {}, callback) {
      const res = yield deleteDataSearchService(params);
      callback && callback(res);
    },
  },
  reducers: {
    setActiveData(item) {
      this.activeData = item;
    },
    setCurPage(page) {
      this.pageNo = page;
    },
    setpageSize() {
      this.pageSize = 10;
    },
    setDataList(res) {
      let { data, pageNo, pageSize, total } = res.data;
      this.DataList = data || [];
      this.total = total;
      this.pageNo = pageNo;
      this.pageSize = pageSize;
    },
    setpageNo(page) {
      this.pageNo = page;
    },
    setSearchParams(searchParams) {
      let sendParams = {};
      for (let i in searchParams) {
        if (searchParams[i]) {
          sendParams[i] = searchParams[i];
        }
      }
      this.searchParams = sendParams || {};
    },
  },
};

export default toMobx(model);
