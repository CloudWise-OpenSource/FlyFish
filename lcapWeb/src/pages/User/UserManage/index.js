/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { CWTable, Input, Button, message, Select, Icon, Popconfirm } from "@chaoswise/ui";
const { Option } = Select;
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditProjectModal from "./components/EditUsertModal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { formatDate } from '@/config/global';

import { FormattedMessage, useIntl } from "react-intl";
const UserList = observer(() => {
  const intl = useIntl();
  const {
    getProjectList,
    setSearchParams,
    saveUser,
    addUser,
    openEditProjectModal,
    addOrChange,
    closeEditProjectModal,
  } = store;
  const { total, current, projectList, pageSize, isEditProjectModalVisible, activeUser } =
    store;
  const [saveOrChangeFlag, setSaveOrChangeFlag] = React.useState(false);

  const loading = loadingStore.loading["UserList/getProjectList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      disabled: true,
    },
    {
      title: "用户邮箱",
      dataIndex: "email",
      width:200,
      key: "email",
      disabled: true,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: '最近更新时间',
      dataIndex: 'updateTime',
      width:200,
      key: 'updateTime',
      render:(updateTime)=>{
        return formatDate(updateTime);
      }
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      render(createTime) {
        return formatDate(createTime);
      },
      width: 200
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render(status) {
        return <div style={status === 'valid' ? { color: '#52C41A' } : { color: 'red' }}>{status === 'valid' ? '正常' : '禁用'}</div>;
      }
    },
    {
      title: intl.formatMessage({
        id: "common.actions",
        defaultValue: "操作",
      }),
      dataIndex: "actions",
      key: "actions",
      render(text, record, index) {
        return (
          <span className={styles.projectActionList}>
            <a
              className={styles.projectAction}
              onClick={() => {
                setSaveOrChangeFlag(false);
                openEditProjectModal(record, 0);
              }}
            >
              <FormattedMessage id="common.edit" defaultValue="编辑" />
            </a>
            <Popconfirm title={record.status === 'valid' ? "确认禁用？" : '确认恢复?'} okText="确认" cancelText="取消" onConfirm={() => {
              let result = record.status === 'valid' ? { status: 'invalid' } : { status: 'valid' };
              saveUser(record.id, result, (res) => {
                if (res.code === 0) {
                  message.success(
                    record.status === 'valid' ? intl.formatMessage({
                      id: "common.disableSuccess",
                      defaultValue: "禁用成功！",
                    }) : intl.formatMessage({
                      id: "common.recoverySuccess",
                      defaultValue: "恢复成功！",
                    })
                  );
                  closeEditProjectModal();
                  getProjectList({
                    curPage: 0,
                  });
                } else {
                  message.error(
                    intl.formatMessage({
                      id: "common.disableError",
                      defaultValue: "禁用失败，请稍后重试！",
                    })
                  );
                }
              });
            }}>
              <a className={styles.projectAction} href='#'>
                <FormattedMessage id={record.status === 'valid' ? "common.disable" : 'common.recovery'} defaultValue={record.status === 'valid' ? '禁用' : '恢复'} />
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
          allowClear={true}
          id="username"
          key="username"
          name='用户名'
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.userManage.searchInputUsername",
            defaultValue: "输入用户名进行查询",
          })}
        />
      ),
    }, {
      components: (
        <Input
          allowClear={true}
          id="email"
          key="email"
          name='邮箱'
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.userManage.searchInputEmail",
            defaultValue: "输入邮箱进行查询",
          })}
        />
      ),
    }, {
      components: (
        <Select
          allowClear={true}
          id="status"
          key="status"
          name='状态'
          style={{ width: "180px" }}
          placeholder={intl.formatMessage({
            id: "pages.userManage.searchInputstate",
            defaultValue: "输入状态进行查询",
          })}
        >
          <Option value="valid">正常</Option>
          <Option value="invalid">禁用</Option>
        </Select>
      ),
    }
  ];
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  // 请求列表数据
  useEffect(() => {
    setSearchParams();
    getProjectList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getProjectList({ curPage: curPage - 1, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    getProjectList({
      curPage: 0,
      pageSize: 10
    });
  };

  return (
    <React.Fragment>
      <CWTable
        columns={columns}
        dataSource={basicTableListData}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{
          showTotal: true,
          total: total,
          current: current+1,
          pageSize: pageSize,
          defaultPageSize: 10,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          showSizeChanger: true
        }}
        searchBar={{
          onSearch: onSearch,
          extra: () => {
            return [
              <Button
                type="primary"
                key="create_project"
                onClick={() => {
                  setSaveOrChangeFlag(true);
                  openEditProjectModal({}, 1);
                }}
              >
                <FormattedMessage
                  id="pages.userManage.create"
                  defaultValue="用户"
                />
              </Button>,
            ];
          },
          showSearchCount: 6,
          searchContent: searchContent,
        }}
      ></CWTable>
      {isEditProjectModalVisible && (
        <EditProjectModal
          project={activeUser}
          flag={saveOrChangeFlag}
          onSave={(project) => {
            addUser(project, (res) => {
              if (res.code == successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.addSuccess",
                    defaultValue: "新增成功！",
                  })
                );
                closeEditProjectModal();
                getProjectList({
                  curPage: 0,
                });
              } else {
                message.error(res.msg || intl.formatMessage({
                  id: "common.addError",
                  defaultValue: "新增失败，请稍后重试！",
                })
                );
              }
            });
          }}
          onChange={(id, project) => {
            saveUser(id, project, (res) => {
              if (res.code == successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.changeSuccess",
                    defaultValue: "编辑成功！",
                  })
                );
                closeEditProjectModal();
                getProjectList({
                  curPage: 0,
                });
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.changeError",
                    defaultValue: "编辑失败，请稍后重试！",
                  })
                );
              }
            });
          }
          }
          onCancel={closeEditProjectModal}
        />
      )}
    </React.Fragment>
  );
});
export default UserList;
