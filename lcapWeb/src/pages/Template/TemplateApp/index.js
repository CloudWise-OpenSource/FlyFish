/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { message, SearchBar, Pagination, Input, Icon, Button, Tooltip } from "@chaoswise/ui";
import {
  observer
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { useIntl } from "react-intl";
import { Select } from 'antd';
const { Option } = Select;
import globalStore from '@/stores/globalStore';

import ApplyModal from './components/AddProjectModal';
const ApplyDevelop = observer((props) => {
  const intl = useIntl();
  const { userInfo } = globalStore;
  const {
    getApplicationList,
    setSearchParams,
    setType,
    getTradesList, copyApplicationOne,
    getTagsList, changeApplicationOne,
    activeCard,
    closeAppProjectModal,
    openAddProjectModal, setActiveCard,
    getProjectList, setPageSize, setCurPage, clearApplicationList
  } = store;
  const { tradesList, projectList, isAddModalVisible, searchParams, tagsList, applicationList, type, total, curPage, pageSize, } =
    store;
  const searchContent = [
    {
      components: (
        <Select
          id="trades"
          key="trades"
          name='行业'
          showSearch
          mode="multiple"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.trade",
            defaultValue: "选择行业进行查询",
          })}
        >
          {
            tradesList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
    {
      components: (

        <Input
          id="name"
          key="name"
          allowClear
          name='应用名称'
          suffix={<Icon type="search" />
          }
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.applyName",
            defaultValue: "选择应用名称进行查询",
          })}
        />
      ),
    },

    {
      components: (
        <Select id="tags"
          key="tags"
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          mode="multiple"
          allowClear
          name='应用标签' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.searchInputApplyLabel",
            defaultValue: "选择应用标签进行查询",
          })}
        >
          {
            tagsList && tagsList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
  ];
  const handleChange = (value) => {
    setType(value);
    getApplicationList();
  };
  const changeColumns = (values) => {
    for (let i in values) {
      if (!values[i] || values[i].length === 0) {
        delete values[i];
      }
    }
    setSearchParams(values);
  };
  // 请求列表数据
  useEffect(() => {
    if (props.location.state) {
      let paramsType = props.location.state.type;
      if (paramsType) {
        setType(paramsType);
        clearApplicationList(); //避免数据持久化闪烁
      }
    }
    
    setCurPage(0);
    setSearchParams();
    getTagsList();
    getProjectList();
    getTradesList({});

  }, []);
  useEffect(() => {
    getApplicationList();
  }, [searchParams]);
  return (
    <div className={styles.templateApContainer}>
      <div className={styles.searchCotainer1}>
        应用类型选择：<Select
          onChange={handleChange}
          id="name"
          key="name"
          value={type || '2D'}
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputPlaceholder",
            defaultValue: "选择应用类型进行查询",
          })}
        >
          <Option value="2D" >2D大屏应用</Option>
          <Option value="3D">3D大屏应用</Option>
        </Select>
      </div>
      <SearchBar
        searchContent={searchContent} showSearchCount={6}
        onSearch={changeColumns}
      />
      {
        <div style={{ minHeight: 'calc(100vh - 321px)' }}>
          <TsetCard
            value={applicationList} state={2}
            isLib={true}
            setActiveCard={setActiveCard}
            showStateTag={true}
            actions={(item) => {
              return (
                JSON.parse(localStorage.getItem('isAdmin')) == true ? <div style={{ display: 'flex' }}>
                  <Button value="small" type="primary" onClick={() => { openAddProjectModal(item); }}>
                    使用模板创建应用
                  </Button>
                  <a
                    title="预览应用"
                    target="_blank"
                    href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                    rel="noreferrer"
                  >
                    <Button value="small" >
                      预览模板应用
                    </Button>
                  </a>
                  <div >
                    <Tooltip title={item.isRecommend ? '取消推荐至工作台' : '推荐至工作台'}>
                      <Icon style={{ fontSize: '22px', marginTop: '3px' }} type={item.isRecommend ? "file-excel" : "file-add"} onClick={() => {
                        changeApplicationOne(item.id, { isRecommend: item.isRecommend ? false : true }, (res) => {
                          if (res.code === successCode) {
                            message.success(
                              intl.formatMessage({
                                id: item.isRecommend ? "common.noRecommendSuccess" : "common.recommendSuccess",
                                defaultValue: item.isRecommend ? "取消推荐成功！" : "推荐成功!",
                              })
                            );
                            getApplicationList();
                          } else {
                            message.error(
                              res.msg || intl.formatMessage({
                                id: item.isRecommend ? "noRecommendError" : "common.recommendError",
                                defaultValue: item.isRecommend ? "取消推荐失败,请稍后重试！" : "推荐失败,请稍后重试！!",
                              })
                            );
                          }
                        });
                      }} />
                    </Tooltip>
                  </div>
                </div> : <div style={{ display: 'flex' }}>
                  <Button value="small" type="primary" onClick={() => { openAddProjectModal(item); }}>
                    使用模板创建应用
                  </Button>
                  <a
                    title="预览应用"
                    target="_blank"
                    href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                    rel="noreferrer"
                  >
                    <Button value="small" >
                      预览模板应用
                    </Button>
                  </a>
                </div>
              );
            }}
          >

          </TsetCard>
        </div>


      }
      {
        isAddModalVisible && <ApplyModal
          onCancel={closeAppProjectModal}
          type={type}
          project={activeCard}
          projectList={projectList}
          tagList={tagsList}
          onCopy={(id, item) => {
            copyApplicationOne(id, item, (res => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.useSuccess",
                    defaultValue: "创建成功!",
                  })
                );
                window.top.open(`${window.LCAP_CONFIG.screenEditAddress}?id=${res.data.id}&token=${userInfo.yapiAuthorization}`, "_blank", "");
                closeAppProjectModal();
                getTagsList();
                getApplicationList();
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.copyError",
                    defaultValue: "复制失败，请稍后重试！",
                  })
                );
              }
            }));
          }}
        ></ApplyModal>
      }
      <Pagination
        total={total}
        hideOnSinglePage={true}
        showSizeChanger={true}
        showTotal={(total) => {
          return `共${total}条记录`;
        }}
        pageSizeOptions={['12', '36', '70', '120']}
        current={curPage + 1}
        pageSize={pageSize}
        onChange={(current) => {
          setCurPage(current - 1);
          getApplicationList();
        }}
        onShowSizeChange={
          (page, pageSize) => {
            setCurPage(0);
            setPageSize(pageSize);
            getApplicationList();
          }
        }
      />
    </div>
  );
});
export default ApplyDevelop;
