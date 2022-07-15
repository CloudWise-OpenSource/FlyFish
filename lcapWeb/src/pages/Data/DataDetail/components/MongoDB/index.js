
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { observer,loadingStore, toJS } from "@chaoswise/cw-mobx";
import _ from "lodash";
import { Button, Table, message,Skeleton,Tooltip,Collapse } from "@chaoswise/ui";
const { Panel } = Collapse;
import DataTable from './components/selectTable';
import MenuStore from '../handleMenu/model';
import store from './model';
import { successCode } from "@/config/global";
import TreeStore from '../handleMenu/model';
import RedisTable from '../../../components/redisTable';
import LongTable from '@/pages/Data/components/LongTable';

const HandleMenu = observer(({ activeContent, bottomTable, tableList, tableId,onChange

}) => {
  let [headerArr, setHeader] = useState([{ name: 'keyDelimiter', default: ',', state: true, key: Math.random() },
  { name: 'dataFormat', default: 'raw', state: false, key: Math.random() }]);
  let [rawFlag,setRawFlag]=useState(false);
  let [valueArr, setValueArr] = useState([{ name: '', default: '', state: true, key: Math.random() }]);
  const { changeOutside } = store;
  const { addGetTreeList,checkIndex, resetTreeList} = TreeStore;
  const loading = loadingStore.loading["DataDetailStore/getTableList"];
  const uploadLoading = loadingStore.loading["HandelMenuStore/changeOutside"];
  useEffect(()=>{
    if(headerArr[1].default=='raw'){
      setRawFlag(true);
    }else{
      setRawFlag(false);
    }
  },[headerArr]);
  const columns = [
    {
      title: '字段',
      dataIndex: 'name',
      key: 'name',
      width:'50%'
    },
    {
      title: '数据类型',
      dataIndex: 'value',
      key: 'value', align: 'left'
    },
  ];
  const save = () => {
    // 校验数据是否有空
    let headerObj = {};
    let paramsObj = {};
    let errorFlag=false;
    headerArr.map(item => {
      headerObj[item.name]=item.default;

    });
    let justValue=[];
    valueArr.map(item=>justValue.push(item.name));
    if( Array.from(new Set(justValue)).length<justValue.length){
      message.error('相同的key值会被覆盖,请修改key值!');
      return;
    }
    valueArr.map((item,index) => {
      paramsObj[item.name]=item.default;
      if(index!==valueArr.length-1){
        if(!item.name||!item.default){
          errorFlag=true;
          return;
        } 
      }else{
        if(item.name&&!item.default||!item.name&&item.default){
          errorFlag=true;
          return;
        } 
      }
    });
    if(errorFlag){
      message.error('表结构字段请填写完整');
      return;
    }
      changeOutside({
        datasourceId:activeContent&& activeContent.datasourceId,
        tableId,
        tableName: MenuStore.editName,
        tableMeta: {
          ...headerObj,
          fields : paramsObj
        }

    }, (res) => {
        if (res.code == successCode) {
            message.success('修改数据表成功!');
            addGetTreeList({
                datasourceId: activeContent.datasourceId
            },(data)=>{
                    onChange(resetTreeList&&resetTreeList[checkIndex]&&resetTreeList[checkIndex].tableName);
            });
        } else {
            message.error(res.msg || '修改数据表失败,请重试!');
        }

    });
  };
  useEffect(()=>{
    setHeader([{ name: 'keyDelimiter', default: ',', state: true, key: Math.random() },
    { name: 'dataFormat', default: 'raw', state: false, key: Math.random() }]);
    setValueArr([{ name: '', default: '', state: true, key: Math.random() }]);
  },[tableList]);
  return (
    <div >
      {
        !loading&&tableList && tableList.length > 0 && <>
         <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            className="site-collapse-custom-collapse"
          >
            <Panel header={resetTreeList&&resetTreeList[checkIndex]&&resetTreeList[checkIndex].tableName} key="1" style={{ border: 'none' }}>
            <Table dataSource={tableList} columns={columns} pagination={false} rowKey='name' />
            </Panel>
          </Collapse>
          <Collapse
            defaultActiveKey={['1']}
            bordered={false}
            className="site-collapse-custom-collapse"
          >
            <Panel header='数据预览' key="1" style={{ border: 'none' }}>
            <LongTable columns={tableList} data={bottomTable} />
            </Panel>
          </Collapse>
        </>
      }
      {
       loading&&<Skeleton active paragraph={{ rows: 12 }}/>
      }
      {
        activeContent &&!activeContent.keyDelimiter&&tableId&& <>
          <RedisTable title='处理参数' columnsTitle={['key值', 'value值']}
            tableData={headerArr}
            setActiveContent={setHeader}
          ></RedisTable>
         {
           !rawFlag&& <DataTable title='表结构字段' columnsTitle={['key值', 'value值类型']}
            tableData={valueArr}
            setActiveContent={setValueArr}
          ></DataTable>
         }
          <Button onClick={() => { save(); }} type="primary" loading={uploadLoading}>保存</Button>
        </>
      }

    </div>
  );

});

export default HandleMenu;