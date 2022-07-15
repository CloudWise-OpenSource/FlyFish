import React, { useEffect, useState } from 'react';
import {observer} from '@chaoswise/cw-mobx'
import { Checkbox, Row, Col, Radio,Form } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";

const ExportConfig = observer((props)=>{

  const { componentOrApp, exportRadioData, exportCheckboxData} = store
  const { setExportCheckboxData, setExportRadioData } = store
  const [ isDisplayComponentPackageParams, setIsDisplayComponentPackageParams] = useState(false)//控制导出应用时组件打包参数显隐
  const [ isNodeModuleDisable, setIsNodeModuleDisable] = useState(true)//控制组件打包参数编译源码环境文件是否可选
  const [ checkboxCheckedItems, setCheckboxCheckedItems] = useState('componentRelease')//控制组件打包参数选中项

  let isSplitComponentModuleFlag

  const checkBoxChange = (checkedValues) =>{
    
    //导出配置组件打包参数逻辑
    if(checkedValues.includes("componentSource")){
      setIsNodeModuleDisable(false)
    } else {
      setIsNodeModuleDisable(true)
      if(checkedValues.includes("componentNodeModules")){
        checkedValues.pop()
      }
    }
    if(!checkedValues.includes("componentRelease")){
      checkedValues = ['componentRelease', ...checkedValues]
    }
    setExportCheckboxData(checkedValues)
    setCheckboxCheckedItems(checkedValues)
  }

  const radioChange = (e) =>{
    if(e.target.value === 'appOnly'){
      setIsDisplayComponentPackageParams(false)
    } else {
      setIsDisplayComponentPackageParams(true)
    }
    setExportRadioData(e.target.value)
  }

  useEffect(()=>{
    if(componentOrApp === "component"){
      setIsDisplayComponentPackageParams(true)
    }
    
    isSplitComponentModuleFlag = window.LCAP_CONFIG.isSplitComponentModule?'none':'block'
    console.log(isSplitComponentModuleFlag);
  },[])
  
  return (
    <>
      <Form>
        {componentOrApp === 'component'?<></>:
          <Form.Item name="appPackageParams" label="应用打包参数" >
            <Radio.Group onChange={radioChange} value={exportRadioData} className={styles.exportConfigRadioStyle}>
              <Radio value="appOnly">仅导出应用</Radio>
              <Radio value="appComponentOnly">仅导出应用使用的组件</Radio>
              <Radio value="appAndComponent">同时导出应用和组件</Radio>
            </Radio.Group>
          </Form.Item>
        }
        {isDisplayComponentPackageParams?
        <Form.Item name="componentPackageParams" label="组件打包参数" >
          <Checkbox.Group onChange={checkBoxChange} value={checkboxCheckedItems}>
            <Row className={styles.exportConfigCheckBoxStyle}>
            <Col span={8}>
                <Checkbox value="componentRelease" style={{ lineHeight: '32px' }} disabled>
                  组件安装包
                </Checkbox>
              </Col>
              {window.LCAP_CONFIG.isSplitComponentModule?<></>
              :<>
                <br />
                <Col span={8}>
                  <Checkbox value="componentSource" style={{ lineHeight: '32px' }}>
                    组件源码
                  </Checkbox>
                </Col>
                <br />
                <Col span={8}>
                  <Checkbox value="componentNodeModules" style={{ lineHeight: '32px' }} disabled={isNodeModuleDisable}>
                    编译源码环境文件
                  </Checkbox>
                </Col>
              </>}
            </Row>
          </Checkbox.Group>
        </Form.Item>:<></>
      }
      </Form>
    </>
  )
})

export default Form.create({name:'exportConfig'})(ExportConfig)