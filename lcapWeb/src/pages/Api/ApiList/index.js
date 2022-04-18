/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-12-06 18:18:09
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-01-17 17:54:50
 */

 import React, { useEffect } from 'react';
 import { observer,toJS } from "@chaoswise/cw-mobx";
 import globalStore from '@/stores/globalStore';
 import { getUserInfoService } from './services';
 import { message } from 'antd';

 const AppList = observer(function(props){
  const { userInfo } = globalStore;

   useEffect(() => {
    if (window.getUserInfoListener) { 
      window.removeEventListener('message',window.getUserInfoListener);
    }
    const getUserInfoListener = function(event){
      const frame = document.getElementsByName('yapi_frame')[0];
      if (event && event.data) {
        if ('checkCrossRequestEvent'==event.data.event) {
          event.source.postMessage({event:'checkCrossRequestResultEvent',data:!!window.crossRequest},'*');
        }
        if ('YapiCrossRequestEvent'==event.data.event) {
          const callback = (res, header, data)=>{
            event.source.postMessage({event:'YapiCrossRequestResultEvent',res,header,data:JSON.stringify(data)},'*');
          };
          window.crossRequest({...event.data.options,success:callback,error:callback});
        }
        if ("getUserInfo" ===event.data.event) {
          if (userInfo) {
            frame.contentWindow.postMessage({event:'setUserInfo',data:userInfo},frame.src);
          }else{
            const id = localStorage.getItem('id');
            getUserInfoService({id}).then((res)=>{
              if (res && res.data) {
                frame.contentWindow.postMessage({event:'setUserInfo',data:res.data},frame.src);
              }
            });
          }
        }
        if ("yapi_route_event" ===event.data.event) {
          const el = document.getElementsByClassName('ant-breadcrumb-link')[0];
          let txt = el.innerText;
          if (txt.includes('/')) {
            txt = txt.split('/')[0];
            txt = txt.replace('< ','');
          }
          el.innerText = '< '+txt+' / '+event.data.name;
          el.style.cursor = 'pointer';
          el.onmouseover=()=>{
            el.style.color='#1890ff';
          };
          el.onmouseout=()=>{
            el.style.color='rgba(0, 0, 0, 0.65)';
          };
          el.onclick=()=>{
            el.innerText = 'API列表';
            el.onmouseover=null;
            el.onmouseout=null;
            el.style.cursor = 'default';
            el.style.color = '#000';
            frame.contentWindow.postMessage({event:'flyfish_route_event'},frame.src);
          };
        }
      }
    };
    window.getUserInfoListener = getUserInfoListener;
    window.addEventListener('message',getUserInfoListener);
   }, []);
   console.log('userInfo===',userInfo);
  return <>
    {
      userInfo?
      <iframe name="yapi_frame" src={`${window.LCAP_CONFIG.yapiAddress}?token=${userInfo.yapiAuthorization}`} width="100%" style={{height:'calc(100% - 5px)'}} frameBorder="none"></iframe>
      :null
    }
  </>;
 });
 export default AppList;