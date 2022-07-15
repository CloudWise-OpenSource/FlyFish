import React,{ useState,useEffect, useRef } from 'react';
import styles from "./style.less";
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import {Button, Result, message} from '@chaoswise/ui';
import globalStore from '@/stores/globalStore';
import axios from 'axios';
import exportImg from '../../assets/importIcon.png'

const ExportSuccess = observer((props) => {
  const [ exportSuccess, setExportSuccess] = useState(false)//导出达到100%后进行内容展示的转换
  const { progressNum, setProgressNum } = globalStore
  const { lastExportIsEnd, setLastExportIsEnd, setExportCheckboxData } = store
  const [ exportResAbnormal, setExportResAbnormal ] = useState(true)
  const [ exportTipsMsg, setExportTipsMsg ] = useState('')

  useEffect(()=>{
    axios.defaults.timeout = 0;
    return ()=>{
      axios.defaults.timeout = 50*1000;
    }
  },[])

  const backToExportOrImport = () => {
    setSelectedComponents([])
    setSelectedApp([])
    setExportCheckboxData(['componentRelease'])
    props.history.push({pathname:`/app/apply-develop`,state:{name:"批量导入导出"}});
  }

  const { componentOrApp, selectedApp, exportRadioData, exportCheckboxData, selectedComponents } = store
  const { setSelectedComponents, setSelectedApp} = store
  
  const exportCode = async (onProgress)=>{
    let requestUrl
    let param
    if(componentOrApp === 'app'){
      param = {ids:selectedApp,applicationExportType:exportRadioData,componentExportType:exportCheckboxData}
      requestUrl = `${window.LCAP_CONFIG.javaApiDomain}/api/dataplateform/resources/export/applications`
    } else {
      param = {ids:selectedComponents,componentExportType:exportCheckboxData}
      requestUrl = `${window.LCAP_CONFIG.javaApiDomain}/api/dataplateform/resources/export/components`
    }
    axios.post(requestUrl,param,{
      responseType: 'blob',
      onDownloadProgress: (event) => {
        onProgress(event);
      },
    }).then((res)=>{
      let reader = new FileReader();
      reader.readAsText(res.data, 'utf-8');
      reader.onload = function () {
        let exportResultIsError = false
        let resultMsg
        try {
          resultMsg = JSON.parse(reader.result)
          setExportTipsMsg(resultMsg.msg)
        } catch (e) {
          exportResultIsError = true
        }
        if(exportResultIsError){
          setExportSuccess(true)
          setLastExportIsEnd(true)
          setExportResAbnormal(true)
          setProgressNum(0)
          message.success('导出成功!');
          const $link = document.createElement("a");
          const exportPackgeUrl = window.URL.createObjectURL(res.data);
          $link.href = exportPackgeUrl;
          const disposition = res.headers['content-disposition'];
          $link.download = decodeURI(disposition.replace('attachment;filename=',''));
          document.body.appendChild($link);
          $link.click();
          document.body.removeChild($link); // 下载完成移除元素
          window.URL.revokeObjectURL($link.href); // 释放掉blob对象
        }else{
          setExportResAbnormal(false)
          setLastExportIsEnd(true)
          setProgressNum(0)
        }
      };
    },(reason)=>{
      setLastExportIsEnd(true)
      setProgressNum(0)
      setExportResAbnormal(false)
    });
  };

  useEffect(()=>{
    if(lastExportIsEnd){
      exportCode((event)=>{
        setProgressNum(parseInt((event.loaded/event.total)*100));
        setLastExportIsEnd(false)
      }).then(()=>{
        
      },(reason)=>{
        message.error('导出失败!');
      });
    }
  },[])

  const manualDownload = () =>{
    if(lastExportIsEnd){
      exportCode((event)=>{
        setProgressNum(parseInt((event.loaded/event.total)*100));
      }).then(()=>{
        
      },()=>{
        message.error('手动下载失败!');
      });
    }
  }
  
  return (
    <>
    {!exportSuccess && exportResAbnormal?
      <div className={styles.importProgress + ' ' + styles.exportSuccessStyle}>
        <div className={styles.importProgressIcon}>
          <img src={exportImg}/>
        </div>
        <div className={styles.importProgressText}>
          导出中...{progressNum + '%'}
        </div>
      </div>
      :exportResAbnormal?
      <Result
        className={styles.exportSuccessStyle}
        status="success"
        title="导出成功"
        subTitle="浏览器将会在导出成功后自动下载，如未开始请手动下载"
        extra={[
          <Button type="primary" key="manualDownload" onClick={manualDownload}>
            手动下载
          </Button>,
          <Button key="backToExportOrImport" onClick={backToExportOrImport}>返回导入导出管理</Button>,
        ]}
      />
      :<Result
        className={styles.exportSuccessStyle}
        status="error"
        title="导出失败"
        subTitle={exportTipsMsg}
        extra={[
          <Button key="backToExportOrImport" onClick={backToExportOrImport}>返回导入导出管理</Button>,
        ]}
      />
    }
      
      
    </>
  )
})

export default ExportSuccess