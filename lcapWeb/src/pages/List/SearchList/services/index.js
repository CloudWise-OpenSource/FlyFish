import { fetchGet } from '@/utils/request';

// 获取搜索列表数据
export const getSearchTableListApi = (options) => {
  return fetchGet('/get/searchtablelist', { params: options });
};