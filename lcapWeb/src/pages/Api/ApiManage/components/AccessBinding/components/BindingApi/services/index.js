import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";
// 获取项目列表
export const getProjectManageListService = (options) => {
  return fetchGet(API.GET_PROJECT_MANAGELIST_API, { params: options });
};
