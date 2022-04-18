/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-08 17:32:56
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-02-08 11:22:43
 */
import {
  fetchGet
} from '@/utils/request';

const baseUrl = window.LCAP_CONFIG.apiDomain;

export const getUserInfoService = ()=>{
  return fetchGet(`${baseUrl}/users/info`);
};