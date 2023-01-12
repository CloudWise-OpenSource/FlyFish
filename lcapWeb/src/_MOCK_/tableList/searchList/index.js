import { mockInstance } from '@chaoswise/request';
import { demoListData } from './demoListConfig';

mockInstance.onGet("/get/searchtablelist", {

}).reply((config) => {
  let filterData = demoListData;
  let resultData = [];
  let totalNum = 0;

  let curPage = config.params.curPage;
  let pageSize = config.params.pageSize;
  let searchInfo = config.params.searchInfo ? config.params.searchInfo : {};
  let name = searchInfo.name ? searchInfo.name : '';
  let roles = searchInfo.roles ? searchInfo.roles : '';
  let email = searchInfo.email ? searchInfo.email : '';
  // 根据高级查询参数过滤数据
  filterData = filterData.filter(item => {
    return (!name || item.name && item.name.indexOf(name) != -1) &&
      (!roles || item.roles && item.roles.indexOf(roles) != -1) &&
      (!email || item.email && item.email.indexOf(email) != -1);
  });

  totalNum = filterData.length;
  resultData = filterData.slice((curPage) * pageSize, curPage * pageSize);

  return [200, {
    data: resultData,
    total: totalNum
  }];
});