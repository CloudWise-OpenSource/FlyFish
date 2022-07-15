import React, { useEffect, useState } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx'
import { Input, Radio, Checkbox, Row, Col, Icon, List } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";

const CheckboxGroup = Checkbox.Group;

const ImportComponent = observer((props)=>{
  const [leftSearchValue, setLeftSearchValue] = useState('');
  const [centerSearchValue, setCenterSearchValue] = useState('');
  const [rightSearchValue, setRightSearchValue] = useState('');
  const [indeterminate,setIndeterminate] = useState(false)
  const [checkAll,setCheckAll] = useState(false)
  const [checkedList,setCheckedList] = useState([])
  const [isDisplayCheckbox, setIsDisplayCheckbox] = useState(false)
  const [selectedItem, setSelectedItem] = useState([])
  const [leftListData, setLeftListData] = useState([])
  const [centerListData, setCenterListData] = useState([])
  const [rightListData, setRightListData] = useState([])
  const [listDataOnlineNum,setListDataOnlineNum ] = useState(0)

  const { projectsData, applicationList, selectedApp } = store
  const { getApplicationList, setSelectedApp } = store

  const onChangeRadio = async e => {
    getApplicationList({projectId:e.target.value,pageSize:2000})
    setIsDisplayCheckbox(true)
    setCheckedList([])
    setCheckAll(false)
  };

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  const onChangeCheckbox = checkedList => {
    setIndeterminate(!!checkedList.length && checkedList.length < listDataOnlineNum)
    setCheckAll(checkedList.length === listDataOnlineNum)
    setCheckedList(checkedList)
  };
  const removeDuplicateObj = (arr) => {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      obj[next.id] ? "" : (obj[next.id] = true && newArr.push(next));
      return newArr;
    }, []);
    return arr;
  };

  const onCheckAllChange = e => {
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    let selectedArr = []
    let slectedIdArr = []
    centerListData.forEach((item)=>{
      if(!(item.from && item.from==='lcap-init')){
        selectedArr.push(item)
        slectedIdArr.push(item.id)
      }
    }) 
    setCheckedList(e.target.checked?selectedArr:[])
    if(e.target.checked){
      if(selectedApp.length === 0){
        setSelectedApp(slectedIdArr)
        setSelectedItem(selectedArr)
      } else {
        setSelectedApp(Array.from(new Set([...selectedApp,...slectedIdArr])))
        setSelectedItem(removeDuplicateObj([...selectedItem,...selectedArr]))
      }
    } else {
      let copySelectedApp = _.cloneDeep(toJS(selectedApp))
      let copySelectedItem = _.cloneDeep(toJS(selectedItem))
      centerListData.forEach((value)=>{
        copySelectedApp = copySelectedApp.filter((item)=>{
          return item !== value.id
        })
        copySelectedItem = copySelectedItem.filter((item)=>{
          return item.name !== value.name
        })
      })
      setSelectedItem(copySelectedItem)
      setSelectedApp(copySelectedApp)
    }
  }

  const checkState = e => {
    if(e.target.checked){
      if(selectedApp.length === 0){
        setSelectedApp([e.target.value.id])
        setSelectedItem([e.target.value])
      } else {
        setSelectedApp([...selectedApp,e.target.value.id])
        setSelectedItem(removeDuplicateObj([...selectedItem,e.target.value]))
      }
    } else {
      deleteApp(e.target.value)
    }
  }

  const deleteApp = value => {
    setSelectedItem(selectedItem.filter((item)=>{
      return item.name !== value.name
    }))
    setCheckedList(checkedList.filter((item)=>{
      return item.name !== value.name
    }))
    setSelectedApp(selectedApp.filter((item)=>{
      return item !== value.id
    }))
    setCheckAll(false)
    setIndeterminate(false)
  }

  useEffect(()=>{
    setLeftListData(_.cloneDeep(toJS(projectsData)))
  },[])
  useEffect(()=>{
    setCenterListData(_.cloneDeep(toJS(applicationList)))
    let count = 0
    applicationList.forEach(item=>{
      if(!(item.from && item.from==='lcap-init')){
        count += 1
      }
    })
    setListDataOnlineNum(count)
  },[applicationList])
  useEffect(()=>{
    setRightListData(_.cloneDeep(toJS(selectedItem)))
  },[selectedItem])

  const leftSearchChange = (value) =>{
    let copyLeftData = _.cloneDeep(toJS(projectsData))
    if(!value){
      return setLeftListData(copyLeftData)
    } else {
      setLeftListData(copyLeftData.filter((item)=>{
        return item.name.indexOf(value) !== -1
      }))
    }
  }

  const centerSearchChange = (value) =>{
    setCheckAll(false)
    setIndeterminate(false)
    let copyLeftData = _.cloneDeep(toJS(applicationList))
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
        <div className={styles.optional}>项目列表 可选项({leftListData.length})</div>
        <div className={styles.searchWrap}>
          <Input placeholder='搜索项目' value={leftSearchValue} suffix={<Icon type="search" />}
            onChange={(e)=>{
              setLeftSearchValue(e.target.value)
              leftSearchChange(e.target.value);
            }}
          ></Input>
        </div>
        <div className={styles.listPosition}>
          <Radio.Group onChange={onChangeRadio}>
            {leftListData.map((item)=>{
              return <Radio style={radioStyle} value={item.id}>
                {item.name}
              </Radio>
            })}
          </Radio.Group>
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
              应用列表 可选项({checkedList.length}/{applicationList.length})
            </Checkbox>
          </div>
          <div className={styles.searchWrap}>
            <Input placeholder='搜索应用' value={centerSearchValue} suffix={<Icon type="search" />}
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
                        disabled={!(item.from && item.from==='lcap-init')?false:true}
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
            <div className={styles.optional}>已选中待导出应用({selectedItem.length})</div>
            <div className={styles.searchWrap}>
              <Input placeholder='搜索待导出应用' value={rightSearchValue} suffix={<Icon type="search" />}
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
                    deleteApp(item)
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