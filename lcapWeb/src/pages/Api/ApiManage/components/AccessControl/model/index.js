/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:31:23
 */
import { toMobx, toJS } from '@chaoswise/cw-mobx';
import {
} from '../services';
import { message } from 'antd';
import { successCode } from "@/config/global";

const model = {
  // 唯一命名空间
  namespace: "accessControl",
  // 状态
  state: {
  },
  effects: {
  },
  reducers: {
  }
};

export default toMobx(model);