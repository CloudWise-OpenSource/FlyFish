import React from 'react';
import { message, Button, CWTable, Input, FilterDropDown } from '@chaoswise/ui';
import { observer, loadingStore, toJS } from '@chaoswise/cw-mobx';
import store from '../model/index';

const SearchList = observer(() => {
  /** 
   * getNavigationTableList 获取列表数据方法
   * total                  表格数据总条数
   * curPage            当前页码
   * navigationListData     表格列表数据
   * loadingStore           loading状态监听
   * columns                表格列字段总集合
   * setColumns             处理表格列字段顺序
   * showColumns            初始表格展示列的字段集合
   * setShowColumns         处理 展示列 变化
   * tableColumns           表格正常显示的字段集合
   * getTableColumns        处理tableColumns的计算属性
   * selectItems            下拉筛选已选择字段集合
  */
  const { getNavigationTableList, getTableColumns } = store;
  const { total, curPage, navigationListData } = store;
  const { columns, setColumns } = store;
  const { showColumns, setShowColumns } = store;
  const loading = loadingStore.loading['navigationStore/getNavigationTableList'];
  let navigationTableListData = toJS(navigationListData);
  let tableColumns = toJS(getTableColumns);
  let selectItems = toJS(showColumns);
  // 顶部高级筛选搜索框内容配置
  const searchContent = [
    {
      components: <Input
        id='name'
        key='name'
        name='姓名'
        placeholder='请输入姓名'
      />,
    },
    {
      components: <Input
        id='roles'
        key='roles'
        name='角色'
        placeholder='请输入角色'
      />
    },
    {
      components: <Input
        id='email'
        key='email'
        name='邮箱'
        placeholder='请输入邮箱'
      />
    }
  ];
  // 高级查询搜索
  const onSearch = (searchFields) => {
    getNavigationTableList({
      searchInfo: searchFields,
      curPage:1,
    });
  };

  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getNavigationTableList({ curPage, pageSize });
  };
  // 下拉筛选列变化处理
  const changeColumns = (selectedColumns) => {
    setShowColumns(selectedColumns);
  };
  // 下拉筛选列拖拽处理
  const handleExchangeOptions = (dragIndex, hoverIndex) => {
    setColumns(dragIndex, hoverIndex);
  };
  const handleExport = () => {
    message.success('导出数据');
  };
  return (
    <CWTable
      columns={tableColumns}
      dataSource={navigationTableListData}
      rowKey={record => record.id}
      loading={loading}
      pagination={{
        showTotal: true,
        total: total,
        current: curPage,
        onChange: onPageChange,
        onShowSizeChange: onPageChange,
        showSizeChanger: true,
        showQuickJumper: true
      }}
      searchBar={{
        onSearch: onSearch,
        extra: () => {
          return [
            <Button key='export' onClick={handleExport}> 导出</Button>,
            <FilterDropDown
              key='filterDropDown'
              options={columns.map(item => {
                return {
                  id: item.dataIndex,
                  name: item.title,
                  disabled: item.disabled ? item.disabled : false
                };
              })}
              selectItems={selectItems}
              onChange={changeColumns}
              isDrag={true}
              handleExchangeOptions={handleExchangeOptions}
            >
            </FilterDropDown>
          ];
        },
        searchContent: searchContent
      }}
    >
    </CWTable>
  );
});
export default SearchList;