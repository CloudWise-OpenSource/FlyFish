/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-03 22:12:00
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-01-19 14:37:26
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
		menuNameArr:[]
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
				this.setUserInfo(res.data);
				callBack&&callBack(res.data);
			}
		},
	},

	reducers: {
		setMenuNameArr(res){
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
		}
	},

	computeds: {
		getDoubleNum() {
			return this.num * 2;
		}
	}

};

export default toMobx(globalStore);