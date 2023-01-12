import { toMobx } from '@chaoswise/cw-mobx';
import { changeDataService,getDataManegeList, reqDetail,deleteDataService} from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "DataManage",
  // 状态
  state: {
    searchParams: '', 
    DataList: [], //项目列表
    total: 0,
    pageNo:1,
    pageSize:10
  },
  effects: {
    // 获取数据源列表
    *getDataList(params = {},callback=()=>{}) {
      let options = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      const res = yield getDataManegeList(options);
      callback&&callback(res.data);
      this.setDataList(res);
    },
    // 编辑项目
    *changeProject(id,params = {}, callback) {
      const res = yield changeDataService(id,params);
      callback && callback(res);
    },
    // 删除项目
    *deleteData(params = {}, callback) {
      const res = yield deleteDataService(params);
      callback && callback(res);
    },
    // 获取详情
    *getDetail(params,callback) {
      const res = yield reqDetail(params);
      callback && callback(res.data);
    },
  },
  reducers: {
    setCurPage(page){
      this.pageNo=page;
    },
    setDataList(res) {
      let {data,pageNo,pageSize,total}=res.data;
      this.DataList = data;
      this.total = total;
      this.pageNo = pageNo;
      this.pageSize = pageSize;
    },
    setpageSize(pageSize){
      this.pageSize=pageSize;
    },
    setpageNo(page){
      this.pageNo=page;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams; 
    }
  },
};

export default toMobx(model);