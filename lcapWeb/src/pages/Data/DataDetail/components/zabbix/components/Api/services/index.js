import { fetchGet, fetchPost } from "@/utils/request";
import API from "@/services/api";

//连接测试
export const reqTestQuery = (options) => {
  return fetchPost(API.ZABBIX_QUERY,{ body: options });
};
//  修改一个表结构
export const reqChangeOutside = (options) => {
  return fetchPost(API.CHANGE_OUTSIDE,{ body: options });
};
