/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message, Popconfirm, Icon, Empty, Tooltip } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import { formatDate } from '@/config/global';

import EditProjectModal from "./components/EditProjectModal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from 'react-router-dom';
const AppProjectManage = observer((props) => {
  const intl = useIntl();
  const {
    getProjectList,
    setSearchParams,
    saveProject, changeProject, getIndustrysList,
    openEditProjectModal, openProjectPage, setCurPage,
    closeEditProjectModal, deleteProject
  } = store;
  const { total, industryList, curPage, pageSize, projectList, isEditProjectModalVisible, activeProject } =
    store;
  let [checkFlag, setCheckFlag] = useState(false);
  const loading = loadingStore.loading["AppProjectManage/getProjectList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      render(text, record) {
        return (
          <>
            <Tooltip title={text} placement="topLeft">
              <a
                className="TableTopTitle"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  goRoute(record);
                  openProjectPage(record);
                }}>{text}</a>
            </Tooltip>
          </>
        );

      },
    },
    {
      title: "行业",
      dataIndex: "trades",
      key: "trades",
      render(trades) {
        const str = trades.map(item=>item.name).join(',');
        return str?<div title={str} style={{ height:24,whiteSpace:'nowrap',overflow:'hidden',textOverflow:"ellipsis" }}>{str}</div>
        :<div title={str} style={{ height:24,whiteSpace:'nowrap',overflow:'hidden',textOverflow:"ellipsis" }}>-</div>;
      },
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      render(text){
        return(
          <>
            <Tooltip title={text} placement="topLeft">
              <div className="TableTopTitle">{text}</div>
            </Tooltip>
          </>
        );
      }
    },
    {
      title: "最新更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 170,
      render(updateTime) {
        return formatDate(updateTime);
      },
    },
    {
      title: "创建时间",
      width: 170,
      dataIndex: "createTime",
      key: "createTime",
      render(createTime) {
        return formatDate(createTime);
      },
    },
    {
      title: "创建人",
      dataIndex: "creatorName",
      key: "creatorName",
      width: 100,
    },
    {
      title: intl.formatMessage({
        id: "common.actions",
        defaultValue: "操作",
      }),
      dataIndex: "actions",
      key: "actions",
      width: 170,
      render(text, record, index) {
        return (
          <span className={styles.projectActionList}>
            <Link className={styles.projectAction}
              to={{}}
              onClick={() => {
                goRoute(record);
                openProjectPage(record);
              }}>
              <FormattedMessage
                id="pages.projectManage.goToProject"
                defaultValue="进入项目"
              />
            </Link>
            <a
              className={styles.projectAction}
              disabled={record?.from=='lcap-init'}
              onClick={() => {
                setCheckFlag(false);
                record.trades = record.trades.map(item => item.name);
                openEditProjectModal(record);
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
                  closeEditProjectModal();
                  getProjectList();
                } else {
                  message.error(
                    res.msg|| intl.formatMessage({
                      id: "common.deleteError",
                      defaultValue: "删除失败，请稍后重试！",
                    })
                  );
                }
              });
            }}>
              <a className={styles.projectAction} disabled={record?.from=='lcap-init'}>
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
          id="key"
          key="key"
          allowClear
          style={{ width: "300px" }}
          suffix={<Icon type="search" />
          }

          placeholder={intl.formatMessage({
            id: "pages.projectManage.searchInputPlaceholder",
            defaultValue: "输入项目名称/行业/描述进行查询",
          })}
        />
      ),
    },
  ];
  // 请求列表数据
  useEffect(() => {
    setSearchParams({});
    getProjectList({ curPage: 0 });
    getIndustrysList();
  }, []);
  const goRoute = (item) => {
    props.history.push({pathname:`/app/${item.id}/project-detail`,search:`?name=${item.name}`});
  };
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getProjectList({ curPage: curPage - 1, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    setCurPage(0);
    getProjectList();
  };

  return (
    <React.Fragment>
      <CWTable
        columns={columns}
        dataSource={basicTableListData}
        rowKey={(record) => record.id}
        loading={loading}
        tableWapperClassName={styles.tableWapperStyle}
        pagination={{
          showTotal: true,
          total: total,
          current: curPage + 1,
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
                  openEditProjectModal({});
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
      {isEditProjectModalVisible && (
        <EditProjectModal
          flag={checkFlag}
          project={activeProject}
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
                closeEditProjectModal();
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
                closeEditProjectModal();
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
          onCancel={closeEditProjectModal}
        />
      )}
    </React.Fragment>
  );
});
export default AppProjectManage;
