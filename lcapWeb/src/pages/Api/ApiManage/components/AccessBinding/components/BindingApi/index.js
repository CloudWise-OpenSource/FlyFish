/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, DatePicker, Icon } from "@chaoswise/ui";
import { Table, Input, Radio } from 'antd';
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from './model';
import moment from 'moment';
import styles from './assets/style.less';
import { successCode } from "@/config/global";
import { useIntl } from "react-intl";
const AppProjectManage = observer(({ location, onCancel }) => {
  const intl = useIntl();
  const {
    getapiList,
    setSearchParams,
    setCurPage,
  } = store;
  const { total, searchParams, curPage, pageSize, apiList } =
    store;
  const loading = loadingStore.loading["bindingApi/getapiList"];
  // 表格列表数据
  let basicTableListData = toJS(apiList);
  // 表格列配置信息
  const columns = [
    {
      title: "API名称",
      dataIndex: "name",
      key: "name"
    },
  ];
  // 请求列表数据
  useEffect(() => {
    setSearchParams({});
    getapiList({ curPage: 0 });
  }, []);
  // useEffect(() => {
  //   setCurPage(0);
  //   getapiList();
  // }, [searchParams]);
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <Modal
      className='myModal'
      draggable
      okText='确认'
      title='绑定API'
      width={800}
      onCancel={() => { onCancel(); }}
      onOk={() => { console.log('看一下参数', searchParams); }}
      visible={true}
    >
      <span >
        <Input allowClear placeholder="按API名称搜索" style={{ width: '200px', marginBottom: '15px' }}
          suffix={<Icon type="search" />}
          onChange={e => setSearchParams({ name: e.target.value })} />
        <i style={{ color: 'red', margin: '0 5px 0 20px' }}>*</i>
        <span>授权有效期：</span>
        <Radio.Group onChange={(e) => { setSearchParams({ time: e.target.value }); }} value={searchParams.time} >
          <Radio value='long'>永久</Radio>
          <Radio value='short'>短期</Radio>
        </Radio.Group>
        {
          searchParams.time === 'short' && <DatePicker showTime
            defaultValue={moment(moment().format("YYYY-MM-DD HH:mm:ss"))}
            onChange={(date, dateString) => { setSearchParams({ dateString: dateString }); }}
          />
        }
      </span>
      <div className={styles.listWraper} >
        <Table columns={columns} scroll={{ y: 370 }}
          rowKey='id'
          rowSelection={rowSelection}
          dataSource={basicTableListData}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => {
              return `共${total}条记录`;
            },
            pageSize: pageSize,
            total: total || 0,
            current: curPage + 1,
            onShowSizeChange: (page, pageSize) => {
              setCurPage(0);
              getapiList({ pageSize: pageSize });
            },
            onChange: (current, size) => {
              setCurPage(current - 1);
              getapiList();
            }
          }}
        />
      </div>
    </Modal>
  );
});
export default AppProjectManage;
