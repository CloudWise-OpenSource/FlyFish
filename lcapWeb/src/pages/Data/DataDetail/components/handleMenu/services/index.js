import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";
//左侧列表
export const reqTreeListServer = (options) => {
  return fetchGet(API.TREE_LIST, { params: options });
};

export const reqNewOutside = (options) => {
  return fetchPost(API.NEW_OUTSIDE,{ body: options });
};
//  修改一个表结构
export const reqChangeOutside = (options) => {
  return fetchPost(API.CHANGE_OUTSIDE,{ body: options });
};
//删除一个
export const reqDeleteOneServer = (options) => {
  return fetchPost(API.DELETE_OUTSIDE, { body: options });
};
