import { fetchGet } from "@/utils/request";
import API from "@/services/api";
// 获取数据源列表
export const getDataSourceListService = (options) => {
  return fetchGet(API.GET_DATA_MANAGE_LIST, { params: options });
};
