/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-12-24 16:15:32
 */
import { toMobx, toJS } from "@chaoswise/cw-mobx";

import {
  getTreeDataService,
  getUserInfoService,
  getProjectsService,
  getTagsService,
} from "@/pages/App/ComponentDevelop/services";

const model = {
  // 唯一命名空间
  namespace: "ComponentDevelopClone",
  // 状态
  state: {
    userInfo: {},
    treeData: [],
    projectsData: [],
    tagsData: [],
  },
  effects: {
    *getUserInfo() {
      const res = yield getUserInfoService();
      if (res && res.data) {
        this.setUserInfo(res.data);
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
      const res = yield getTagsService({ type: "component" });
      if (res && res.data) {
        this.setTagsData(res.data);
      }
    },
  },
  reducers: {
    setTreeData(res) {
      this.treeData = res;
    },
    setProjectsData(res) {
      this.projectsData = res;
    },
    setTagsData(res) {
      this.tagsData = res;
    },
    setUserInfo(res) {
      this.userInfo = res;
    },
  },
};

export default toMobx(model);
