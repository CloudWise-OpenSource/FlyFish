import { toMobx, toJS } from '@chaoswise/cw-mobx';
import _ from 'lodash';

const model = {
  // 唯一命名空间
  namespace: 'SelectIndicators',
  // 状态
  state: {
    searchItem: [], 
    name:null,
    datasourceId:null
  },
  effects: {
   
  },
  reducers: {
    setSearchItem(arr){
      this.searchItem=arr
    },
    setDatasourceId(id) {
      this.datasourceId=id
    }
  },
};

export default toMobx(model);
