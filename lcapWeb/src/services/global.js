/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-08 17:32:56
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-07-15 16:11:44
 */
import {
  fetchGet
} from '@/utils/request';
import API from "@/services/api";


export const getUserInfoService = ()=>{
  const id = localStorage.getItem('id');
  return fetchGet(API.GET_USERINFO+'?id='+id);
};

export const getDoucUserInfoService = ()=>{
  return fetchGet(API.GET_USERINFO_DOUC);
};