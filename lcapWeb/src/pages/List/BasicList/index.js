/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { CWTable } from '@chaoswise/ui';
import { observer, loadingStore, toJS } from '@chaoswise/cw-mobx';
import { Link } from 'react-router-dom';
import store from './model/index';

const BasicList = observer(() => {
  /** 
   * getBasicTableList 获取列表数据方法
   * loadingStore      loading状态监听
   * total             表格数据总条数
   * basicListData     表格列表数据
   * columns           表格列配置信息
  */

  const { getBasicTableList } = store;
  const { total, basicListData } = store;
  const loading = loadingStore.loading['basicStore/getBasicTableList'];
  // 表格列表数据
  let basicTableListData = toJS(basicListData);
  // 表格列配置信息
  const columns = [
    {
      title: '用户名',
      dataIndex: 'userAlias',
      key: 'userAlias',
      disabled: true,
      render: function render(text) {
        return (
          <Link to={`/list/list-detail/${text}`}>
            {text}
          </Link>
        );
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      disabled: true
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 300
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
    }
  ];
  // 请求列表数据
  useEffect(() => {
    getBasicTableList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getBasicTableList({ curPage, pageSize });
  };

  return (
    <CWTable
      columns={columns}
      dataSource={basicTableListData}
      rowKey={record => record.id}
      loading={loading}
      pagination={{
        showTotal: true,
        total: total,
        onChange: onPageChange,
        onShowSizeChange: onPageChange,
        showSizeChanger: true,
        showQuickJumper: true
      }}
    >
    </CWTable>
  );
});
export default BasicList;