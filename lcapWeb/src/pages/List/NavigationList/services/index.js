import { fetchGet } from '@/utils/request';

// 获取导航树列表数据
export const getNavigationTableListApi = (options) => {
  return fetchGet('/get/navigationtablelist', { params: options });
};
// 获取导航树TreeData
export const getNavigationTreeApi = () => {
  return fetchGet('/get/treelist');
};