import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";
// 获取数据源列表
export const getDataSearchListService = (options) => {
  return fetchGet(API.GET_DATA_SEARCH_LIST, { params: options });
};

// 删除项目
export const deleteDataSearchService = (options) => {
  return fetchPost(API.DELETE_DATA_SEARCH + "/" + options.settingId);
};
