import React, { useState, useEffect, useRef } from "react";
import { AbreastLayout, SearchBar, Icon, Pagination } from "@chaoswise/ui";
import { Select, Input, Button, Modal, message, Collapse } from 'antd';
import { observer, toJS } from "@chaoswise/cw-mobx";
const { Panel } = Collapse;
import store from "./model/index";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { useIntl } from "react-intl";
import HandleMenu from "./components/handleMenu";
import AddComponent from "./components/addComponent";
import Detail from "./components/detail";
import _ from "lodash";
import Card from '@/components/TestCard';
import Drawer from '@/components/Drawer';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Option } = Select;

const ComponentDevelop = observer(({ ProgressId }) => {
  const intl = useIntl();
  const {
    getLibraryListData,setLibraryOptions,
    addModalvisible,
    setAddModalvisible,
    getIndustrysList,
    getTagsList,setCurPage,
    deleteAssembly,setLibraryLisCurPage,
    getTreeDataFirst, addLibraryLisCurPage,
    changeOneAssemly,
    getListData, setDrawerVisible,
    getAssemlyDetail,
    setSelectedData, setProjectId
  } = store;
  const { total, curPage, pageSize, tagsList, hasMore, libraryListLength, industryList, isDrawerVisible, assemlyDetail, libraryListData, listData, selectedData } = store;
  const [changeFlga, setchangeFlga] = useState(false); //编辑完成
  // 公共组件下滑
  const changePage = () => {
    addLibraryLisCurPage();
    getLibraryListData();
  };
  // 表格列表数据
  let basicTableListData = toJS(listData);
  const [activeProject, setActiveProject] = useState(''); //编辑完成
  const searchContent = [
    {
      components: (
        <Select mode="tags"
          allowClear={true}
          id="trades"
          key="trades"
          name='行业'
          style={{ width: "170px" }}
          placeholder={
            intl.formatMessage({
              id: "common.pleaseSelect",
              defaultValue: "请选择",
            }) + "行业"
          }
        >
          {
            industryList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
    {
      components: (
        <Input
          id="key"
          key="key"
          allowClear={true}
          style={{ width: "200px" }}
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.projectDetailDevelop.searchInputKey",
            defaultValue: "输入组件名称/描述查找组件",
          })}
        />
      ),
    },
    {
      components: (
        <Select mode="tags"
          id="tags"
          allowClear={true}
          key="tag"
          name='标签'
          style={{ width: "170px" }}
          placeholder={
            intl.formatMessage({
              id: "common.pleaseSelect",
              defaultValue: "请选择",
            }) + "标签"
          }
        >
          {
           tagsList&& tagsList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
  ];
  const changeColumns = (values) => {
    for (let i in values) {
      if (!values[i] || values[i].length === 0) {
        delete values[i];
      }
    }
    setLibraryLisCurPage(1);
    setLibraryOptions(values);
    getLibraryListData({}, true);
  };
  // 请求列表数据
  useEffect(() => {
    setLibraryOptions({});
    setProjectId(ProgressId);
    getTreeDataFirst();
    getIndustrysList(); //行业
    getTagsList();
    setActiveProject(JSON.parse(sessionStorage.getItem('activeProject')).name);
  }, []);
  useEffect(() => {
    Number(selectedData.category) ?getListData():null;
    Number(selectedData.category) ?getLibraryListData({}, true):null;
  }, [selectedData]);
  return < >
    <AbreastLayout
      type='leftOperationArea'
      showCollapsedBtn
      SiderWidth={300}
      Siderbar={(
        <div className={styles.leftWrap}>
          <div className={styles.treeWrap}>
            <HandleMenu />
          </div>
        </div>
      )}
    >
      <div className={styles.container}>
        <Collapse defaultActiveKey={['1', '2']} ghost={true} bordered={false} > 
          <Panel header={
            <>
              <span>{activeProject}</span>
              <span className={styles.title}>共</span>
              <span>{listData && listData.total}个组件</span>
            </>
          } key="1"
            extra={<Button onClick={(e) => {
              e.stopPropagation();
              setchangeFlga(!changeFlga);
            }} type="primary" >{changeFlga ? '完成' : '编辑'}</Button>
            }>
            <div id="scrollableDiv" style={{ height: '470px', overflow: 'auto' }} >
              <Card
                number={6}
                checkCard={(id) => {
                  setDrawerVisible(true);
                  getAssemlyDetail(id);
                }}
                onDelete={(params) => {
                  let filterArr = params.projects.filter(item => {
                    return item.id !== ProgressId;
                  });
                  let endData = filterArr.map(item => item.id);
                  let newParams = {
                    projects: params.projects.length > 1 ? endData : []
                  };
                  // 删除组件默认组件库一起清除，使用修改组件
                  changeOneAssemly(params.id, newParams, (res) => {
                    if (res.code === successCode) {
                      getListData({ projectId: ProgressId }, true);
                      getLibraryListData({}, true);
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
                }}
                value={basicTableListData}
                state={1}
                canDelete={changeFlga}
              ></Card>
              <Pagination
                hideOnSinglePage={true}
                total={total}
                current={curPage }
                pageSize={pageSize}
                onChange={(page) => {
                  setCurPage(page);
                  getListData();
                }}
              />
            </div>


          </Panel>
          <Panel header={<>  <span>从组件库中选择项目组件 </span> <span className={styles.rightTitle}>*下方列表中展示的是项目组件，不包括基础组件</span></>} key="2">
            <SearchBar
              onSearch={changeColumns}
              searchContent={searchContent} showSearchCount={6}
            />
            <div id="scrollableDivTwo" style={{ height: '470px', overflow: 'auto' }} >
              <InfiniteScroll
                dataLength={libraryListLength}
                next={changePage}
                hasMore={hasMore}
                scrollableTarget="scrollableDivTwo"
              >
                <Card
                  number={6}
                  projectID={ProgressId}
                  checkCard={(id) => {
                    setDrawerVisible(true);
                    getAssemlyDetail(id);
                  }}
                  value={libraryListData}
                  state={1}
                  canAdd={true}
                  addOwn={(id, projectsArr) => {
                    changeOneAssemly(id, { projects: [...projectsArr, ProgressId] }, (res) => {
                      if (res.code === successCode) {
                        message.success(
                          intl.formatMessage({
                            id: "common.addSuccess",
                            defaultValue: "新增成功！",
                          })
                        );
                        setLibraryLisCurPage(1);
                        getListData({ projectId: ProgressId }, true);
                        getLibraryListData({}, true);
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
                >
                </Card>
              </InfiniteScroll>
            </div>
          </Panel>
        </Collapse>
      </div>
      {/* <Detail /> */}
    </AbreastLayout>
    {
      isDrawerVisible ? <Drawer assemly={assemlyDetail} setDrawerVisible={setDrawerVisible} /> : null
    }
  </>;
});
export default ComponentDevelop;
