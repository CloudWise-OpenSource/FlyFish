/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message, Popconfirm, Icon, Empty, Tooltip } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import { formatDate } from '@/config/global';

import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import enums from '@/utils/enums.js';
const AppProjectManage = observer((props) => {
  const intl = useIntl();
  const {
    getDataList,
    setSearchParams, setCurPage,searchParams,
    deleteData
    
  } = store;
  const { total, pageNo, pageSize, DataList } =
    store;
  const loading = loadingStore.loading["AppProjectManage/getDataList"];
  // 表格列表数据
  let basicTableListData = toJS(DataList);
  // 表格列配置信息
  const columns = [
    {
      title: "数据源名称",
      dataIndex: "datasourceName",
      key: "datasourceName",
      render: (text, record) => {
        return (
          <>
            <Tooltip title={text} placement="topLeft">
              <a
                className="TableTopTitle"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  props.history.push({ pathname: `/data/${record.datasourceId}/data-detail`, 
                  search:`?name=${record.datasourceName}`});
                }}>{text}</a>
            </Tooltip>
          </>
          
        );
      }
    },
    {
      title: "数据源类型",
      dataIndex: "schemaType",
      key: "schemaType",
      render:(text)=> {
        return enums[text];
      },
    },
    {
      title: "数据库名称",
      dataIndex: "schemaName",
      key: "schemaName",
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render(updateTime) {
        return formatDate(updateTime);
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render(createTime) {
        return formatDate(createTime);
      },
    },
    {
      title: intl.formatMessage({
        id: "common.actions",
        defaultValue: "操作",
      }),
      dataIndex: "actions",
      key: "actions",
      fixed: 'right',
      width: 150,
      render(text, record, index) {
        return (
          <span className={styles.projectActionList}>
            {
              !record.deleted ? <>
                <a
                  className={styles.projectAction}
                  onClick={() => {
                    props.history.push({pathname:`/data/${record.datasourceId}/change-data`
                  });
                  }}
                >
                  <FormattedMessage id="common.edit" defaultValue="编辑" />
                </a>
                <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                  deleteData(record, (res) => {
                    if (res.code === successCode) {
                      getDataList({},(res)=>{
                        if(res.data&&res.data.length==0&&res.pageNo!=0){
                          getDataList({pageNo:1});
                        }
                      });
                      message.success(
                        intl.formatMessage({
                          id: "common.deleteSuccess",
                          defaultValue: "删除成功！",
                        })
                      );

                    } else {
                      message.error(
                        res.msg || intl.formatMessage({
                          id: "common.deleteError",
                          defaultValue: "删除失败，请稍后重试！",
                        })
                      );
                    }
                  });
                }}>
                  <a className={styles.projectAction}>
                    <FormattedMessage id="common.delete" defaultValue="删除" />
                  </a>
                </Popconfirm>
              </> : null
            }
          </span>
        );
      },
    },
  ];
  const searchContent = [
    {
      components: (
        <Input
          id="datasourceName"
          key="datasourceName"
          allowClear
          style={{ width: "300px" }}
          suffix={<Icon type="search" />
          }

          placeholder={intl.formatMessage({
            id: "pages.data.searchInputPlaceholder",
            defaultValue: "输入名称进行搜索",
          })}
        />
      ),
      formAttribute: { initialValue: searchParams.datasourceName || '' }
    },
  ];
  // 请求列表数据
  useEffect(() => {
    getDataList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getDataList({ pageNo: curPage , pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    setCurPage(1);
    getDataList();
  };

  return (
    <div className="allContainerPadding">
      <CWTable
        columns={columns}
        dataSource={basicTableListData}
        rowKey={(record) => record.datasourceId}
        loading={loading}
        pagination={{
          showTotal: true,
          total: Number(total),
          current: pageNo ,
          pageSize: pageSize,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          showSizeChanger: true,
          showQuickJumper: true
        }}
        locale={{
          emptyText: <Empty />,
        }}
        searchBar={{
          onSearch: onSearch,
          extra: () => {
            return [
              <Button
                type="primary"
                key="create_project"
                onClick={() => {
                  props.history.push('/data/new-data');
                }}
              >
                <FormattedMessage
                  id="pages.projectManage.create"
                  defaultValue="添加项目"
                />
              </Button>,
            ];
          },
          searchContent: searchContent,
        }}
      ></CWTable>

    </div>
  );
});
export default AppProjectManage;

