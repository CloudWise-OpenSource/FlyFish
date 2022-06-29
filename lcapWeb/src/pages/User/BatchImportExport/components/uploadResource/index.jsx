import React, { useEffect, useState } from 'react';
import {observer} from '@chaoswise/cw-mobx'
import { Upload, Spin, Progress, Icon, message, DemoShow, Space } from '@chaoswise/ui';
import styles from "./style.less";
import store from "../../model/index";
import API from '../../../../../services/api';

const { Dragger } = Upload;

const UploadingResource = observer((props) => {
  const [uploadFileInfo, setUploadFileInfo] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);

  const { setUploadFileName, setUploadSuccess, setPreviouStepFlag, setIsAppHasComponent, setImportTableData, setSelectedRows } = store

  const handleUploadFile = (({file,fileList,event})=>{
    setUploadFileInfo(file);
    setUploadFileName(file.name.replace('.zip',''))
    if (event){
      setUploadProgress(event.percent);
    }
    if(uploadProgress === 100) {
      setUploadSuccess(true)
      window.removeEventListener("beforeunload",window.handleBeforeunload)
    }else{
      window.addEventListener("beforeunload",window.handleBeforeunload);
    }
  })

  useEffect(()=>{
    window.handleBeforeunload = (event) => {
      event.returnValue = "文件上传中，退出可能无法完成上传操作";
      return "文件上传中，退出可能无法完成上传操作"
    }
    setIsAppHasComponent(false)
    setPreviouStepFlag(true)
    setImportTableData([])
    setSelectedRows([])
  },[])

  return(
    <>
      <div className={styles.UploadingResourcePosition}>
        <DemoShow
          description='仅支持压缩包类文件上传'>
          <Space
              direction="vertical"
              style={{
              width: '100%'
              }}
          >
          <Dragger
              accept=".zip"
              height={200}
              action={API.UPLOAD_RESOURCE_PACKAGE}
              headers={{ authorization: 'authorization-text' }}
              method="post"
              name="file"
              showUploadList={true}
              dropSingleFileUpload={true}
              beforeUpload={(file) => {
                if(file.name.substring(file.name.length - 4) !== '.zip'){
                  message.error('请上传zip文件')
                  return false
                }
                setUploadProgress(0);
              }}
              onChange={handleUploadFile}
          />
          </Space>
        </DemoShow>
      </div>
    </>
  )
})

export default UploadingResource