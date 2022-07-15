import { fetchPost } from '@/utils/request';
import API from '@/services/api';
// 获取数据源列表
export const getQueryDataListService = (options) => {
  return fetchPost(API.GET_VALID_SQL_QUERY_DATA_LIST, {
    body: options,
  });
};

export const getComponentListService = () => {
  const params = {
    type: 'common',
    allowDataSearch: 1,
  };

  return fetchPost(API.GET_COMPONENT_LIST, {
    body: Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
      })
      .join('&'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
  });
};
