import { toMobx } from '@chaoswise/cw-mobx';
import { getProjectManageListService, saveProjectService, deleteProjectService } from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "AccessBinding",
  // 状态
  state: {
    searchParams: {},
    projectList: [], //项目列表
    total: 0,
    curPage: 0,
    pageSize: 10,
    timeFlag:'long',//编辑有效期
    activeApi: null, //选中项目
    deactivateOrEnable: true,//是否停用
    timeOfValidityVisible: false,
    changeTime:'',
    isDeactivateProjectModalVisible: false,
    isAddModalVisible: false
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
    // 删除项目
    *deleteProject(params = {}, callback) {
      const res = yield deleteProjectService(params);
      callback && callback(res);
    },

  },
  reducers: {
    setTimeFlag(flag){
      this.timeFlag=flag;
    },
    setDeactivateOrEnable() {
      this.deactivateOrEnable = !this.deactivateOrEnable;
    },
    setProjectList(res) {
      this.projectList = res.data.list;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setCurPage(page) {
      this.curPage = page;
    },
    setChangeTime(time){
      this.changeTime=time;
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
    openTimeOfValidityModal(api){
      this.activeApi = _.clone(api);
      this.timeOfValidityVisible=true;
    },
   closeTimeOfValidityModal(){
      this.timeOfValidityVisible=false;
    },
    openDeactivateProjectModal(api) {
      this.activeApi = _.clone(api);
      this.isDeactivateProjectModalVisible = true;
    },
    openProjectPage(api) {
      this.activeApi = _.clone(api);
    },
    openisAddModalVisibleModal(flag) {
      this.isAddModalVisible = true;
    },
    closeisAddModalVisibleModal() {
      this.isAddModalVisible = false;
    },
    closeDeactivateProjectModal() {
      this.activeApi = null;
      this.isDeactivateProjectModalVisible = false;
    },
  },
};

export default toMobx(model);