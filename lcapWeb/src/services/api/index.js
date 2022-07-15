/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-07-14 11:21:42
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-07-14 17:41:13
 */
import app from "./app";
import user from './user';
import rule from './role';
import data from './data';
import dataSearch from "./dataSearch";
export default {
  ...app,
  ...user,
  ...rule,
  ...data,
  ...dataSearch
};