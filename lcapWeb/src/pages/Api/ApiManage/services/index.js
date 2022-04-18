import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";
// 获取项目列表
export const getProjectManageListService = (options) => {
  return fetchGet(API.GET_PROJECT_MANAGELIST_API, { params: options });
};
// 新增项目
export const saveProjectService = (options) => {
  return fetchPost(API.SAVE_PROJECT_API, { body: options });
};
// 编辑项目
export const changeProjectService = (id,options) => {
  return fetchPut(API.CHANGE_PROJECT_API+id, { body: options });
};
// 删除项目
export const deleteProjectService = (options) => {
  return fetchDelete(API.DETLETE_PROJECT_API+options.id);
};
// 新增行业
export const addNewIndustry = (options) => {
  return fetchPost(API.ADD_INDUSTRY,{ body: options });
};
// 行业列表
export const industryList = () => {
  return fetchGet(API.INDUSTRY_LIST);
};
export const getUserInfoService = (param)=>{
  return fetchGet(API.GET_USERINFO);
};