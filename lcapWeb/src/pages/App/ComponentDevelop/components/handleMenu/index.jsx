import React from 'react';
import { Icon,Input,message,Popconfirm,Popover,CWTree,Modal } from '@chaoswise/ui';
import { useState,useEffect,useRef } from 'react';
import styles from './style.less';
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import _ from "lodash";
import { updateTreeDataService } from '../../services';
import globalStore from '@/stores/globalStore';
import { add } from '@chaoswise/utils';
const HandleMenu = observer((props)=>{
  const { defaultExpandAll=true } = props;
  const { 
    treeData,
    getTreeData,
    setSelectedData,
    selectedData,
    setCurPage,
    setPageSize
  } = store;
  const { userInfo={} } = globalStore;
  const { iuser={} } = userInfo;
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const [addCateModalVisible,setAddCateModalVisible] = useState(false);
  const [addingCateName,setAddingCateName] = useState('');

  const [addSubCateModalVisible,setAddSubCateModalVisible] = useState(false);
  const [addingSubCateName,setAddingSubCateName] = useState('');
  const [addingSubCateParentId,setAddingSubCateParentId] = useState('');

  const [editCateModalVisible,setEditCateModalVisible] = useState(false);
  const [editingCateName,setEditingCateName] = useState('');
  const [editingCateId,setEditingCateId] = useState('');

  const [editSubCateModalVisible,setEditSubCateModalVisible] = useState(false);
  const [editingSubCateName,setEditingSubCateName] = useState('');
  const [editingSubCateId,setEditingSubCateId] = useState('');

  useEffect(() => {
    if (treeData) {
      setData(_.cloneDeep(toJS(treeData)));
      setSelectedKeys([treeData[0]&&treeData[0].id])
    }
  }, [treeData]);
  useEffect(() => {
    const data = _.cloneDeep(toJS(treeData));
    if (searchValue) {
      const filterData = data.filter(item=>{
        if (item.name.includes(searchValue)) {
          return true
        }
        if (item.children) {
          const findChilren = item.children.filter(item1=>{
            return item1.name.includes(searchValue)
          }) || [];
          if (findChilren.length) {
            item.children = findChilren;
            return true
          }
        }
        return false;
      })
      setData(filterData);
      setExpandedKeys(filterData.map(item=>item.id))
    }else{
      setData(data);
      setExpandedKeys([]);
    }
  }, [searchValue]);
  const onSelectTree = (keys,e)=>{
    setCurPage(0);
    setSelectedKeys(keys);
    const key = keys[0];
    let parent = treeData.find(item=>item.id==key);
    if (parent) {
      setSelectedData({
        category:key,
        subCategory:''
      })
    }else{
      for (const item of treeData) {
        if (item.children) {
          const child = item.children.find(item1=>item1.id==key);
          if (child) {
            parent = item;
          }
        }
      }
      setSelectedData({
        category:parent.id,
        subCategory:key
      })
    }
  }
  const addCateSave = async ()=>{
    if (!addingCateName) {
      message.error('分类名称不能为空！')
      return 
    }
    const datas = _.cloneDeep(toJS(treeData));
    let has = false;
    datas.map(item=>{
      if (item.name===addingCateName) {
        has = true;
      }
      return item;
    });
    if (has) {
      message.error('组件分类名称已存在！');
    }else{
      datas.push({name:addingCateName,children:[]});
      const res = await updateTreeDataService({categories:datas});
      if (res && res.code==0) {
        setAddCateModalVisible(false);
        getTreeData();
        setAddingCateName('');
        message.success('添加成功!')
      }else{
        message.error(res.msg)
      }
    }
  }
  const eidtCateSave = async ()=>{
    if (!editingCateName) {
      message.error('分类名称不能为空！')
      return 
    }
    const datas = _.cloneDeep(toJS(treeData));
    datas.map(item=>{
      if (item.id===editingCateId) {
        item.name=editingCateName
      }
      return item;
    })
    const res = await updateTreeDataService({categories:datas});
    if (res && res.code==0) {
      setEditCateModalVisible(false);
      getTreeData();
      message.success('修改成功！')
    }else{
      message.error(res.msg)
    }
  }
  const addSubCateSave = async ()=>{
    if (!addingSubCateName) {
      message.error('子分类名称不能为空！')
      return 
    }
    const datas = _.cloneDeep(toJS(treeData));
    let has = !!datas.find(item=>item.id==addingSubCateParentId).children.find(item=>item.name===addingSubCateName)
    if (has) {
      message.error('子分类名称已存在！');
    }else{
      datas.map(item=>{
        if (item.id===addingSubCateParentId) {
          item.children.push({name:addingSubCateName})
        }
        return item;
      })
      const res = await updateTreeDataService({categories:datas});
      if (res && res.code==0) {
        setAddSubCateModalVisible(false);
        getTreeData();
        setAddingSubCateName('');
        message.success('添加成功!')
      }else{
        message.error(res.msg)
      }
    }
  }
  const editSubCateSave = async ()=>{
    if (!editingSubCateName) {
      message.error('子分类名称不能为空！')
      return 
    }
    const datas = _.cloneDeep(toJS(treeData));
    datas.map(item=>{
      item.children.map(item1=>{
        if (item1.id==editingSubCateId) {
          item1.name = editingSubCateName;
        }
        return item1;
      })
      return item;
    })
    const res = await updateTreeDataService({categories:datas});
    if (res && res.code==0) {
      setEditSubCateModalVisible(false);
      getTreeData();
      message.success('修改成功！')
    }else{
      message.error(res.msg)
    }
  }
  return <>
    <div className={styles.searchWrap}>
      <Input placeholder='请输入搜索关键字' value={searchValue} suffix={<Icon type="search" />}
        onChange={(e)=>{
          setSearchValue(e.target.value);
        }}
      ></Input>
    </div>
    <div className={styles.treeWrap}>
      <CWTree
        treeData={data.map((v, k) => ({
          key: v.id,
          title: v.name,
          range:1,
          children:!!v.children?v.children.map((v1,k1)=>{
            return {
              key: v1.id,
              title: v1.name,
              range:2
            }
          }):[]
        }))}
        menuData={(title, key, data) => {
          let menu =  [
            {
              key: "edit",
              title: <Icon type="edit" onClick={() => {
                if (data.range==1) {
                  setEditingCateName(title);
                  setEditingCateId(key);
                  setEditCateModalVisible(true);
                }
                if (data.range==2) {
                  setEditingSubCateName(title);
                  setEditingSubCateId(key);
                  setEditSubCateModalVisible(true);
                }
              }} />,
            },
            {
              key: "delete",
              title: <Popconfirm title='确定删除吗?'
              onClick={(e)=>{
                e.stopPropagation()
              }}
              onCancel={(e)=>e.stopPropagation()}
              onConfirm={async (e)=>{
                e.stopPropagation();
                if (data.range==1) {
                  const findItem = treeData.find(item=>item.id==key);
                  if (findItem.children && findItem.children.length) {
                    message.warning('无法删除，该组件分类存在二级分类，请删除全部二级分类！')
                  }else{
                    const datas = treeData.filter(item=>{
                      return item.id!==key
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      getTreeData();
                      message.success('删除成功！')
                    }else{
                      message.error(res.msg)
                    }
                  }
                }
                if (data.range==2) {
                  const datas = _.cloneDeep(toJS(treeData));
                  datas.map(item=>{
                    if (item.children) {
                      item.children = item.children.filter(item1=>item1.id!==key)
                    }
                    return item;
                  })
                  const res = await updateTreeDataService({categories:datas});
                  if (res && res.code==0) {
                    getTreeData();
                    message.success('删除成功！')
                  }else{
                    message.error(res.msg)
                  }
                }
              }}>
              <Icon type="delete" />
            </Popconfirm>,
            }
          ];
          if (data.range==1) {
            menu.unshift({
              key: "add",
              title: <Icon type="plus" onClick={() => {
                setAddingSubCateParentId(key);
                setAddSubCateModalVisible(true);
              }} />,
            })
          }
          return menu;
        }}
        selectedKeys={selectedKeys}
        onSelect={onSelectTree}
        expandedKeys={expandedKeys}
        onExpand={(keys)=>{
          setExpandedKeys(keys)
        }}
      />
    </div>
    
    <div className={styles.leftBigTitle}
      onClick={()=>{
        setAddingCateName('');
        setAddCateModalVisible(true);
      }}
    >
      <span style={{marginLeft:10}}>新增分类</span>
    </div>
    <Modal
      title='添加分类'
      visible={addCateModalVisible}
      onOk={addCateSave}
      onCancel={() => {
        setAddCateModalVisible(false);
        setAddingCateName('');
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
              onChange={(e) => { setAddingCateName(e.target.value); }}
            ></Input>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      title='编辑分类'
      visible={editCateModalVisible}
      onOk={eidtCateSave}
      onCancel={() => {
        setEditCateModalVisible(false);
        setEditingCateName('');
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
              onChange={(e) => { setEditingCateName(e.target.value); }}
            ></Input>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      title='新增子分类'
      visible={addSubCateModalVisible}
      onOk={addSubCateSave}
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
              onChange={(e) => { setAddingSubCateName(e.target.value); }}
            ></Input>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      title='编辑子分类'
      visible={editSubCateModalVisible}
      onOk={editSubCateSave}
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
              onChange={(e) => { setEditingSubCateName(e.target.value); }}
            ></Input>
          </div>
        </div>
      </div>
    </Modal>
  </>
})

export default HandleMenu;