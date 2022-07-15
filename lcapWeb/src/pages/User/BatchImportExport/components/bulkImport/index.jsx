import React,{ useState,useEffect } from 'react';
import styles from "../../assets/style.less";
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import { Steps, Button, message, Modal } from '@chaoswise/ui';
import UploadingResource from '../uploadResource'
import ImportConfig from '../importConfig'

const { Step } = Steps;
const { confirm } = Modal;

const steps = [
  {
    title: '上传资源文件',
    content: <UploadingResource></UploadingResource>,
  },
  {
    title: '导入配置',
    content: <ImportConfig></ImportConfig>,
  },
];


const BulkImport = observer((props)=>{
  const [current, setCurrent] = useState(0);
  const { importSelectedNum, isUseLastImportSource, uploadSuccess, importSuccess, importTableData, isComponent,comsInAppTableData} = store
  const { setIsUseLastImportSource, setUploadSuccess, setIsAppHasComponent, setPreviouStepFlag, setComsInAppTableData, setImportTableData, setImportFailedMsg } = store
  const { importComOrApp, selectedRows, isAppHasComponent, previouStepFlag } = store

  const next = () => {
    if(uploadSuccess){
      setCurrent(current + 1);
      setUploadSuccess(false)
    }  else {
      message.error("请上传文件或等待文件上传完毕")
    }
  };

  const prev = () => {
    if(previouStepFlag){
      setCurrent(current - 1);
      setIsAppHasComponent(false)
      setImportTableData([])
    } else {
      setIsAppHasComponent(true)
      setPreviouStepFlag(true)
    }
    
  };

  const handleImport = () => {
    let validataFlag = true
    if(isComponent){
      selectedRows.forEach(item => {
          if((item.projects == null || item.projectsName == null) && item.type !== 'common'){
            validataFlag = false
            message.error('请选择'+item.name+'组件所属项目')
          }
      });
    } else {
      if(!isAppHasComponent&&!previouStepFlag){
        comsInAppTableData.forEach(item => {
          if((item.projects.length === 0 || item.projectsName.length === 0) && item.type !== 'common'){
            validataFlag = false
            message.error('请选择'+item.name+'组件所属项目')
          }
      });
      } else {
        selectedRows.forEach(item => {
          if(item.projectName == null ||item.projectId == null){
            message.error('请选择'+item.name+'应用所属项目')
          }
        });
      }
    }
    if(importSelectedNum > 0){
      if(validataFlag){
        let selectedRowsCopy = _.cloneDeep(toJS(selectedRows));
        if(isComponent){
          selectedRowsCopy.map(item => {
            if(item.type === 'common'){
              item.projects = [];
              item.projectsName = [];
            }
          });
        } else {
          selectedRowsCopy.map(item => {
            if(item.components != null){
              item.components.map(element => {
                if(element.type === 'common'){
                  element.projects = [];
                  element.projectsName = [];
                }
              });
            }
          });
        }
        importComOrApp(selectedRowsCopy)
        setImportTableData([])
      }
    } else {
      message.error('请勾选后再进行导入')
    }
  }

  const handleApplicationComponent = () => {
    if(importSelectedNum > 0){
      selectedRows.forEach(item => {
        if(item.projectName === '' ||item.projectId === ''){
          message.error('请选择'+item.name+'应用所属项目信息')
        }
      });
      setIsAppHasComponent(false)
      setPreviouStepFlag(false)
      jointComsInAppTableData()
    } else {
      message.error('请勾选后再进行下一步')
    }
  }

  const jointComsInAppTableData = () =>{
    let jointdata = []
    if(isAppHasComponent){
      importTableData.forEach(item => {
        if(item.components !== null){
          jointdata = [...jointdata,...item.components]
        }
      });
    }
    jointdata = removeDuplicateObj(jointdata)
    jointdata.map(item => {
      importTableData.forEach(element => {
        if(element.components !== null){
          element.components.forEach(eleItem => {
            if(item.id === eleItem.id){
              item.appName = item.appName?(item.appName+ '、' + element.name):element.name
            }
          })
        }
      });
    })
    console.log(importTableData);
    setComsInAppTableData(jointdata)
  }

  const removeDuplicateObj = (arr) => {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      obj[next.id] ? "" : (obj[next.id] = true && newArr.push(next));
      return newArr;
    }, []);
    console.log('arr',arr);
    return arr;
  };

  useEffect(()=>{
    if(importSuccess){
      setIsUseLastImportSource(false)
      props.history.push({pathname:`/user/importSuccess/batch-import-export`,state:{name:"导入成功"}});
    }
  },[importSuccess])

  useEffect(()=>{
    if(isUseLastImportSource){
      confirm({
        title: '需要使用上次导入资源吗',
        content: '需要使用上次导入资源吗',
        onOk() {
          window.removeEventListener("beforeunload",window.handleBeforeunload)
          setCurrent(current + 1);
        },
        onCancel() {
          setUploadSuccess(false)
        },
        centered:true,
        className:styles.confirmStyle
      });
    }
    setImportFailedMsg('')
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
          <Button type="primary" onClick={() => next()} key='importNext'>
            下一步
          </Button>
        )}
        {current > 0 && (
          <Button type="primary" style={{ margin: '0 8px' }} onClick={() => prev()} key='importPrev'>
            上一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <>
            {isAppHasComponent?
              <Button type="primary" onClick={ handleApplicationComponent } key='appsComponents'>
                下一步
              </Button>
              :<Button type="primary" onClick={handleImport} key='components'>
                导入
              </Button>
            }
          </>
        )}
      </div>
    </>
  );
});

export default BulkImport;