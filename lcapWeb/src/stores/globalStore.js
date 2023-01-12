/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-03 22:12:00
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-29 09:58:59
 */

import { getDemoApi } from '@/services/demo';
import { toMobx } from '@chaoswise/cw-mobx';
import { getUserInfoService } from '../services/global';

const globalStore = {
  namespace: 'globalStore',

  state: {
    num: 0,
    auth: {},
    currentRoute: {}, // 当前路由的配置信息
    userInfo: null,
    menuNameArr: [],
    progressNum: 0, //批量导出进度
  },

  effects: {
    *addNumSync() {
      const res = yield getDemoApi();
      if (!res) return;
      this.num = res.data;
      this.addNum();
    },
    *getUserInfo(callBack) {
      const res = yield getUserInfoService();
      if (res && res.data) {
        localStorage.setItem('username', res.data.username);
        localStorage.setItem('isAdmin', res.data.isAdmin);
        const userInfo = {
          authResults: res.data.menus,
          iuser: {
            id: res.data.id,
            name: res.data.username,
            isAdmin: res.data.isAdmin,
          },
        };
        this.setUserInfo(userInfo);
        callBack && callBack(userInfo);
      }
    },
  },

  reducers: {
    setMenuNameArr(res) {
      this.menuNameArr = res;
    },

    addNum() {
      this.num = this.num + 100;
    },
    updateAuth(auth) {
      this.auth = auth;
    },
    updateCurrentRoute(route) {
      this.currentRoute = route;
    },
    setUserInfo(res) {
      this.userInfo = res;
    },
    setExportSuccess(res) {
      this.exportSuccess = res;
    },
    setProgressNum(res) {
      this.progressNum = res;
    },
  },

  computeds: {
    getDoubleNum() {
      return this.num * 2;
    },
  },
};

export default toMobx(globalStore);
