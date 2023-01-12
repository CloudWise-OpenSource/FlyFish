import React, { useEffect, useState } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx'
import { Input, Radio, Button, message, Icon, Tree, Checkbox, Row, Col, List } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";

const { Search } = Input;
const CheckboxGroup = Checkbox.Group;

const ImportComponent = observer((props)=>{
  const [centerSearchValue, setCenterSearchValue] = useState('');
  const [rightSearchValue, setRightSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)
  const [treeData, setTreeData] = useState([])
  const [isDisplayCheckbox, setIsDisplayCheckbox] = useState(false)
  const [indeterminate,setIndeterminate] = useState(false)
  const [checkAll,setCheckAll] = useState(false)
  const [checkedList,setCheckedList] = useState([])
  const [selectedItem, setSelectedItem] = useState([])
  const [leftListData, setLeftListData] = useState([])
  const [centerListData, setCenterListData] = useState([])
  const [rightListData, setRightListData] = useState([])
  const [componentTreeLength, setComponentTreeLength] = useState([])
  const [listDataOnlineNum,setListDataOnlineNum ] = useState(0)

  const { componentClassifyTreeData, listData, selectedComponents } = store
  const { setSelectedComponents, getListData } = store

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  };

  useEffect(()=>{
    let newTreeData = _.cloneDeep(toJS(componentClassifyTreeData))
    newTreeData = changeTreeData(componentClassifyTreeData,'id','key')
    newTreeData = changeTreeData(newTreeData,'name','title')
    setTreeData(newTreeData)
    let componentTreeLengthCount = 0
    newTreeData.forEach(item => {
      componentTreeLengthCount += item.children.length
    })
    setComponentTreeLength(componentTreeLengthCount);
  },[])

  const changeTreeData = (arrayJson,oldKey,newKey) => {
    let str = JSON.stringify(arrayJson)
    let reg = new RegExp(oldKey,'g')
    let newStr = str.replace(reg,newKey)
    return JSON.parse(newStr)
  }

  const handTreeClick = (selectedKeys,e) => {
    if(e.node.props.children.length > 0){
      return
    } else {
      setIsDisplayCheckbox(true)
      getListData({subCategory:selectedKeys[0],pageSize:2000})
      setCheckAll(false)
    }
    setCheckedList([])
  }

  const removeDuplicateObj = (arr) => {//去重函数
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      obj[next.id] ? "" : (obj[next.id] = true && newArr.push(next));
      return newArr;
    }, []);
    return arr;
  };

  const onCheckAllChange = e =>{
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    let selectedArr = []
    let slectedIdArr = []
    centerListData.forEach((item)=>{
      if(item.developStatus==='online' && !(item.accountId && item.accountId===-1)){
        selectedArr.push(item)
        slectedIdArr.push(item.id)
      }
    }) 
    setCheckedList(e.target.checked?selectedArr:[])
    if(e.target.checked){
      if(selectedComponents.length === 0){
        setSelectedComponents(slectedIdArr)
        setSelectedItem(selectedArr)
      } else {
        setSelectedComponents(Array.from(new Set([...selectedComponents,...slectedIdArr])))
        setSelectedItem(removeDuplicateObj([...selectedItem,...selectedArr]))
      }
    } else {
      let copyselectedComponents = _.cloneDeep(toJS(selectedComponents))
      let copySelectedItem = _.cloneDeep(toJS(selectedItem))
      centerListData.forEach((value)=>{
        copyselectedComponents = copyselectedComponents.filter((item)=>{
          return item !== value.id
        })
        copySelectedItem = copySelectedItem.filter((item)=>{
          return item.name !== value.name
        })
      })
      setSelectedItem(copySelectedItem)
      setSelectedComponents(copyselectedComponents)
    }
  }

  const onChangeCheckbox = checkedList => {
    setIndeterminate(!!checkedList.length && checkedList.length < listDataOnlineNum)
    setCheckAll(checkedList.length === listDataOnlineNum)
    setCheckedList(checkedList)
  }

  const checkState = e => {
    if(e.target.checked){
      if(selectedComponents.length === 0){
        setSelectedComponents([e.target.value.id])
        setSelectedItem([e.target.value])
      } else {
        setSelectedComponents([...selectedComponents,e.target.value.id])
        setSelectedItem(removeDuplicateObj([...selectedItem,e.target.value]))
      }
    } else {
      deleteComponent(e.target.value)
    }
  }

  const deleteComponent = value =>{
    setCheckAll(false)
    if(selectedItem.length === 1){
      setIndeterminate(false)
    } else {
      setIndeterminate(true)
    }
    setSelectedItem(selectedItem.filter((item)=>{
      return item.name !== value.name
    }))
    setCheckedList(checkedList.filter((item)=>{
      return item.name !== value.name
    }))
    setSelectedComponents(selectedComponents.filter((item)=>{
      return item !== value.id
    }))
  }

  useEffect(()=>{
    setLeftListData(_.cloneDeep(toJS(treeData)))
  },[treeData])
  useEffect(()=>{
    setCenterListData(_.cloneDeep(toJS(listData)))
    let count = 0
    listData.forEach(item=>{
      if(item.developStatus==='online' && !(item.accountId && item.accountId===-1)){
        count += 1
      }
    })
    setListDataOnlineNum(count)
  },[listData])
  useEffect(()=>{
    setRightListData(_.cloneDeep(toJS(selectedItem)))
  },[selectedItem])

  const leftSearchChange = e =>{
    const {value} = e.target
    let copyLeftData = _.cloneDeep(toJS(treeData))
    if(!value){
      setExpandedKeys([])
      return setLeftListData(copyLeftData)
    } else {
      let filterTreeData = copyLeftData.filter((item)=>{
        if(item.children&&item.children.length > 0){
          item.children = item.children.filter((item2)=>{
            return item2.title.indexOf(value) !== -1
          })
        }
        return item.children.length > 0
      })
      setLeftListData(filterTreeData)
      setExpandedKeys(filterTreeData.map((item)=>item.key))
    }
    setAutoExpandParent(true)
  }

  const centerSearchChange = (value) =>{
    setCheckAll(false)
    setIndeterminate(false)
    let copyLeftData = _.cloneDeep(toJS(listData))
    if(!value){
      return setCenterListData(copyLeftData)
    } else {
      setCenterListData(copyLeftData.filter((item)=>{
        return item.name.indexOf(value) !== -1
      }))
    }
  }

  const rightSearchChange = value =>{
    let copyLeftData = _.cloneDeep(toJS(selectedItem))
    if(!value){
      return setRightListData(copyLeftData)
    } else {
      setRightListData(copyLeftData.filter((item)=>{
        return item.name.indexOf(value) !== -1
      }))
    }
  }

  return(
    <div className={styles.chooseSourceContent}>
      <div className={styles.leftList}>
        <div className={styles.optional}>组件分类列表 可选项({componentTreeLength})</div>
        <div>
          <div className={styles.componentSearch}>
            <Search placeholder="搜索组件分类" onChange={leftSearchChange} />
          </div>
          <div className={styles.componentTree}>
            <Tree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              treeData={leftListData}
              onSelect={handTreeClick}
            >
            </Tree>
          </div>
        </div>
      </div>
      <div className={styles.centerList}>
      {isDisplayCheckbox?
        <div>
          <div style={{ borderBottom: '1px solid #E9E9E9',padding:'0 0 0 10px' }}>
            <Checkbox
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              组件列表 可选项({checkedList.length}/{listData.length})
            </Checkbox>
          </div>
          <div className={styles.searchWrap}>
            <Input placeholder='搜索组件' value={centerSearchValue} suffix={<Icon type="search" />}
              onChange={(e)=>{
                setCenterSearchValue(e.target.value);
                centerSearchChange(e.target.value);
              }}
            ></Input>
          </div>
          <div className={styles.listPosition}>
            <CheckboxGroup
              value={checkedList}
              onChange={onChangeCheckbox}
            >
              <Row className={styles.exportConfigCheckBoxStyle}>
                {centerListData.map((item)=>{
                  return(
                    <Col span={8}>
                      <Checkbox
                        value={item}
                        onChange={checkState}
                        className={styles.checkBoxStyle}
                        title={item.name}
                        disabled={(item.developStatus==='online' && !(item.accountId && item.accountId===-1))?false:true}
                      >{item.name}</Checkbox>
                    </Col>)
                })}
              </Row>
            </CheckboxGroup>
          </div>
        </div>:<></>
      }
      </div>
      <div className={styles.rightList}>
        {selectedItem.length>0?
          <div>
            <div className={styles.optional}>已选中待导出组件({selectedItem.length})</div>
            <div className={styles.searchWrap}>
              <Input placeholder='搜索待导出组件' value={rightSearchValue} suffix={<Icon type="search" />}
                onChange={(e)=>{
                  setRightSearchValue(e.target.value);
                  rightSearchChange(e.target.value);
                }}
              ></Input>
            </div>
            <List
              className={styles.rightListContent}
              dataSource={rightListData}
              renderItem={item => (
                <List.Item className={styles.waitExportApp} title={item.name}>
                  <span>{item.name}</span>
                  <Icon type="close" onClick={()=>{
                    deleteComponent(item)
                  }} />
                </List.Item>
              )}
            />
            </div>
          :<></>
        }
      </div>
    </div>
  )
})

export default ImportComponent