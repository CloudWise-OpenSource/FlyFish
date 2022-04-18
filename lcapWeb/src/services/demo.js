import {
  fetchGet
} from '@/utils/request';

// 获取多租户列表
export const getDemoApi = () => {
  return fetchGet('/get/list');
};

// 获取权限
export const getAuthApi = () => {
  return fetchGet('/get/auth');
};