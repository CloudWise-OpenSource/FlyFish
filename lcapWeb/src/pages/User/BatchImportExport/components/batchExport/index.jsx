import React,{ useEffect, useState } from 'react';
import styles from "../../assets/style.less";
import { observer } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import { Steps, Button, message } from '@chaoswise/ui';
import ExportTransfer from '../exportTransfer'
import ExportConfig from '../exportConfig'
import axios from 'axios'

const { Step } = Steps;

const BatchExport = observer((props)=>{
  const { componentOrApp, selectedComponents, selectedApp } = store
  const { setSelectedComponents, setSelectedApp } = store
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: '资源配置',
      content: <ExportTransfer onRef={(ref)=>{exportTransferSubmit=ref}}></ExportTransfer>,
    },
    {
      title: '导出配置',
      content: <ExportConfig></ExportConfig>,
    },
  ];

  const exportTransferSubmit = ()=>{
    if((componentOrApp === 'component' && selectedComponents.length >= 1)||(componentOrApp === 'app' && selectedApp.length >= 1)){
      return true
    } else {
      let messageText = componentOrApp === 'component'?'组件':'应用'
      message.error("请至少选择一个" + messageText)
      return false
    }
  }

  const next = () => {
    if(exportTransferSubmit()){
      setCurrent(current + 1);
    } 
  };

  const prev = () => {
    setCurrent(current - 1);
    setSelectedComponents([])
    setSelectedApp([])
  };

  const handleExport = () => {
    props.history.push({pathname:`/user/exportSuccess/batch-import-export`,state:{name:"导出成功"}});
  }

  useEffect(()=>{
    setSelectedApp([])
  },[])

  return (
    <>
      <Steps current={current} style={{padding:'16px 0',borderTop: '1px solid #e8e8e8'}}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className={"steps-action " + styles.stepBtnPosition}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button type="primary" style={{ margin: '0 8px' }} onClick={() => prev()}>
            上一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleExport}>
            导出
          </Button>
        )}
      </div>
    </>
  );
});

export default BatchExport;