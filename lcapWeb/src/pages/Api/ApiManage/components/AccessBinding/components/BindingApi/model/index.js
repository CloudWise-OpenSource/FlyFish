import { toMobx } from '@chaoswise/cw-mobx';
import { getProjectManageListService } from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "bindingApi",
  // 状态
  state: {
    searchParams: {
      time:'long',
      name:'',
      dateString:''
    }, 
    apiList: [], //项目列表
    total: 0,
    curPage:0,
    pageSize:10,
    activeApi: null, //选中项目
  },
  effects: {
    // 获取项目列表
    *getapiList(params = {}) {
      for (const i in this.searchParams) {
        if(!this.searchParams[i]){
            delete this.searchParams[i];
        }
      }
      // 判断long则删除datestr
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      const res = yield getProjectManageListService(options);
      this.setapiList(res);
    },
   
    
  },
  reducers: {
    setapiList(res) {
      this.apiList = res.data.list;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setCurPage(page){
      this.curPage=page;
    },
    setSearchParams(searchParams) {
      for (let i in searchParams) {
        if (searchParams[i]) {
          this.searchParams[i]=searchParams[i];
        }
      }
    },
    openDeactivateProjectModal(project) {
      this.activeApi = _.clone(project);
      this.isDeactivateProjectModalVisible = true;
    },
    closeDeactivateProjectModal() {
      this.activeApi = null;
      this.isDeactivateProjectModalVisible = false;
    },
  },
};

export default toMobx(model);