import React, { useState, useRef, useEffect } from 'react';
import styles from './style.less';
import { Button,message,Modal,Popover,Spin } from 'antd';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { installPackagesService,compileComponentService } from '../../services';
import ReleaseComponent from './releaseComponent';
import ComponentRecord from '../componentRecord';

const CodeDevelop = observer((props)=>{
  const {
    setDeveloping,
    releaseModalVisible,
    setReleaseModalVisible,
    getListData,
    showRecord,
    setShowRecord
  } = store;
  const { developingData } = store;

  // if (!developingData.id) {
  //   props.history.push('/app/component-develop');
  // }

  const [previewRandom, setPreviewRandom] = useState(0);
  const [layout, setLayout] = useState('row');
  const [moveMode, setMoveMode] = useState(false);
  const [layerX, setLayerX] = useState(0);
  const [layerY, setLayerY] = useState(405);
  const mainDiv = useRef();
  const [compileSping, setCompileSping] = useState(false);
  const [installing, setInstalling] = useState(false);

  const componentId = useRef();

  useEffect(() => {
    componentId.current = window.location.hash.match(/\/app\/(.*)\/code-develop/)[1];
    if (window.compileListener) { 
      window.removeEventListener('message',window.compileListener);
    }
    const compileListener = (event)=>{
      if (event && event.data) {
        if ("vscode_compile" ===event.data.event) {
          //编译
          compileComponent();
        }
      }
    };
    window.compileListener = compileListener;
    window.addEventListener('message',compileListener);
    if (mainDiv.current) {
      setLayerX(mainDiv.current.clientWidth/2 - 5);
    }
  }, []);
  const installPackages = async ()=>{
    setInstalling(true);
    const res = await installPackagesService(componentId.current);
    if (res && res.code===0) {
      setInstalling(false);
      message.success('依赖安装成功!');
    }else{
      setInstalling(false);
      message.error(res.msg);
    }
  };
  const compileComponent = async ()=>{
    setCompileSping(true);
    const res = await compileComponentService(componentId.current);
    if (res && res.code===0) {
      message.success('编译成功!');
      // setPreviewRandom(Math.random());
      const frame= document.getElementsByName('preview')[0];
      frame.contentWindow.postMessage('vscode_compile',frame.src);
      setCompileSping(false);
    }else{
      message.error(res.msg);
      setCompileSping(false);
    }
  };
  const LayoutRowIcon = ()=>(
    <svg className="icon" width="20px" height="20px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M921.6 614.4a102.4 102.4 0 0 1 102.4 102.4v204.8a102.4 102.4 0 0 1-102.4 102.4h-204.8a102.4 102.4 0 0 1-102.4-102.4v-204.8a102.4 102.4 0 0 1 102.4-102.4h204.8zM78.3872 524.8l9.728 16.64c1.024 3.3792 2.3552 18.688 3.1744 24.4224a435.2 435.2 0 0 0 74.6496 186.0096 420.352 420.352 0 0 0 64.256 71.7824c77.1072 68.5056 153.4464 101.0176 229.8368 99.4816a38.4 38.4 0 1 1 1.536 76.8c-97.28 1.9456-191.6416-38.2976-282.368-118.8864a497.1008 497.1008 0 0 1-87.9104-102.4512l-1.6896-2.816v62.1568a38.4 38.4 0 0 1-76.8 0.0512l0.1024-288.768 0.512-4.2496 1.536-5.7856 63.4368-14.3872zM921.6 691.2h-204.8a25.6 25.6 0 0 0-25.1904 20.992L691.2 716.8v204.8a25.6 25.6 0 0 0 20.992 25.1904l4.608 0.4096h204.8a25.6 25.6 0 0 0 25.1904-20.992L947.2 921.6v-204.8a25.6 25.6 0 0 0-20.992-25.1904L921.6 691.2zM562.432 12.8512c97.28-1.9456 191.6416 38.2976 282.368 118.8864a497.1008 497.1008 0 0 1 87.9104 102.4512l1.6896 2.816V174.848a38.4 38.4 0 0 1 76.8-0.0512l-0.1024 288.768-0.512 4.2496-1.536 5.7856-63.4368 14.336-9.728-16.5888c-1.024-3.3792-2.3552-18.7392-3.1744-24.4224a435.2 435.2 0 0 0-74.6496-186.0096 420.352 420.352 0 0 0-64.256-71.7824c-77.1072-68.5056-153.4464-101.0176-229.8368-99.4816a38.4 38.4 0 0 1-1.536-76.8zM307.2 0a102.4 102.4 0 0 1 102.4 102.4v204.8a102.4 102.4 0 0 1-102.4 102.4H102.4a102.4 102.4 0 0 1-102.4-102.4V102.4a102.4 102.4 0 0 1 102.4-102.4h204.8z m0 76.8H102.4a25.6 25.6 0 0 0-25.1904 20.992L76.8 102.4v204.8a25.6 25.6 0 0 0 20.992 25.1904L102.4 332.8h204.8a25.6 25.6 0 0 0 25.1904-20.992L332.8 307.2V102.4a25.6 25.6 0 0 0-20.992-25.1904L307.2 76.8z" fill="#515151" /></svg>
    // <svg width="40px" height="30px" viewBox="0 0 1024 1024" version="1.1"><path fill="rgba(0,0,0,0.5)" d="M804.1 64H219.9c-47.8 0-86.6 38.2-86.6 85.2v725.6c0 47.1 38.7 85.2 86.6 85.2h584.2c47.8 0 86.6-38.2 86.6-85.2V149.2c0-47-38.8-85.2-86.6-85.2zM219.9 832.2V191.8c0-23.5 19.4-42.6 43.3-42.6h213.4v725.6H263.2c-23.9 0-43.3-19.1-43.3-42.6z m584.2 0c0 23.6-19.4 42.6-43.3 42.6H569.3V149.2h191.5c23.9 0 43.3 19.1 43.3 42.6v640.4z"  /></svg>
  ); 
  const LayoutColIcon = ()=>(
    <svg className="icon" width="20px" height="20px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M921.6 614.4a102.4 102.4 0 0 1 102.4 102.4v204.8a102.4 102.4 0 0 1-102.4 102.4h-204.8a102.4 102.4 0 0 1-102.4-102.4v-204.8a102.4 102.4 0 0 1 102.4-102.4h204.8zM78.3872 524.8l9.728 16.64c1.024 3.3792 2.3552 18.688 3.1744 24.4224a435.2 435.2 0 0 0 74.6496 186.0096 420.352 420.352 0 0 0 64.256 71.7824c77.1072 68.5056 153.4464 101.0176 229.8368 99.4816a38.4 38.4 0 1 1 1.536 76.8c-97.28 1.9456-191.6416-38.2976-282.368-118.8864a497.1008 497.1008 0 0 1-87.9104-102.4512l-1.6896-2.816v62.1568a38.4 38.4 0 0 1-76.8 0.0512l0.1024-288.768 0.512-4.2496 1.536-5.7856 63.4368-14.3872zM921.6 691.2h-204.8a25.6 25.6 0 0 0-25.1904 20.992L691.2 716.8v204.8a25.6 25.6 0 0 0 20.992 25.1904l4.608 0.4096h204.8a25.6 25.6 0 0 0 25.1904-20.992L947.2 921.6v-204.8a25.6 25.6 0 0 0-20.992-25.1904L921.6 691.2zM562.432 12.8512c97.28-1.9456 191.6416 38.2976 282.368 118.8864a497.1008 497.1008 0 0 1 87.9104 102.4512l1.6896 2.816V174.848a38.4 38.4 0 0 1 76.8-0.0512l-0.1024 288.768-0.512 4.2496-1.536 5.7856-63.4368 14.336-9.728-16.5888c-1.024-3.3792-2.3552-18.7392-3.1744-24.4224a435.2 435.2 0 0 0-74.6496-186.0096 420.352 420.352 0 0 0-64.256-71.7824c-77.1072-68.5056-153.4464-101.0176-229.8368-99.4816a38.4 38.4 0 0 1-1.536-76.8zM307.2 0a102.4 102.4 0 0 1 102.4 102.4v204.8a102.4 102.4 0 0 1-102.4 102.4H102.4a102.4 102.4 0 0 1-102.4-102.4V102.4a102.4 102.4 0 0 1 102.4-102.4h204.8z m0 76.8H102.4a25.6 25.6 0 0 0-25.1904 20.992L76.8 102.4v204.8a25.6 25.6 0 0 0 20.992 25.1904L102.4 332.8h204.8a25.6 25.6 0 0 0 25.1904-20.992L332.8 307.2V102.4a25.6 25.6 0 0 0-20.992-25.1904L307.2 76.8z" fill="#515151" /></svg>
    // <svg width="40px" height="30px" viewBox="0 0 1024 1024" version="1.1"><path fill="rgba(0,0,0,0.5)" d="M804.1 64H219.9c-47.8 0-86.6 38.1-86.6 85.2v725.6c0 47 38.7 85.2 86.6 85.2h584.2c47.8 0 86.5-38.2 86.5-85.2V149.2c0.1-47.1-38.7-85.2-86.5-85.2z m-540.9 85.2h497.7c23.9 0 43.3 19 43.3 42.6V454H219.9V191.8c0-23.5 19.4-42.6 43.3-42.6z m497.6 725.6H263.2c-23.9 0-43.3-19.1-43.3-42.6V546.6h584.2v285.6c0 23.5-19.4 42.6-43.3 42.6z"  /></svg>
  );
  return showRecord?<ComponentRecord/>:<div className={styles.wrap}>
    <div className={styles.handleWrap}>
      <div style={{paddingLeft:20}}>
        {/* <label style={{fontWeight:800}}>组件名称：</label>
        {developingData.name} */}
      </div>
      <div className={styles.btnwrap}>
        <Button type="primary" style={{marginRight:20}}
          disabled={installing}
          onClick={()=>{
            installPackages();
          }}
        >
        <Spin spinning={installing} size='small' style={{marginRight:10}}/>  
        <span>安装依赖</span>
        </Button>
        <Button
          type='primary'
          onClick={()=>{setReleaseModalVisible(true);}}
          style={{marginRight:20}}
        >更新上线</Button>
        <Button
          type="primary"
          onClick={()=>{
            setShowRecord(true);
            // props.history.push({pathname:`/app/${developingData.id}/component-record`,state:{name:developingData.name}});
          }}
        >查看组件记录</Button>
        {
          <Popover content='切换布局'>
            <div 
              title="切换布局"
              style={{cursor:'pointer',margin:'0 20px',padding:'4px 0'}}
              onClick={()=>{setLayout(layout=='row'?'col':'row');}}
            >
              {
                layout=='row'?<LayoutColIcon />:<LayoutRowIcon />
              }
            </div>
          </Popover>
        }
      </div>
    </div>
    <div ref={mainDiv} className={styles.main} style={{flexDirection:layout=='row'?'row':'column',height:layout=='row'?'100%':1400}}
      onMouseMove={(e)=>{
        if (moveMode) {
          if (layout=='row') {
            setLayerX(e.nativeEvent.layerX);
          }
          if (layout=='col') {
            setLayerY(e.nativeEvent.layerY);
          }
        }
      }}
    >
      <div className={styles.CodeWrap} 
        style={{
          width:layout=='col'?'100%':layerX-5,
          height:layout=='col'?(layerY-5):'100%',
          marginBottom:layout=='row'?10:0
        }}>
        <div style={{padding:'5px 15px'}}>编辑区</div>
        <Spin tip='正在进行编译...' spinning={compileSping} wrapperClassName='vscodeSpinWrap'>
          <iframe
            className={styles.vscodeFrame}
            name='vscode'
            src={`${window.LCAP_CONFIG.vscodeAddress}/?folder=${window.LCAP_CONFIG.vscodeFolderPrefix}/components/${componentId.current}/v-current`}
            frameBorder={0}
          >
          </iframe>
        </Spin>
      </div>
      <div className={layout=='row'?styles.rowBar:styles.colBar}
        onMouseDown={(e)=>{
          setMoveMode(true);
        }}
        onMouseUp={(e)=>{
          setMoveMode(false);
        }}
      ></div>
      <div className={styles.previewWrap} 
        style={{
          width:layout=='col'?'100%':`calc(100% - ${layerX+10}px)`,
          height:layout=='col'?(1400-(layerY-5)):'100%'
          }}>
        <div style={{padding:'5px 15px'}}>可视化区</div>
        <iframe 
          className={styles.previewFrame}
          name='preview' 
          src={`${window.LCAP_CONFIG.wwwAddress}/components/${componentId.current}/v-current/editor.html?random=${previewRandom}`} 
          frameBorder={0}
        >
        </iframe>
      </div>
      <div style={{position:'absolute',width:'100%',height:'calc(100% - 30px)',top:30,display:moveMode?'block':'none'}}
        onMouseUp={()=>{
          setMoveMode(false);
        }}
      ></div>
    </div>
    <Modal
      visible={releaseModalVisible}
      footer={null}
      title='更新上线'
      width='40%'
      onCancel={()=>{setReleaseModalVisible(false);}}
    >
      <ReleaseComponent/>
    </Modal>
  </div>;
});

export default CodeDevelop;