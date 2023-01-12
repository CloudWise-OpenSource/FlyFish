/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-12-08 17:32:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-28 18:08:55
 */
import { fetchGet } from '@/utils/request';
import API from '@/services/api';

export const getUserInfoService = () => {
  const id = localStorage.getItem('id');
  return fetchGet(API.GET_USERINFO + '?id=' + id);
};
