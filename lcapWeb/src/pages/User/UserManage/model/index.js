import { toMobx } from '@chaoswise/cw-mobx';
import { getUsertManageListService, changeUserInformation ,addUserInformation} from "../services";
import _ from "lodash";
import { message } from '@chaoswise/ui';

const model = {
  // 唯一命名空间
  namespace: "UserList",
  // 状态
  state: {
    searchParams: {},
    projectList: [],
    total: 0,
    activeUser: null,
    isEditProjectModalVisible: false,
    deleteId:null,
    curPage:1,
    pageSize:10,
    addOrChange:null
  },
  effects: {
    
    // 获取项目列表数据
    *getProjectList(params = {}) {
      // 处理参数
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      // 请求数据
      const res = yield getUsertManageListService(options);
      this.setProjectList(res);
    },
    *saveUser(id,params = {},callback) {
      // 测试代码
      const res = yield changeUserInformation(id,params);
      callback && callback(res);
    },
    *addUser(params = {},callback) {
      // 测试代码
      const res = yield addUserInformation(params);
      callback && callback(res);
    },
  },
  reducers: {
    setProjectList(res) {
      this.projectList = res.data.list;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setSearchParams(searchParams) {
      let sendParams = {};
      for(let i in searchParams){
        if(searchParams[i]){
          sendParams[i] = searchParams[i];
        }
      }
      this.searchParams = sendParams || {};
    },
    openEditProjectModal(project,flag) {
      this.activeUser = _.clone(project);
      this.addOrChange=flag;
      this.isEditProjectModalVisible = true;
    },
    closeEditProjectModal() {
      this.activeUser = null;
      this.isEditProjectModalVisible = false;
    },
    deleteOne(id){
      this.deleteId=id;
      message.success('删除成功');
    }
  },
};

export default toMobx(model);