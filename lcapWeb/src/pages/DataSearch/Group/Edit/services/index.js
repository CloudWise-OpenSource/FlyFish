import { fetchPost, fetchGet } from "@/utils/request";
import API from "@/services/api";

// 新建数据查询
export const editDataSearchService = (options) => {
  return fetchPost(API.EDIT_DATA_SEARCH, { body: options });
};

export const getDataSearchService = (id) => {
  return fetchGet(`${API.GET_DATA_SEARCH}/${id}`);
};