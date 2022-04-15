/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-01-06 11:41:55
 */
import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api/component";
import APIAPP from '@/services/api/app';

export const getTreeDataService = () => {

  return fetchPost(API.GET_TREEDATA, { });
};

export const updateTreeDataService = (param)=>{
  return fetchPut(API.UPDATE_TREEDATA,{ body: param });
};
export const getListDataService = (param)=>{
  return fetchPost(API.GET_LISTDATA,{ body: param });
};
export const getProjectsService = (param)=>{
  return fetchGet(API.GET_PROJECTS,{ params: param });
};
export const getTagsService = (param)=>{
  return fetchGet(API.GET_TAGS,{ params: param });
};
export const addComponentService = (param)=>{
  return fetchPost(API.ADD_COMPONENT,{ body: param });
};
export const getUserInfoService = ()=>{
  return fetchGet(API.GET_USERINFO);
};
export const getDetailDataService = (param)=>{
  return fetchGet(API.GET_DETAILDATA+'/'+param.id);
};
export const editComponentService = (id,param)=>{
  return fetchPut(API.EDIT_COMPONENT+'/'+id,{ body:param });
};
export const copyComponentService = (id,name)=>{
  return fetchPost(API.COPY_COMPONENT+'/'+id,{ body:{name} });
};
export const deleteComponentService = (id)=>{
  return fetchDelete(API.DELETE_COMPONENT+'/'+id);
};
export const downloadComponentService = (id)=>{
  return fetchPost(API.DOWNLOAD_COMPONENT+'/'+id);
};
// 组件详情
export const assemblyDetail=(id)=>{
  return fetchGet(API.DELETE_ASSEMBLY+id);
};
// 行业列表
export const industryList=()=>{
  return fetchGet(APIAPP.INDUSTRY_LIST);
};