import React, { useEffect, useState } from 'react';
import {observer} from '@chaoswise/cw-mobx'
import { Result, Button, Table, Modal } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";

const ImportSuccess = observer((props) => {
  const [ resultModalShow, setResultModalShow ] = useState(false)
  const { setImportSuccess, importSourceList, selectedRows, setImportTableData, importFailedMsg } = store

  const backToExportOrImport = () => {
    props.history.push({pathname:`/app/apply-develop`,state:{name:"批量导入导出"}});
    setImportTableData([])
  }

  const showResultModal = () =>{
    setResultModalShow(true)
  }

  const handleOk = () => {
    setResultModalShow(false);
  };
  const handleCancel = () => {
    setResultModalShow(false);
  };

  useEffect(()=>{
    setImportSuccess(false)
  },[])

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: '组件名称/应用名称',
      dataIndex: 'name',
      key: 'name',
    }
  ]

  const datasource = importSourceList.map((item,index) => {
    return {
      key:index,
      index:index + 1,
      name:item
    }
  })
  
  return(
    <div className={styles.exportSuccessStyle}>
      {importSourceList.length > 0?
        <>
          <Result
            status="error"
            title="导入失败"
            subTitle={selectedRows.length === importSourceList.length?<span>全部文件导入失败，请检查导入文件</span>:<><span>本次成功导入{selectedRows.length - importSourceList.length}条数据，导入失败{importSourceList.length}条数据</span><a onClick={showResultModal}>查看失败详情</a></>}
            extra={[
              <Button type="primary" key="backToExportOrImport" onClick={backToExportOrImport}>返回导入导出管理</Button>,
            ]}
          />
        </>
        :importFailedMsg.length > 0?
        <>
          <Result
            status="error"
            title="导入失败"
            subTitle={<span>{importFailedMsg}</span>}
            extra={[
              <Button type="primary" key="backToExportOrImport" onClick={backToExportOrImport}>返回导入导出管理</Button>,
            ]}
          />
        </>
        :<>
          <Result
            status="success"
            title="导入成功"
            subTitle={<span>本次成功导入{selectedRows.length}条数据,导入失败0条数据</span>}
            extra={[
              <Button type="primary" key="backToExportOrImport" onClick={backToExportOrImport}>返回导入导出管理</Button>,
            ]}
          />
        </>
      }
      
      <Modal
        title="导入失败详情"
        visible={resultModalShow}
        onOk={handleOk}
        onCancel={handleCancel}
        size='middle'
        mask
      >
        <Table columns={columns} dataSource={datasource} bordered></Table>
      </Modal>
    </div>
    
  )
})

export default ImportSuccess