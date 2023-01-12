import React from 'react';
import {
  Icon,
  Input,
  message,
  Popconfirm,
  Popover,
  CWTree,
  Modal,
} from '@chaoswise/ui';
import { useState, useEffect, useRef } from 'react';
import styles from './style.less';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from '../../model/index';
import _ from 'lodash';
import {
  updateTreeDataService,
  addTreeDataService,
  deleteTreeDataService,
} from '../../services';
import globalStore from '@/stores/globalStore';
import { add } from '@chaoswise/utils';
import iconMapping from './iconMapping';
import ChooseIcon from './components/ChooseIcon';
import { useIntl } from 'react-intl';

const HandleMenu = observer((props) => {
  const { defaultExpandAll = true } = props;
  const {
    treeData,
    getTreeData,
    setSelectedData,
    selectedData,
    setCurPage,
    setPageSize,
  } = store;
  const { userInfo = {} } = globalStore;
  const { iuser = {} } = userInfo;
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const [addCateModalVisible, setAddCateModalVisible] = useState(false);
  const [addingCateName, setAddingCateName] = useState('');
  const [addingCateIcon, setAddingCateIcon] = useState('');

  const [addSubCateModalVisible, setAddSubCateModalVisible] = useState(false);
  const [addingSubCateName, setAddingSubCateName] = useState('');
  const [addingSubCateParentId, setAddingSubCateParentId] = useState('');

  const [editCateModalVisible, setEditCateModalVisible] = useState(false);
  const [editingCateName, setEditingCateName] = useState('');
  const [editingCateIcon, setEditingCateIcon] = useState('');
  const [editingCateId, setEditingCateId] = useState('');

  const [editSubCateModalVisible, setEditSubCateModalVisible] = useState(false);
  const [editingSubCateName, setEditingSubCateName] = useState('');
  const [editingSubCateId, setEditingSubCateId] = useState('');
  const intl = useIntl();

  useEffect(() => {
    if (treeData) {
      setData(_.cloneDeep(toJS(treeData)));
      setSelectedKeys(['all']);
    }
  }, [treeData]);
  useEffect(() => {
    const data = _.cloneDeep(toJS(treeData));
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
  const addCateSave = async () => {
    if (!addingCateName) {
      message.error('分类名称不能为空！');
      return;
    }
    if (!addingCateIcon) {
      message.error('分类图标不能为空！');
      return;
    }
    const res = await addTreeDataService({
      name: addingCateName,
      icon: addingCateIcon,
    });
    if (res && res.code == 0) {
      setAddCateModalVisible(false);
      getTreeData();
      setAddingCateName('');
      setAddingCateIcon(null);
      message.success('添加成功!');
    } else {
      message.error(res.msg);
    }
  };
  const eidtCateSave = async () => {
    if (!editingCateName) {
      message.error('分类名称不能为空！');
      return;
    }
    if (!editingCateIcon) {
      message.error('分类图标不能为空！');
      return;
    }
    const res = await updateTreeDataService({
      id: editingCateId,
      name: editingCateName,
      icon: editingCateIcon,
    });
    if (res && res.code == 0) {
      setEditCateModalVisible(false);
      setEditingCateName('');
      setEditingCateIcon(null);
      getTreeData();
      message.success('修改成功！');
    } else {
      message.error(res.msg);
    }
  };
  const addSubCateSave = async () => {
    if (!addingSubCateName) {
      message.error('子分类名称不能为空！');
      return;
    }

    const res = await addTreeDataService({
      parentId: addingSubCateParentId,
      name: addingSubCateName,
    });
    if (res && res.code == 0) {
      setAddSubCateModalVisible(false);
      getTreeData();
      setAddingSubCateName('');
      message.success('添加成功!');
    } else {
      message.error(res.msg);
    }
  };
  const editSubCateSave = async () => {
    if (!editingSubCateName) {
      message.error('子分类名称不能为空！');
      return;
    }
    const res = await updateTreeDataService({
      id: editingSubCateId,
      name: editingSubCateName,
    });
    if (res && res.code == 0) {
      setEditSubCateModalVisible(false);
      getTreeData();
      message.success('修改成功！');
    } else {
      message.error(res.msg);
    }
  };
  return (
    <>
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
                  className={`categoriy-iconfont ${
                    iconMapping[v.icon] || iconMapping['icon-widget']
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
          menuData={(title, key, dataItem) => {
            if (dataItem.range == 0) {
              return null;
            }
            let menu = [
              {
                key: 'edit',
                title: (
                  <Icon
                    type='edit'
                    onClick={() => {
                      if (dataItem.range == 1) {
                        const target = data.find((i) => i.id === key);
                        setEditingCateName(title);
                        setEditingCateIcon(target ? target.icon : null);
                        setEditingCateId(key);
                        setEditCateModalVisible(true);
                      }
                      if (dataItem.range == 2) {
                        setEditingSubCateName(title);
                        setEditingSubCateId(key);
                        setEditSubCateModalVisible(true);
                      }
                    }}
                  />
                ),
              },
              {
                key: 'delete',
                title: (
                  <Popconfirm
                    title='确定删除吗?'
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onCancel={(e) => e.stopPropagation()}
                    onConfirm={async (e) => {
                      e.stopPropagation();
                      const res = await deleteTreeDataService({
                        id: key,
                      });
                      if (res && res.code == 0) {
                        getTreeData();
                        message.success(
                          intl.formatMessage({
                            id: 'common.deleteSuccess',
                            defaultValue: '删除成功！',
                          })
                        );
                      } else {
                        message.error(res.msg);
                      }
                    }}
                  >
                    <Icon type='delete' />
                  </Popconfirm>
                ),
              },
            ];
            if (dataItem.range == 1) {
              menu.unshift({
                key: 'add',
                title: (
                  <Icon
                    type='plus'
                    onClick={() => {
                      setAddingSubCateParentId(key);
                      setAddSubCateModalVisible(true);
                    }}
                  />
                ),
              });
            }
            return menu;
          }}
          selectedKeys={selectedKeys}
          onSelect={onSelectTree}
          expandedKeys={expandedKeys}
          onExpand={(keys) => {
            setExpandedKeys(keys);
          }}
        />
      </div>

      <div
        className={styles.leftBigTitle}
        onClick={() => {
          setAddingCateName('');
          setAddingCateIcon(null);
          setAddCateModalVisible(true);
        }}
      >
        <span style={{ marginLeft: 10 }}>新增分类</span>
      </div>
      <Modal
        title='添加分类'
        visible={addCateModalVisible}
        onOk={() => {
          if (addingCateName.length > 20) {
            return;
          }
          addCateSave();
        }}
        onCancel={() => {
          setAddCateModalVisible(false);
          setAddingCateName('');
          setAddingCateIcon(null);
        }}
        size='small'
        mask={true}
      >
        <div className={styles.modalWrap}>
          <div>
            <div className={styles.formItemLabelWrap}>
              {/* <div style={{ color: '#ff561b', fontSize: '16px',marginRight:8,paddingTop:3 }}>*</div> */}
              <span>分类名称:</span>
            </div>
            <div className={styles.formItemFieldWrap}>
              <Input
                placeholder='分类名称'
                value={addingCateName}
                style={
                  addingCateName.length > 20 ? { borderColor: '#f5222d' } : {}
                }
                onChange={(e) => {
                  setAddingCateName(e.target.value);
                }}
              ></Input>
            </div>
          </div>
          <p>
            {addingCateName.length > 20 ? '分类名称不能超过20个字符！' : ''}
          </p>
          <div>
            <div className={styles.formItemLabelWrap}>
              {/* <div style={{ color: '#ff561b', fontSize: '16px',marginRight:8,paddingTop:3 }}>*</div> */}
              <span>分类图标:</span>
            </div>
            <div className={styles.formItemFieldWrap}>
              <ChooseIcon
                value={addingCateIcon}
                onChange={(icon) => {
                  setAddingCateIcon(icon);
                }}
              ></ChooseIcon>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title='编辑分类'
        visible={editCateModalVisible}
        onOk={() => {
          if (editingCateName.length > 20) {
            return;
          }
          eidtCateSave();
        }}
        onCancel={() => {
          setEditCateModalVisible(false);
          setEditingCateName('');
          setEditingCateIcon(null);
        }}
        size='small'
        mask={true}
      >
        <div className={styles.modalWrap}>
          <div>
            <div className={styles.formItemLabelWrap}>
              {/* <div style={{ color: '#ff561b', fontSize: '16px',marginRight:8,paddingTop:3 }}>*</div> */}
              <span>分类名称:</span>
            </div>
            <div className={styles.formItemFieldWrap}>
              <Input
                placeholder='分类名称'
                value={editingCateName}
                style={
                  editingCateName.length > 20 ? { borderColor: '#f5222d' } : {}
                }
                onChange={(e) => {
                  setEditingCateName(e.target.value);
                }}
              ></Input>
            </div>
          </div>
          <p>
            {editingCateName.length > 20 ? '分类名称不能超过20个字符！' : ''}
          </p>
          <div>
            <div className={styles.formItemLabelWrap}>
              {/* <div style={{ color: '#ff561b', fontSize: '16px',marginRight:8,paddingTop:3 }}>*</div> */}
              <span>分类图标:</span>
            </div>
            <div className={styles.formItemFieldWrap}>
              <ChooseIcon
                value={editingCateIcon}
                onChange={(icon) => {
                  setEditingCateIcon(icon);
                }}
              ></ChooseIcon>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        title='新增子分类'
        visible={addSubCateModalVisible}
        onOk={() => {
          if (addingSubCateName.length > 20) {
            return;
          }
          addSubCateSave();
        }}
        onCancel={() => {
          setAddSubCateModalVisible(false);
          setAddingSubCateName('');
        }}
        size='small'
        mask={true}
      >
        <div className={styles.modalWrap}>
          <div>
            <div className={styles.formItemLabelWrap}>
              {/* <div style={{ color: '#ff561b', fontSize: '16px',marginRight:8,paddingTop:3 }}>*</div> */}
              <span>子分类名称:</span>
            </div>
            <div className={styles.formItemFieldWrap}>
              <Input
                placeholder='子分类名称'
                value={addingSubCateName}
                style={
                  addingSubCateName.length > 20
                    ? { borderColor: '#f5222d' }
                    : {}
                }
                onChange={(e) => {
                  setAddingSubCateName(e.target.value);
                }}
              ></Input>
            </div>
          </div>
          <p>
            {addingSubCateName.length > 20 ? '分类名称不能超过20个字符！' : ''}
          </p>
        </div>
      </Modal>
      <Modal
        title='编辑子分类'
        visible={editSubCateModalVisible}
        onOk={() => {
          if (editingSubCateName.length > 20) {
            return;
          }
          editSubCateSave();
        }}
        onCancel={() => {
          setEditSubCateModalVisible(false);
          setEditingSubCateName('');
        }}
        size='small'
        mask={true}
      >
        <div className={styles.modalWrap}>
          <div>
            <div className={styles.formItemLabelWrap}>
              {/* <div style={{ color: '#ff561b', fontSize: '16px',marginRight:8,paddingTop:3 }}>*</div> */}
              <span>子分类名称:</span>
            </div>
            <div className={styles.formItemFieldWrap}>
              <Input
                placeholder='子分类名称'
                value={editingSubCateName}
                style={
                  editingSubCateName.length > 20
                    ? { borderColor: '#f5222d' }
                    : {}
                }
                onChange={(e) => {
                  setEditingSubCateName(e.target.value);
                }}
              ></Input>
            </div>
          </div>
          <p>
            {editingSubCateName.length > 20 ? '分类名称不能超过20个字符！' : ''}
          </p>
        </div>
      </Modal>
    </>
  );
});

export default HandleMenu;
