import React, { useEffect, useState } from 'react';
import {observer} from '@chaoswise/cw-mobx'
import { Checkbox, Row, Col, Radio,Form } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";

const ExportConfig = observer((props)=>{

  const { componentOrApp, exportRadioData, exportCheckboxData} = store
  
  let isSplitComponentModuleFlag

  useEffect(()=>{
    isSplitComponentModuleFlag = window.LCAP_CONFIG.isSplitComponentModule?'none':'block'
    console.log(isSplitComponentModuleFlag);
  },[])
  
  return (
    <>
      <Form>
        {componentOrApp === 'component' ? <></>:
          <Form.Item name="appPackageParams" label="应用打包参数" >
              <Radio value="appAndComponent" checked>同时导出应用和组件</Radio>
          </Form.Item>
        }
        <Form.Item name="componentPackageParams" label="组件打包参数" >
            <Row className={styles.exportConfigCheckBoxStyle}>
            <Col span={8}>
                <Checkbox value="componentRelease" style={{ lineHeight: '32px' }} checked disabled>
                  组件安装包
                </Checkbox>
              </Col>
            </Row>
        </Form.Item>
      
      </Form>
    </>
  )
})

export default Form.create({name:'exportConfig'})(ExportConfig)