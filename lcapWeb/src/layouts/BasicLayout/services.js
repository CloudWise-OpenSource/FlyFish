/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-12 18:44:17
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-09-14 16:16:26
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
export const getNodeVersionService = ()=>{
  return fetchGet(API.GET_VERSION_NODE);
};
export const getDevVersionService = ()=>{
  return fetchGet(API.GET_VERSION_JAVA);
};
export const getApimServerVersionService = ()=>{
  return fetchGet(API.GET_VERSION_APIMSERVER);
};

