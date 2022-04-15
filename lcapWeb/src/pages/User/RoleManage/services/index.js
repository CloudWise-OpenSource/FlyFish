import { fetchGet, fetchPost, fetchPut, fetchDelete } from "@/utils/request";
import API from "@/services/api";

export const getUserListService = (options) => {
  return fetchPost(API.GET_ROLE_MANAGELIST_API, { body: options });

};

export const changeRole = (id,options) => {
  return fetchPut(API.CHANGE_ROLE + id + '/' + 'basic', { body: options });

};
export const addNewRole = (options) => {
  return fetchPost(API.NEW_ROLE, { body: options });
};

export const deleteOneRole = (options) => {
  return fetchDelete(API.DELETE_ROLE + options.id, { body: options });
};
// 获取角色详情
export const roleDetail = (id) => {
  return fetchGet(API.ROLE_DETAIL + id);
};
// 保存角色权限
export const saveRoleAuth = (id,options) => {
  return fetchPut(API.ROLE_AUTH + id + '/' + 'members', { body: options });
};
// 保存角色菜单
export const saveRoleMenu = (id,options) => {
  return fetchPut(API.ROLE_AUTH + id + '/' + 'auth', { body: options });
};
// 获取全部菜单
export const getMenuService = () => {
  return fetchGet(API.MENU_LIST);
};
// 获取角色下拉框
export const getSelectRoleData = () => {
  return fetchGet(API.ROLE_AUTH + 'get-all');
};