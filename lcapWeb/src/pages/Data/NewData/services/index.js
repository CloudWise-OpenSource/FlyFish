import { fetchGet, fetchPost,fetchPut,fetchDelete } from "@/utils/request";
import API from "@/services/api";
// 新增项目
export const saveDataService = (options) => {
  return fetchPost(API.SAVE_ONE_DATA, { body: options });
};
// 修改项目
export const changeDataService = (options) => {
  return fetchPost(API.CHANGE_ONE_DATA, { body: options });
};
//链接测试
export const lookDataUsability = (options) => {
  return fetchPost(API.DATA_USABILITY, { body: options });
};