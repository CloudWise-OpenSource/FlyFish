import { mockInstance } from '@chaoswise/request';
import { demoListData, demoTreeData } from './demoListConfig';

mockInstance.onGet("/get/navigationtablelist", {

}).reply((config) => {
  let filterData = demoListData;
  let resultData = [];
  let totalNum = 0;

  let curPage = config.params.curPage;
  let pageSize = config.params.pageSize;
  let searchInfo = config.params.searchInfo;
  let name = searchInfo.name ? searchInfo.name : '';
  let roles = searchInfo.roles ? searchInfo.roles : '';
  let email = searchInfo.email ? searchInfo.email : '';

  let departmentKey = config.params.departmentKey ? config.params.departmentKey : "0";
  // 根据功能树节点过滤数据
  filterData = filterData.filter(item => item.departmentId == departmentKey);
  // 根据高级查询参数过滤数据
  filterData = filterData.filter(item => {
    return (!name || item.name && item.name.indexOf(name) != -1) &&
      (!roles || item.roles && item.roles.indexOf(roles) != -1) &&
      (!email || item.email && item.email.indexOf(email) != -1);
  });

  totalNum = filterData.length;
  // 根据分页截取过滤后的数据
  resultData = filterData.slice((curPage - 1) * pageSize, curPage * pageSize);

  return [200, {
    data: resultData,
    total: totalNum
  }];
});
mockInstance.onGet("/get/treelist", {

}).reply(() => {
  // 请求导航树数据
  let resultData = demoTreeData;
  return [200, {
    data: resultData
  }];
});