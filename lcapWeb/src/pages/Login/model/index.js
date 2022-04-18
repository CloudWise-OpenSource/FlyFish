import { toMobx } from '@chaoswise/cw-mobx';
import { login,register} from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "AppProjectManage",
  // 状态
  state: {
    
  },
  effects: {
    *register(params = {}, callback) {
      // 测试代码
      const res = yield register(params);
      callback && callback(res);
    },
    *login(params = {}, callback) {
      // 测试代码
      const res = yield login(params);
      callback && callback(res);
    },
  },
  reducers: {
    setProjectList(res) {
      this.projectList = res.data;
      this.total = res.total;
      this.curPage = res.curPage;
      this.pageSize = res.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
    },
    openEditProjectModal(project) {
      this.activeProject = _.clone(project);
      this.isEditProjectModalVisible = true;
    },
  },
};

export default toMobx(model);