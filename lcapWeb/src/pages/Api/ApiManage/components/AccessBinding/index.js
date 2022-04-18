/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, Radio, DatePicker, message, Popconfirm, Modal, Select, Icon, Card, Empty, Tooltip } from "@chaoswise/ui";
const { Option } = Select;
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import { formatDate } from '@/config/global';
import moment from 'moment';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import DeactivateModal from './components/Modal';
import AddApiModal from "./components/BindingApi";
import { FormattedMessage, useIntl } from "react-intl";
const AppProjectManage = observer((props) => {
  const intl = useIntl();
  const {
    getProjectList, openTimeOfValidityModal,
    closeTimeOfValidityModal,setChangeTime,
    setSearchParams, openisAddModalVisibleModal, closeisAddModalVisibleModal,
    saveProject, changeProject, getIndustrysList, setTimeFlag,
    openDeactivateProjectModal, openProjectPage, setCurPage, setDeactivateOrEnable,
    closeDeactivateProjectModal
  } = store;
  const { total, timeFlag, isAddModalVisible, timeOfValidityVisible, curPage, pageSize, deactivateOrEnable, projectList, isDeactivateProjectModalVisible, activeApi } =
    store;
  const loading = loadingStore.loading["AccessBinding/getProjectList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "API名称",
      dataIndex: "name",
      key: "name",
      render(text, record) {
        return (<span style={{ cursor: 'pointer' }} onClick={() => {
          goRoute(record);
          openProjectPage(record);
        }}>{text}</span>
        );
      },
    },
    {
      title: "有效期",
      dataIndex: "status",
      key: "status"
    },
    {
      title: intl.formatMessage({
        id: "common.actions",
        defaultValue: "操作",
      }),
      dataIndex: "actions",
      key: "actions",
      width: 200,
      render(text, record, index) {
        return (
          <span className={styles.projectActionList}>
            <a className={styles.projectAction} onClick={() => { openDeactivateProjectModal(record); setDeactivateOrEnable(); }}>
              <FormattedMessage id="common.deactivate" defaultValue="停用" />
            </a>
            <a className={styles.projectAction} style={{ margin: '0 10px' }}
              onClick={() => { openTimeOfValidityModal(record); }}
            >
              <FormattedMessage id="pages.apiManage.changeTime" defaultValue="编辑有效期" />
            </a>
            <Popconfirm
              title='确定删除?'
              onConfirm={() => {
                console.log('删除', record.id);
              }}
              okText="确认"
              cancelText="取消"
            >
              <a className={styles.projectAction} >
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
        <Select id="time"
          allowClear
          placeholder={intl.formatMessage({
            id: "pages.apiManage.searchInputTime",
            defaultValue: "按有效期搜索",
          })}
          key="time" style={{ width: 200 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      ),
    },
  ];
  // 请求列表数据
  useEffect(() => {
    setSearchParams({});
    getProjectList({ curPage: 0 });
  }, []);
  const goRoute = (item) => {
    props.history.push({ pathname: `/app/${item.id}/project-detail`, search: { name: item.name } });
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
    <div className={styles.controlContainer}>
      <div className={styles.topTitleContainer}>
        <span >应用绑定API</span>
        <Button style={{ float: 'right' }}
          onClick={() => { props.history.goBack(); }}
        >
          返回
        </Button>
      </div>
      <div className={styles.container}>
        <div className={styles.title}>为此应用绑定API,此处等同于列表内应用/APP的名称</div>
        <CWTable
          columns={columns}
          dataSource={basicTableListData}
          rowKey={(record) => record.id}
          loading={loading}
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
                    openisAddModalVisibleModal();
                  }}
                >
                  <FormattedMessage
                    id="pages.projectManage.create"
                    defaultValue="新增"
                  />
                </Button>,
              ];
            },
            searchContent: searchContent,
          }}
        ></CWTable>
      </div>
      {/* 停用/启用弹窗 */}
      {
        isDeactivateProjectModalVisible && (
          <DeactivateModal
            activeApi={activeApi}
            flag={deactivateOrEnable}
            onCancel={closeDeactivateProjectModal}
          >
          </DeactivateModal>)
      }
      {/* 编辑有效期弹窗 */}
      {
        timeOfValidityVisible && <Modal
          draggable
          okText='确认'
          style={{marginTop:'20vh'}}
          title='编辑有效期'
          onCancel={() => { closeTimeOfValidityModal();setTimeFlag('long'); }}
          visible={true}
        >
          <span style={{ display: 'flex', alignItems: 'center', padding: '20px 20px 50px', fontSize: '16px',minHeight:'120px' }}>
            <span style={{ color: 'rgb(245, 34, 45)', fontSize: '14px', margin: '5px 7px 0' }}>*</span>
            <span >
              授权有效期：
            </span>
            <Radio.Group value={timeFlag} onChange={(e) => { setTimeFlag(e.target.value); }}>
              <Radio value='long'>永久</Radio>
              <Radio value='short'>短期</Radio>
            </Radio.Group>
            {
              timeFlag === 'short' && <DatePicker showTime 
              defaultValue={moment(moment().format("YYYY-MM-DD HH:mm:ss"))}
              onChange={({dateString})=>{setChangeTime(dateString);}}
             />
            }
          </span>
        </Modal>
      }
      {/* 新增弹窗 */}
      {
        isAddModalVisible && <AddApiModal
          onCancel={closeisAddModalVisibleModal}>
        </AddApiModal>
      }
    </div>
  );
});
export default AppProjectManage;
