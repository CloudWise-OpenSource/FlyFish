import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";

//http查询
export const reqDataUsability = (options) => {
  return fetchPost(API.HTTP_LINK,{ body: options });
};
//  新增一个表结构
export const reqNewOutside = (options) => {
  return fetchPost(API.NEW_OUTSIDE,{ body: options });
};
//  修改一个表结构
export const reqChangeOutside = (options) => {
  return fetchPost(API.CHANGE_OUTSIDE,{ body: options });
};