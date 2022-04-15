import { toMobx } from '@chaoswise/cw-mobx';
import { getUserListService, getMenuService, getSelectRoleData,changeRole, saveRoleMenu, addNewRole, saveRoleAuth, deleteOneRole, roleDetail } from "../services";
import { getUsertManageListService } from "../../UserManage/services";

import _ from "lodash";
import { message } from 'antd';

const model = {
  // 唯一命名空间
  namespace: "RoleList",
  // 状态
  state: {
    searchParams: {},
    projectList: [],
    total: 0,
    activeProject: null,
    activeUser: null,
    isEditRoleModalVisible: false,
    isRoleModalVisible: false,
    isRoleJurisdictionModalVisible: false,
    deleteId: null,
    curPage: 0,
    pageSize: 10,
    menuList: [],//菜单列表
    roleMenu:[],
    oneRoleDetail: [], //单个角色详情
    userList: [],//角色列表需要的所有用户信息
    oneRoleMenu: []
  },
  effects: {
    // 获取所有用户信息
    *getAllUserList(params = {}) {
      // 处理参数
      let options = {
        curPage: 0,
        pageSize: 100
      };
      // 请求数据
      const res = yield getUsertManageListService(options);
      this.setUserList(res);
    },
    // 获取项目列表数据
    *getUserList(params = {}) {
      // 处理参数
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      // 请求数据
      const res = yield getUserListService(options);
      this.setProjectList(res);
    },
    *saveProject(params = {}, callback) {
      // 测试代码
      const res = yield changeRole(params);
      callback && callback(res);
    },
    * changeRole(id, params = {}, callback) {
      const res = yield changeRole(id, params);
      callback && callback(res);
    },
    * addNewRole(params = {}, callback) {
      const res = yield addNewRole(params);
      callback && callback(res);
    },
    * deleteRole(params = {}, callback) {
      const res = yield deleteOneRole(params);
      callback && callback(res);
    },
    // 获取角色详情
    *getRoleDetail(id) {
      const res = yield roleDetail(id);
      this.setUserDetail(res);
    },
    // 修改角色权限
    * changeRoleAuth(id, params = {}, callback) {
      const res = yield saveRoleAuth(id, params);
      callback && callback(res);
    },
    // 获取所有菜单
    * getAllMenuList() {
      const res = yield getMenuService();
      this.setMenuList(res);
    },
    //修改角色菜单
    * changeRoleMenu(id, params = {}, callback) {
      const res = yield saveRoleMenu(id, params);
      callback && callback(res);
    },
     //获取角色下拉框
     * getRoleMenu() {
     const res = yield getSelectRoleData();
     this.setRoleMenuList(res.data);
   }
  },
  reducers: {
    setMenuList(res) {
      this.menuList = res.data;
    },
    setUserMenu(res) {
      this.oneRoleMenu = res.data.menus;
    },
    setRoleMenuList(res){
      this.roleMenu=res;
    },
    setUserDetail(res) {

      this.oneRoleDetail = res.data.members.map(item => item.id);
    },
    setUserList(res) {
      this.userList = res.data.list;
    },
    setProjectList(res) {
      this.projectList = res.data.list;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
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
    openEditRoleModal(project) {
      this.activeProject = _.clone(project);
      this.isEditRoleModalVisible = true;
    },
    openRoleJurisdictionModal(project) {
      this.activeUser = _.clone(project);
      this.isRoleJurisdictionModalVisible = true;
    },
    closeRoleJurisdictionModal() {
      this.activeUser = null;
      this.isRoleJurisdictionModalVisible = false;
    },
    openRoleModal(project) {
      this.activeUser = _.clone(project);
      this.isRoleModalVisible = true;
    },
    closeRoleModal() {
      this.activeUser = null;
      this.isRoleModalVisible = false;
    },
    closeEditRoleModal() {
      this.activeProject = null;
      this.isEditRoleModalVisible = false;
    },
    deleteOne(id) {
      this.deleteId = id;
      message.success('删除成功');
    }
  },
};

export default toMobx(model);