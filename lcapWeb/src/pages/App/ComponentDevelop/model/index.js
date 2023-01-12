/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-12-12 15:10:00
 */
import { toMobx, toJS } from '@chaoswise/cw-mobx';
import {
  getTreeDataService,
  getListDataService,
  getProjectsService,
  getTagsService,
  getUserListService,
} from '../services';

const model = {
  // 唯一命名空间
  namespace: 'ComponentDevelop',
  // 状态
  state: {
    detailShow: false,
    showRecord: false,
    addModalvisible: false,
    editModalvisible: false,
    importModalvisible: false,
    releaseModalVisible: false,
    addFromSourcevisible: false,
    treeData: [],
    listData: {},
    selectedData: {
      // category: '',
      // subCategory: '',
    },
    searchName: '',
    searchKey: '',
    searchStatus: 'all',
    searchProject: undefined,
    searchType: 'all',
    viewId: '',
    editData: {},
    projectsData: [],
    tagsData: [],
    developing: false,
    developingData: null,
    total: 0,
    curPage: 1,
    pageSize: 10,
    creator: undefined,
    creatorId: '',
    userList: [],
    userTotal: 0,
    userCurPage: 1,
  },
  effects: {
    *getUserList(params) {
      const userPageSize = 5;
      // 请求数据
      const res = yield getUserListService({
        username: this.creator || '',
        curPage: this.userCurPage,
        pageSize: userPageSize,
        ...params,
      });
      if (res && res.code === 0) {
        this.setUserList(res.data.list);
        this.setUserTotal(res.data.total);
      } else {
        message.error(res.msg);
      }
    },
    *getTreeDataFirst() {
      // 请求数据
      const res = yield getTreeDataService();
      if (res && res.data) {
        const data = res.data;
        this.setTreeData(data);
        // const first = toJS(data)[0];
        // if (first) {
        //   this.setSelectedData({
        //     category: first.id,
        //     subCategory: '',
        //   });
        // }
      }
    },
    *getTreeData() {
      // 请求数据
      const res = yield getTreeDataService();
      this.setTreeData(res.data);
    },
    *getProjectsData() {
      const res = yield getProjectsService();
      if (res && res.data) {
        this.setProjectsData(res.data.list);
      }
    },
    *getTagsData() {
      const res = yield getTagsService({ type: 'component' });
      if (res && res.data) {
        this.setTagsData(res.data);
      }
    },
    *getListData() {
      const curPage = this.curPage;
      const pageSize = this.pageSize;
      const { category, subCategory } = toJS(this.selectedData);
      const searchName = this.searchName;
      const creator = this.creatorId || '';
      const searchKey = this.searchKey;
      const searchStatus = this.searchStatus;
      const searchProject = this.searchProject;
      const searchType = this.searchType;
      const params = {
        name: searchName ? searchName : undefined,
        creator: creator,
        key: searchKey ? searchKey : undefined,
        developStatus: searchStatus !== 'all' ? searchStatus : undefined,
        type: searchType === 'all' ? undefined : searchType,
        projectId: searchProject,
        category: category,
        subCategory: subCategory === '' ? undefined : subCategory,
        curPage: curPage,
        pageSize,
      };
      const res = yield getListDataService(params);
      this.setListData(res.data);
    },
  },
  reducers: {
    setCreatorId(res) {
      this.creatorId = res;
    },
    setUserCurPage(res) {
      this.userCurPage = res;
    },
    setUserList(res) {
      this.userList = res;
    },
    setUserTotal(res) {
      this.userTotal = res;
    },
    setDetailShow(res) {
      this.detailShow = res;
    },
    setAddModalvisible(res) {
      this.addModalvisible = res;
    },
    setEditModalvisible(res) {
      this.editModalvisible = res;
    },
    setImportModalvisible(res) {
      this.importModalvisible = res;
    },
    setTreeData(res) {
      this.treeData = res;
    },
    setListData(res) {
      this.listData = res;
    },
    setSelectedData(res) {
      this.selectedData = res;
    },
    setSearchName(res) {
      this.searchName = res;
    },
    setCreator(res) {
      this.creator = res;
    },
    setSearchKey(res) {
      this.searchKey = res;
    },
    setSearchStatus(res) {
      this.searchStatus = res;
    },
    setSearchProject(res) {
      this.searchProject = res;
    },
    setSearchType(res) {
      this.searchType = res;
    },
    setViewId(res) {
      this.viewId = res;
    },
    setEditData(res) {
      this.editData = res;
    },
    setProjectsData(res) {
      this.projectsData = res;
    },
    setTagsData(res) {
      this.tagsData = res;
    },
    setDeveloping(res) {
      this.developing = res;
    },
    setDevelopingData(res) {
      this.developingData = res;
    },
    setTotal(res) {
      this.total = res;
    },
    setPageSize(res) {
      this.pageSize = res;
    },
    setCurPage(res) {
      this.curPage = res;
    },
    setReleaseModalVisible(res) {
      this.releaseModalVisible = res;
    },
    setShowRecord(res) {
      this.showRecord = res;
    },
    setAddFromSourcevisible(res) {
      this.addFromSourcevisible = res;
    },
  },
};

export default toMobx(model);
