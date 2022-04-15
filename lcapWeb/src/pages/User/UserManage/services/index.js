import { fetchGet, fetchPost ,fetchPut} from "@/utils/request";
import API from "@/services/api";

//获取用户列表  
export const getUsertManageListService = (options) => {
  return fetchPost(API.GET_USER_MANAGELIST_API, { body: options });
};
// 新增用户信息
export const addUserInformation = (options) => {
  return fetchPost(API.REGISTER, { body: options });
};
// 修改用户信息
export const changeUserInformation = (id,options) => {
  return fetchPut(API.CHANGE_USER+id, { body: options });
};

