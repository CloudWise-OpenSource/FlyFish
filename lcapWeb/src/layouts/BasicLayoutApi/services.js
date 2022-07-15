/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-12 18:44:17
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-01-06 11:41:19
 */
import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";

// 获取项目列表 
 export const loginout = (callback) => {
    const res = fetchPost(API.LOGINOUT,{body:{id:localStorage.getItem('id')}});
    callback && callback(res);
};

export const getUserInfoService = ()=>{
  return fetchGet(API.GET_USERINFO);
};
export const getAuthMenuService = ()=>{
  return fetchGet(API.GET_USERMENU);
};