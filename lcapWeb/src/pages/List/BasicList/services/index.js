import { fetchGet } from '@/utils/request';

// 获取基础列表数据
export const getBasicTableListApi = (options) => {
  return fetchGet('/get/basictablelist', { params: options });
};
