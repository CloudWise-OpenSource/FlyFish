/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-08 17:32:56
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-06-02 16:38:38
 */
import {
  fetchGet
} from '@/utils/request';
import API from "@/services/api";


export const getUserInfoService = ()=>{
  return fetchGet(API.GET_USERINFO);
};