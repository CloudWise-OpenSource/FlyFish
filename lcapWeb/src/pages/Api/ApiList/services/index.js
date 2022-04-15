/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-06 18:18:09
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-12-23 10:41:03
 */
import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";
// 获取项目列表
export const getProjectManageListService = (options) => {
  return fetchGet(API.GET_PROJECT_MANAGELIST_API, { params: options });
};
export const getUserInfoService = (param)=>{
  // return fetchGet(API.GET_USERINFO+'/'+param.id);
  return fetchGet(API.GET_USERINFO);
};