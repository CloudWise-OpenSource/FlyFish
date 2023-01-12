import { toMobx } from '@chaoswise/cw-mobx';
import { successCode } from '@/config/global';
import { getQueryDataListService } from '../services';

const model = {
  // 唯一命名空间
  namespace: 'DataGroupSearchDetail',
  // 状态
  state: {
    queryData: [],
  },
  effects: {
    *getQueryDataList(params, successCallback, errorCallback) {
      const res = yield getQueryDataListService(params);
      if (res.code === successCode) {
        if (res.data.flag) {
          successCallback();
          this.queryData = res.data.data;
        } else {
          errorCallback(res.data.data);
        }
      } else {
        errorCallback(res.msg);
      }
    },
  },
  reducers: {
    reset() {
      this.queryData = [];
    },
  },
};

export default toMobx(model);
