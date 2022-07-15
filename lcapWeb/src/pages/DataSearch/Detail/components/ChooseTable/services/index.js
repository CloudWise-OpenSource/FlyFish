import { fetchGet } from "@/utils/request";
import API from "@/services/api";
// 获取数据源列表
export const getTableListService = (options) => {
  return fetchGet(API.TREE_LIST, {
    params: {
      ...options,
      pageSize: 1000,
    },
  });
};
