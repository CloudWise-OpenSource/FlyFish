import { toMobx, toJS } from '@chaoswise/cw-mobx';
import {
  getTreeDataService,
  getListDataService,
  assemblyDetail,
  getTagsService,
  industryList
} from '../services';

const model = {
  // 唯一命名空间
  namespace: "LibraryTemplate",
  // 状态
  state: {
    treeData: [],
    listData: {},
    selectedData: {
      category: '全部组件',
      subCategory: ''
    },
    selectedOptions:{},
    total: 0,
    curPage: 1,
    pageSize: 12,
    searchName: '',
    searchKey: '',
    hasMore: true,
    searchStatus: 'all',
    tagsData: [],
    industryList: [],
    isDrawerVisible: false,
    assemlyDetail: [], listLength: 0

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
    *getTagsData() {
      const res = yield getTagsService({ type: 'component' });
      if (res && res.data) {
        this.setTagsData(res.data);
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
        name: searchName ? searchName : undefined,
        key: searchKey ? searchKey : undefined,
        developStatus: searchStatus !== 'all' ? searchStatus : undefined,
        category: category,
        subCategory: subCategory === '' ? undefined : subCategory,
        curPage: curPage,
        pageSize,
        isLib: true,
        ...this.selectedOptions,
        ...obj
      };
      const res = yield getListDataService(params);
      this.setListData(res.data, state);
    },
    *getAssemlyDetail(id, callback) {
      const res = yield assemblyDetail(id);
      this.isDrawerVisible = true;
      this.setAssemlyDetail(res);
    },
    // 行业列表
    *getIndustrysList() {
      const res = yield industryList();
      this.setIndustryList(res);
    },
  },
  reducers: {
    setSelectedOptions(res){
      this.selectedOptions=res;
    },
    setIndustryList(res) {
      this.industryList = res.data.list;
    },
    setAssemlyDetail(res) {
      this.assemlyDetail = res.data;
    },
    setDrawerVisible(res) {
      this.isDrawerVisible = res;
    },
    setTreeData(res) {
      this.treeData = res;
    },
    setListData(res, state) {
      if (state) {
        this.listData = res;
      } else {
        this.listData.list && this.listData.list.push(...res.list);
      }
      this.listLength = this.listData && this.listData.list.length;
      this.total = res && res.total;
      if (this.listLength >= this.total) {
        this.hasMore = false;
      }else{
        this.hasMore = true;
      }
    },
    setHasMore(flag) {
      this.hasMore = flag;
    },
    setSelectedData(res) {
        this.selectedData = res;
 
    },
    setSearchName(res) {
      this.searchName = res;
    },
    setSearchKey(res) {
      this.searchKey = res;
    },
    setCurPage(res) {
      this.curPage = res;
    },
    addCurpage(){
      this.curPage = this.curPage+=1;
    },
    setSearchStatus(res) {
      this.searchStatus = res;
    },
    setTagsData(res) {
      this.tagsData = res;
    }
  }
};

export default toMobx(model);