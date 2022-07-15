import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";
// 获取数据源列表
export const getDataManegeList = (options) => {
  return fetchGet(API.GET_DATA_MANAGE_LIST, { params: options });
};
// 编辑项目
export const changeDataService = (options) => {
  return fetchPost(API.CHANGE_DATA,{ body: options });
};
// 删除项目
export const deleteDataService = (options) => {
  return fetchPost(API.DELETE_DATA+"/"+options.datasourceId);
};
//获取详情
export const reqDetail = (options) => {
  return fetchGet(API.DETAIL,{ params: options });
};
