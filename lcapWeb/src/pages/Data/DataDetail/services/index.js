import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";
// 查看某一个表的字段结构和样例数据
export const reqTableServer = (options) => {
  return fetchGet(API.TABLE_LIST,{ params: options });
};
//  新增一个表结构
export const reqNewOutside = (options) => {
  return fetchPost(API.NEW_OUTSIDE,{ body: options });
};
//获取详情
export const reqDetail = (options) => {
  return fetchGet(API.DETAIL,{ params: options });
};
