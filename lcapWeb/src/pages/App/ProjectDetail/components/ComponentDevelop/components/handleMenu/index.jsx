import React from 'react';
import { useState, useEffect } from 'react';
import { Icon, CWTree, Input } from '@chaoswise/ui';
import styles from './style.less';
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import _ from "lodash";
import iconMapping from './iconMapping';

const HandleMenu = observer((props) => {
  const {
    treeData,
    setSelectedData,
    setCurPage,
  } = store;
  const [data, setData] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const onSelectTree = (keys, e) => {
    setCurPage(1);
    setSelectedKeys(keys);
    const key = keys[0];
    let parent = treeData.find((item) => item.id == key);
    if (parent) {
      setSelectedData({
        category: key,
        subCategory: '',
      });
    } else {
      for (const item of treeData) {
        if (item.children) {
          const child = item.children.find((item1) => item1.id == key);
          if (child) {
            parent = item;
          }
        }
      }
      if (parent == null) {
        setSelectedData({});
      } else {
        setSelectedData({
          category: parent ? parent.id : null,
          subCategory: key,
        });
      }
    }
  };
  useEffect(() => {
    const data = _.cloneDeep(toJS(treeData)) || [];
    if (searchValue) {
      const filterData = data.filter((item) => {
        if (item.name.includes(searchValue)) {
          return true;
        }
        if (item.children) {
          const findChilren =
            item.children.filter((item1) => {
              return item1.name.includes(searchValue);
            }) || [];
          if (findChilren.length) {
            item.children = findChilren;
            return true;
          }
        }
        return false;
      });
      setData(filterData);
      setExpandedKeys(filterData.map((item) => item.id));
    } else {
      setData(data);
      setExpandedKeys([]);
    }
  }, [searchValue]);
  useEffect(() => {
    if (treeData) {
      setData(_.cloneDeep(toJS(treeData)));
      setSelectedKeys(['all']);
    }
  }, [treeData]);

  return <>
    <div className={styles.searchWrap}>
      <Input
        placeholder='请输入搜索关键字'
        value={searchValue}
        suffix={<Icon type='search' />}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      ></Input>
    </div>
    <div className={styles.treeWrap}>
      <CWTree
        treeData={[
          {
            key: 'all',
            title: '全部组件',
            range: 0,
          },
        ].concat(
          data.map((v, k) => ({
            key: v.id,
            title: v.name,
            range: 1,
            icon: (
              <i
                className={`categoriy-iconfont ${iconMapping[v.icon] || iconMapping['icon-widget']
                  }`}
              ></i>
            ),
            children: v.children
              ? v.children.map((v1, k1) => {
                return {
                  key: v1.id,
                  title: v1.name,
                  range: 2,
                };
              })
              : [],
          }))
        )}
        selectedKeys={selectedKeys}
        onSelect={onSelectTree}
        expandedKeys={expandedKeys}
        onExpand={(keys) => {
          setExpandedKeys(keys);
        }}
      />
    </div>
  </>
})

export default HandleMenu;