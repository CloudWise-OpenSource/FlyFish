
import React, { useState, useEffect } from "react";
import { SearchBar, AbreastLayout, Icon } from "@chaoswise/ui";
import { Select, Input } from 'antd';
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import styles from "./assets/style.less";
import HandleMenu from "./components/handleMenu";
import Detail from "./components/detail";
import _ from "lodash";
import { useIntl } from "react-intl";
import Drawer from '@/components/Drawer';

import Card from '@/components/TestCard';
import InfiniteScroll from 'react-infinite-scroll-component';



const { Option } = Select;

const ComponentDevelop = observer(() => {
  const intl = useIntl();
  let [flagNum, setFlagNum] = useState(0);
  const {
    getTreeDataFirst, setCurPage, addCurpage,
    getListData,
    setDrawerVisible,
    getIndustrysList,
    getTagsData, 
    getAssemlyDetail, setSelectedOptions,
  } = store;
  const { isDrawerVisible, selectedOptions, hasMore, tagsData, assemlyDetail, industryList, selectedData, listLength, listData } = store;

  const onSearch = (params) => {
    for (const i in params) {
      if (!params[i] || params[i].length === 0) {
        delete params[i];
      }
    }
    setCurPage(1);
    setSelectedOptions(params);

  };
  let cardDate = toJS(listData);
  const changePage = () => {
    addCurpage();
    getListData();
  };
  const searchContent = [
    {
      components: (
        <Select
          id="trades"
          key="trades"
          mode='tags'
          name='行业'
          allowClear={true}
          optionFilterProp="children"
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.trade",
            defaultValue: "选择行业进行查询",
          })}
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
          allowClear={true}
          key="key"
          style={{ width: "300px" }}
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.name",
            defaultValue: "输入组件名称/描述/查找组件",
          })}
        />
      ),
    },
    {
      components: (
        <Select mode="tags" id="tags"
          key="tags"
          allowClear={true}
          name='标签' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.searchInputApplyLabel",
            defaultValue: "选择应用标签进行查询",
          })}
        >
          {
            tagsData.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
    {
      components: (
        <Select id="type"
          key="type"
          name='组件类别' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.searchtype",
            defaultValue: "选择组件类别进行查询",
          })}
        >
          <Option value="">全部</Option>
          <Option value="common">基础组件</Option>
          <Option value="project">项目组件</Option>
        </Select>
      ),
    }
  ];
  // 请求列表数据
  useEffect(() => {
    setSelectedOptions({});
    getTagsData();
    getTreeDataFirst();
    getIndustrysList();
  }, []);
  useEffect(() => {
    Number(selectedData.category) ? getListData({}, true) : null;
    setCurPage(1);
  }, [selectedData, selectedOptions]);
  return <div className={styles.templateComponent}>
    <AbreastLayout
      type='leftOperationArea'
      showCollapsedBtn
      SiderWidth={200}
      Siderbar={(
        <div className={styles.treeWrap}>
          <HandleMenu />
        </div>
      )}
    ><Detail />
      <SearchBar
        searchContent={searchContent} showSearchCount={6} onSearch={onSearch}
      />
      <div id="scrollableDiv" style={{ height: '87%', overflow: 'auto' }} >
        <InfiniteScroll
          dataLength={listLength}
          next={changePage}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
        >
          <Card number={6} value={cardDate} checkCard={(id) => {
            getAssemlyDetail(id);
          }} state={1} />
        </InfiniteScroll>
      </div>
    </AbreastLayout>
    {
      isDrawerVisible ? <Drawer assemly={assemlyDetail} setDrawerVisible={setDrawerVisible} /> : null
    }
  </div>;
});
export default ComponentDevelop;
