import React, { useEffect, useState } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx'
import { Transfer, Tree, Select, Button, message, Form } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";
import ExportComponent from '../exportCompoent'
import ExportApp from '../exportApp'


const { TreeNode } = Tree;
const { Option } = Select;

const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(item => (
    <TreeNode title={item.title} key={item.key} dataRef={item} disabled={checkedKeys.includes(item.key)}>
      {generateTree(item.children, checkedKeys)}
    </TreeNode>
  ));
};


const ExportTransfer = observer((props)=>{
  const { componentOrApp } = store
  const { setComponentOrApp, getComponentClassifyTreeData, getProjectsData, setExportCheckboxData, setExportRadioData, setSelectedComponents, setSelectedApp } = store
  
  const { getFieldDecorator } = props.form;

  useEffect(()=>{
    setComponentOrApp('component')
    setExportCheckboxData(['componentRelease'])
    setExportRadioData('appAndComponent')
    setSelectedComponents([])
    setSelectedApp([])
  },[])

  const handleChange = (e)=>{
    setComponentOrApp(e)
    if(componentOrApp === 'app'){
      getComponentClassifyTreeData()
    } else {
      getProjectsData()
    }
  }

  return (
    <>
      <Form>
        <Form.Item label="选择资源" className={styles.exportTransferLable}>
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: '请选择资源类型！'
              }
            ],
            initialValue:"导出组件"
          })(<Select style={{ width: 240 }} onChange={ handleChange }>
            <Option value="component">导出组件</Option>
            <Option value="app">导出应用</Option>
          </Select>)}
        </Form.Item>
        <Form.Item label={componentOrApp==='app'?'选择应用':'选择组件'} className={styles.exportTransferLable}>
          {getFieldDecorator('components', {
            rules: [
              {
                required: true,
                message: '请选择两个以上组件！'
              }
            ]
          })(componentOrApp==='component'?<ExportComponent></ExportComponent>:<ExportApp></ExportApp>)}
        </Form.Item>
      </Form>
    </>
  );
})

export default Form.create({name:'exportTransfer'})(ExportTransfer);