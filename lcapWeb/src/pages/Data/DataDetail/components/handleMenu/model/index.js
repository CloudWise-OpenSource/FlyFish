import { toMobx } from '@chaoswise/cw-mobx';
import _ from "lodash";
import { reqTreeListServer,reqNewOutside,reqDeleteOneServer,reqChangeOutside } from '../services';
import { successCode } from "@/config/global";
import { message} from "@chaoswise/ui";

const model = {
  // 唯一命名空间
  namespace: "HandelMenuStore",
  // 状态
  state: {
    treeList: [],
    resetTreeList: [],//保存一下初始list值
    addCateName: '',//顶部输入框
    editName: '',//点击的item文字
    checkIndex: null,//点击的item的index
    showInput: false,//是否显示新增的input
    outsideName: '',//新增参数
  },
  effects: {
    // 获取左侧树
    *getTreeList(params = {}, callback) {
      const res = yield reqTreeListServer(params);
      this.setTreeList(res.data);
      if (res.data&&res.data.length > 0) {
       this.resetTreeList=res.data;
        this.checkIndex=0;
        this.editName=res.data[0].tableName;
      } else {
        this.setTreeList([]);
        this.checkIndex = null;
        this.resetTreeList = [];
      }
      if(res.code!==successCode){
        message.error(res.msg||'获取数据表列表失败,请重试！');
      }
      callback && callback(res.data);
    },
     // 新增后获取左侧树
     *addGetTreeList(params = {}, callback,flag) {
      const res = yield reqTreeListServer(params);
      this.setTreeList(res.data);
      if (res.data&&res.data.length > 0) {
       this.resetTreeList=res.data;
        if(!flag){
          this.checkIndex=res.data.length-1;
        }
      } else {
        this.setTreeList([]);
        this.checkIndex = null;
        this.resetTreeList = [];
      }
      if(res.code!==successCode){
        message.error(res.msg||'获取数据表列表失败,请重试！');
      }
      callback && callback(res.data);
    },
    // 新增表结构
    *newOutside(params, callback) {
      const res = yield reqNewOutside(params);
      callback && callback(res);
    },
    // 修改表结构
    *changeOutside(params, callback) {
      const res = yield reqChangeOutside(params);
      callback && callback(res);
    },
     //删除一个
     *deleteOne(params = {}, callback) {
      const res = yield reqDeleteOneServer(params);
      callback && callback(res);
    },
  },
  
  reducers: {
    setTreeList(res) {
      this.treeList = res;
    },
    setAddCateName(str) {
      this.addCateName = str;
    },
    setEditName(editName) {
      this.editName = editName;
    },
    setCheckIndex(index) {
      this.checkIndex = index;
    },
    setShowInput(flag) {
      this.showInput = flag;
    },
    setOutsideName(outsideName) {
      this.outsideName = outsideName;
    }
  },
};

export default toMobx(model);