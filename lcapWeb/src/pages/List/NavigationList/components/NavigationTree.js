/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx';
import { Input, Icon, Tree } from '@chaoswise/ui';
import store from '../model/index';

const { Search } = Input;

const NavigationTree = observer(() => {
  /** 
   * getNavigationTree 获取列表数据方法
   * onClickSelect     点击树节点触发的方法
   * treeData          树形结构数据
   * departmentKey     树节点标识
  */
  const { getNavigationTree, onClickSelect } = store;
  const { departmentKey, treeData } = store;
  let navigationTreeData = toJS(treeData);
  const [searchValue, setSearchValue] = useState();
  // 请求数据
  useEffect(() => {
    getNavigationTree();
  }, []);
  // 点击搜索后的节点处理
  const onSelectSearchMenu = ({ selectedKeys }) => {
    onClickSelect(selectedKeys);
  };
  // 点击树节点触发的方法
  const onSelect = (departmentKey) => {
    onClickSelect(departmentKey);
  };
  return (
    <div style={{ padding: '12px 10px' }}>
      <Search
        value={searchValue}
        onChange={(e) => { const { value } = e.target; setSearchValue(value); }}
      ></Search>
      <div style={{ height: 'calc(100% - 32px)', overflow: 'auto' }}>
        <Tree
          multiple={true}
          switcherIcon={<Icon type="down" />}
          onSelectSearchMenu={onSelectSearchMenu}
          onSelect={onSelect}
          searchValue={searchValue}
          treeData={navigationTreeData}
          extendType='menu'
          selectedKeys={[departmentKey]}
        />
      </div>
    </div>
  );
});
export default NavigationTree;