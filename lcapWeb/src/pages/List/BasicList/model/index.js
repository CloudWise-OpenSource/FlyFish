import { toMobx } from '@chaoswise/cw-mobx';
import { getBasicTableListApi } from '../services';

const model = {
  // 唯一命名空间
  namespace: 'basicStore',
  // 状态
  state: {
    basicListData: [], // 基础列表数据
    curPage:0, // 默认页码
    pageSize: 30,// 默认页码size
    total: 10, // 默认总数
  },
  // 副作用actins，处理异步请求 (函数生成器)
  effects: {
    // 获取基础列表数据
    *getBasicTableList(params = {}) {
      // 处理参数
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...params,
      };
      // 请求数据
      const res = yield getBasicTableListApi(options);
      this.basicListData = res.data;
      this.total = res.total;
    }
  }
};

export default toMobx(model);