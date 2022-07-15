/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-02 14:29:43
 */
import { toMobx, toJS } from '@chaoswise/cw-mobx';
import {
  getTreeDataService,
  industryList,
  assemblyDetail,
  changeAssembly,
  getListDataService,
  getTagsService,
  deleteOneAssembly
} from '../services';
import { successCode } from "@/config/global";

const model = {
  // 唯一命名空间
  namespace: "ComponentDevelop",
  // 状态
  state: {
    detailShow: false,
    addModalvisible: false,
    treeData: null,
    listData: {},
    libraryListData: {},
    selectedData: {
      category: '',
      subCategory: ''
    },
    libraryOptions:{},//组件库中的serch内容
    searchName: '',
    searchKey: '',
    searchStatus: 'all',
    projectId: '',
    total: 0,
    curPage: 1,
    pageSize: 20,
    libraryLisCurPage: 1,
    hasMore: true,
    tagsList: [],
    industryList: [],//行业列表
    assemlyDetail: [],//组件详情
    isDrawerVisible: false,
    listLength: 0,
    libraryListLength: 0,
    viewId:null
  },
  effects: {
    *getTreeDataFirst() {
      const res = yield getTreeDataService();
      if (res && res.data) {
        const data = res.data;
        this.setTreeData(data);
        const first = toJS(data)[0];
        if (first) {
          this.setSelectedData({
            category: first.id,
            subCategory: ''
          });
        }
      }
    },
    *getListData(obj, state) {
      let curPage = this.curPage - 1;
      const pageSize = this.pageSize;
      const { category, subCategory } = toJS(this.selectedData);
      const searchName = this.searchName;
      const searchKey = this.searchKey;
      const searchStatus = this.searchStatus;
      const params = {
        projectId: this.projectId,
        name: searchName ? searchName : undefined,
        key: searchKey ? searchKey : undefined,
        developStatus: searchStatus !== 'all' ? searchStatus : undefined,
        category: category,
        subCategory: subCategory === '' ? undefined : subCategory,
        curPage: curPage,
        pageSize,
        ...obj
      };
      const res = yield getListDataService(params);
      this.setListData(res.data);
    },
    // 组件库列表数据
    *getLibraryListData(options, state) {
      const { category, subCategory } = toJS(this.selectedData);
      const params = {
        isLib: true,
        type: 'project',
        category: category,
        subCategory: subCategory === '' ? undefined : subCategory,
        pageSize: 20,
        curPage: this.libraryLisCurPage-1,
        ...options,
        ...this.libraryOptions
      };
      const res = yield getListDataService(params);
      this.setLibraryListData(res.data, state);
    },
    *deleteAssembly(params = {}, callback) {
      // 请求数据
      const res = yield deleteOneAssembly(params);
      callback && callback(res);
    },
    // 标签列表
    *getTagsList() {
      const res = yield getTagsService({ type: 'component' });
      this.setTagsList(res);
    },
    // 行业列表
    *getIndustrysList() {
      const res = yield industryList();
      this.setIndustryList(res);
    },
    // 修改组件归属
    *changeOneAssemly(id, params, callback) {
      const res = yield changeAssembly(id, params);
      callback && callback(res);
    },
    *getAssemlyDetail(id, callback) {
      const res = yield assemblyDetail(id);
      this.setAssemlyDetail(res);
    },
  },
  reducers: {
    setCardId(viewId){
      this.viewId=viewId;
    },
    setTagsList(res) {
      this.tagsList = res.data;
    },
    setProjectId(id) {
      this.projectId = id;
    },
    setLibraryOptions(res){
      this.libraryOptions=res;
    },
    setDrawerVisible(res) {
      this.isDrawerVisible = res;
    },
    setAssemlyDetail(res) {
      this.assemlyDetail = res.data;
    },
    setIndustryList(res) {
      this.industryList = res.data.list;
    },
    setLibraryListData(res, state) {
      if (state) {
        this.libraryListData = res;
      } else {
        this.libraryListData.list && this.libraryListData.list.push(...res.list);
      }
      let libraryListData = toJS(this.libraryListData.list);
      this.libraryListLength = libraryListData.length;
      if (this.libraryListLength >= res.total) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
    },
    setDetailShow(res) {
      this.detailShow = res;
    },
    setAddModalvisible(res) {
      this.addModalvisible = res;
    },
    setTreeData(res) {
      this.treeData = res;
    },
    setListData(res) {
      this.listData = res;
      this.total = res && res.total;
    },
    setCurPage(res) {
      this.curPage = res;
    },
    setLibraryLisCurPage(res){
      this.libraryLisCurPage=res;
    },
    addLibraryLisCurPage() {
      this.libraryLisCurPage = this.libraryLisCurPage += 1;

    },
    setHasMore(flag) {
      this.hasMore = flag;
    },
    setSelectedData(res) {
      this.selectedData = res;
    }
  }
};

export default toMobx(model);