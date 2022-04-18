/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message, Popconfirm, Icon, Empty, Tooltip } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import { formatDate } from '@/config/global';

import EditProjectModal from "./components/EditApiModal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
const AppProjectManage = observer((props) => {
  const intl = useIntl();
  const {
    getProjectList,
    setSearchParams, saveOneItem,
    saveProject, changeProject, getIndustrysList,
    openEditApiModal, openProjectPage, setCurPage,
    closeEditApiModal, deleteProject, accessControlService
  } = store;
  const { total, industryList, curPage, pageSize, projectList, isEditApiModalVisible, activeApplication } =
    store;
  let [checkFlag, setCheckFlag] = useState(false);
  const loading = loadingStore.loading["AppApiManage/getProjectList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "应用名称",
      dataIndex: "name",
      key: "name",
      render(text, record) {
        return (<span style={{ cursor: 'pointer' }} onClick={() => {
          goRoute(record.id);
          openProjectPage(record);
        }}>{text}</span>
        );
      },
    },
    {
      title: "appKey",
      dataIndex: "app_key",
      width: 200,
      key: "app_key"
    },
    {
      title: "创建人",
      dataIndex: "creatorName",
      key: "creatorName",
    },
    {
      title: "最近修改人",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "创建时间",
      width: 200,
      dataIndex: "add_time",
      key: "add_time",
      render(add_time) {
        return formatDate(add_time);
      },
    },
    {
      title: "最新修改时间",
      dataIndex: "up_time",
      key: "up_time",
      width: 200,
      render(up_time) {
        return formatDate(up_time);
      },
    },
    {
      title: intl.formatMessage({
        id: "common.actions",
        defaultValue: "操作",
      }),
      dataIndex: "actions",
      key: "actions",
      width: 250,
      fixed: 'right',
      render(text, record, index) {
        return (
          <span className={styles.projectActionList}>
            <a className={styles.projectAction}
              onClick={() => {
                saveOneItem(record);
                props.history.push({ pathname: `/api/api-control`, state: { name: record.name,id:record._id} });
              }}
            >
              <FormattedMessage id="common.visitCancle" defaultValue="访问控制" />
            </a>
            <a className={styles.projectAction}
              onClick={() => {
                props.history.push({ pathname: `/api/api-binding`, state: { name: record.name } });
              }}
            >
              <FormattedMessage id="common.bindingApi" defaultValue="绑定API" />
            </a>
            <a
              className={styles.projectAction}
              onClick={() => {
                setCheckFlag(false);
                record.trades = record.trades.map(item => item.name);
                openEditApiModal(record);
              }}
            >
              <FormattedMessage id="common.edit" defaultValue="编辑" />
            </a>
            <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
              deleteProject(record, (res) => {
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.deleteSuccess",
                      defaultValue: "删除成功！",
                    })
                  );
                  closeEditApiModal();
                  getProjectList();
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
          </span>
        );
      },
    },
  ];
  const searchContent = [
    {
      components: (
        <Input
          id="appName"
          key="appName"
          allowClear
          suffix={<Icon type="search" />
          }

          placeholder={intl.formatMessage({
            id: "pages.apiManage.searchInputName",
            defaultValue: "按名称搜索",
          })}
        />
      ),
    },
    {
      components: (
        <Input
          id="appKey"
          key="appKey"
          allowClear
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.apiManage.searchInputAppkey",
            defaultValue: "按appKey搜索",
          })}
        />
      ),
    },
  ];
  // 请求列表数据
  useEffect(() => {
    setSearchParams({});
    getProjectList();
    getIndustrysList();
  }, []);
  const goRoute = (id) => {
    props.history.push(`/app/${id}/project-detail`);
  };
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getProjectList({ curPage: curPage, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    setCurPage(1);
    getProjectList();
  };

  return (
    <React.Fragment>
      <CWTable
        columns={columns}
        dataSource={basicTableListData}
        rowKey={(record) => record._id}
        loading={loading}
        scroll={{ x: 1300 }}
        pagination={{
          showTotal: true,
          total: total,
          current: curPage,
          pageSize: pageSize,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          showSizeChanger: true
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
                  setCheckFlag(true);
                  openEditApiModal({});
                }}
              >
                <FormattedMessage
                  id="pages.apiManage.create"
                  defaultValue="新建"
                />
              </Button>,
            ];
          },
          searchContent: searchContent,
        }}
      ></CWTable>
      {isEditApiModalVisible && (
        <EditProjectModal
          flag={checkFlag}
          project={activeApplication}
          list={industryList}
          onSave={(project) => {
            saveProject(project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.addSuccess",
                    defaultValue: "新增成功！",
                  })
                );
                closeEditApiModal();
                getProjectList();
                getIndustrysList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.addError",
                    defaultValue: "新增失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          onChange={(id, project) => {
            changeProject(id, project, (res) => {

              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.changeSuccess",
                    defaultValue: "编辑成功！",
                  })
                );
                closeEditApiModal();
                getProjectList();
                getIndustrysList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.changeError",
                    defaultValue: "编辑失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          onCancel={closeEditApiModal}
        />
      )}
    </React.Fragment>
  );
});
export default AppProjectManage;
