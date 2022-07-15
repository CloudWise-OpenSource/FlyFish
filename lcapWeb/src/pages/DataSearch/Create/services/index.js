import { fetchPost } from "@/utils/request";
import API from "@/services/api";
// 新建数据查询
export const createDataSearchService = (options) => {
  return fetchPost(API.CREATE_DATA_SEARCH, { body: options });
};
