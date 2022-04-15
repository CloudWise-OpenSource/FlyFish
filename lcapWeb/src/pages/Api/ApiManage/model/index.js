import { toMobx } from '@chaoswise/cw-mobx';
import { getProjectManageListService, industryList,addNewIndustry,changeProjectService,saveProjectService,deleteProjectService } from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "AppApiManage",
  // 状态
  state: {
    searchParams: {}, 
    projectList: [], //项目列表
    total: 0,
    curPage:0,
    pageSize:10,
    activeApplication: null, //选中项目
    isEditApiModalVisible: false, 
    industryList:[]//行业列表
  },
  effects: {
    // 获取项目列表
    *getProjectList(params = {}) {
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      const res = yield getProjectManageListService(options);
      this.setProjectList(res);
    },
    // 新增项目
    *saveProject(params = {}, callback) {
      const res = yield saveProjectService(params);
      callback && callback(res);
    },
    // 编辑项目
    *changeProject(id,params = {}, callback) {
      const res = yield changeProjectService(id,params);
      callback && callback(res);
    },
    // 删除项目
    *deleteProject(params = {}, callback) {
      const res = yield deleteProjectService(params);
      callback && callback(res);
    },
    // 新增行业
    *addNewIndustrys(params,callback) {
      const res = yield addNewIndustry(params);
      callback && callback(res);
    },
     // 行业列表
     *getIndustrysList(callback) {
      const res = yield industryList();
      this.setIndustryList(res);
    },
  },
  reducers: {
    setIndustryList(res){
      this.industryList = res.data.list;
    },
    setProjectList(res) {
      this.projectList = res.data.list;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setCurPage(page){
      this.curPage=page;
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
    openEditApiModal(project) {
      this.activeApplication = _.clone(project);
      this.isEditApiModalVisible = true;
    },
    openProjectPage(project) {
      this.activeApplication = _.clone(project);
      sessionStorage.setItem('activeApplication',JSON.stringify(project));
    },
    closeEditApiModal() {
      this.activeApplication = null;
      this.isEditApiModalVisible = false;
    },
  },
};

export default toMobx(model);