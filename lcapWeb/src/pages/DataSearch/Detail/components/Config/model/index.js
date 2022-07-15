import { toMobx } from '@chaoswise/cw-mobx';
import { successCode } from '@/config/global';
import { getQueryDataListService, getComponentListService } from '../services';

const model = {
  // 唯一命名空间
  namespace: 'DataSearchDetail_Config',
  // 状态
  state: {
    componentList: [],
    queryData: null,
    queryDataPaging: null,
    activeComponent: null,
    activeComponentDataConfig: {},
    isChooseComponentVisible: false,
    isComponentSettingVisible: false,
  },
  effects: {
    *getQueryDataList(params, callback) {
      const res = yield getQueryDataListService(params);
      if (res.code === successCode) {
        this.queryData = res.data;
      }
      callback && callback(res);
    },
    *getComponentList() {
      const res = yield getComponentListService();
      if (res.code === successCode) {
        if (res.data && res.data.length > 0) {
          let data = res.data;
          this.componentList = data;
        }
      }
    },
  },
  reducers: {
    reset() {
      this.queryData = null;
      this.activeComponent = null;
      this.activeComponentDataConfig = {};
      this.isChooseComponentVisible = false;
      this.isComponentSettingVisible = false;
    },
    setQueryDataList(queryData, queryDataPaging) {
      this.queryData = queryData;
      this.queryDataPaging = queryDataPaging;
    },
    setChooseComponentVisible(isChooseComponentVisible) {
      this.isChooseComponentVisible = isChooseComponentVisible;
      if (isChooseComponentVisible && this.isComponentSettingVisible) {
        this.isComponentSettingVisible = false;
      }
    },
    setComponentSettingVisible(isComponentSettingVisible) {
      this.isComponentSettingVisible = isComponentSettingVisible;
      if (isComponentSettingVisible && this.isChooseComponentVisible) {
        this.isChooseComponentVisible = false;
      }
    },
    setActiveComponent(activeComponent) {
      if (
        this.activeComponent &&
        this.activeComponent.id === activeComponent.id
      ) {
        return;
      }
      this.activeComponent = activeComponent;
      this.activeComponentDataConfig = {};
    },
    setActiveComponentDataConfig(activeComponentDataConfig) {
      this.activeComponentDataConfig = activeComponentDataConfig;
    },
  },
};

export default toMobx(model);
