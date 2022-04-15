import { toMobx } from '@chaoswise/cw-mobx';
import { reqApplicationList, deleteApplication, exportApplication, copyApplication, reqTagsList, addApplication, changeApplication, reqProjectList } from "../services";
import _ from "lodash";

const model = {
  // 唯一命名空间
  namespace: "ApplyDevelop",
  // 状态
  state: {
    searchParams: {},
    applicationList: [],
    projectList: [],
    tagList: [],
    key: '',
    total: 0,
    totalDelete:0,
    curPage: 0,
    deleteCurPage:0,
    pageSize: 15,
    applicationListDelete:{},
    activeCard: {},
    activeProject: null,
    isAddModalVisible: false,
    isDeleteApplyListModalVisible: false,
  },
  effects: {
    *getApplicationList(params = {}) {
      let options = {
        type: this.key || '2D',
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      const res = yield reqApplicationList(options);
      this.setApplicationList(res);
    },
    *getApplicationListDelete(params = {}) {
      let options = {
        type: this.key || '2D',
        curPage: this.deleteCurPage,
        pageSize: 10,
        ...params,
      };
      const res = yield reqApplicationList(options);
      this.setApplicationListDelete(res);
    },
    *getProjectList() {
      const res = yield reqProjectList();
      this.setProjectList(res);
    },
    *getTagsList() {
      const res = yield reqTagsList({ type: 'application' });
      this.setTagList(res);
    },
    *addApplicationOne(params = {}, callback) {
      const res = yield addApplication(params);
      callback && callback(res);
    },
    *changeApplicationOne(id, params = {}, callback) {
      const res = yield changeApplication(id, params);
      callback && callback(res);
    },
    *deleteApplicationOne(id, callback) {
      const res = yield deleteApplication(id);
      callback && callback(res);
    },
    *copyApplicationOne(id,option, callback) {
      const res = yield copyApplication(id,option);
      callback && callback(res);
    },
    *exportApplicationOne(id, callback) {
      const res = yield exportApplication(id);
      callback && callback(res);
    },
  },
  reducers: {
    setPageSize(page){
      this.pageSize=page;
    },
    setActiveCard(item) {
      if (item) {
        this.activeCard = {
          ...item,
          projects: item.projects.id,
          tags: item.tags.map(item => item.name)
        };
      } else {
        this.activeCard = {};
      }
    },
    setProjectList(res) {
      this.projectList = res.data.list;
    },
    setTagList(res) {
      this.tagList = res.data;

    },
    setApplicationListDelete(res){
      this.applicationListDelete = res.data;
      this.totalDelete = res.data.total;
      this.deleteCurPage = res.data.curPage;
    },
    clearApplication(){
      this.applicationList=[];
    },
    setApplicationList(res = {}) {
      this.applicationList = res.data;
      this.total = res.data?.total;
      this.curPage = res.data?.curPage;
      this.pageSize = res.data?.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
    },
    openAddProjectModal(project) {
      this.activeProject = _.clone(project);
      this.isAddModalVisible = true;
    },
    openDeleteApplyListModal() {
      this.isDeleteApplyListModalVisible = true;
    },
    closeDeleteApplyListModal() {
      this.isDeleteApplyListModalVisible = false;
    },
    setType(str) {
      this.key = str;
    },
    closeAppProjectModal() {
      this.activeProject = null;
      this.isAddModalVisible = false;
    },
    setCurPage(res) {
      this.curPage = res;
    }
  },
};

export default toMobx(model);