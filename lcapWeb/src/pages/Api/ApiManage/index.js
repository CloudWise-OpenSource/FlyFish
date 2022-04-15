/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-01-11 15:12:05
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-01-17 17:55:06
 */

import React, { useEffect } from 'react';
import { observer, toJS } from "@chaoswise/cw-mobx";
import globalStore from '@/stores/globalStore';
import { getUserInfoService } from './services';
import { message } from 'antd';

const AppList = observer(function (props) {
  const { userInfo } = globalStore;

  useEffect(() => {
    if (window.getManageListener) {
      window.removeEventListener('message', window.getManageListener);
    }
    const getManageListener = function (event) {
      const frame = document.getElementsByName('yapi_frame')[0];
      if (event && event.data) {
        if ("yapi_route_event_application" === event.data.event) {
          const el = document.getElementsByClassName('ant-breadcrumb-link')[0];
          const txt = el.innerText;
          if (event.data.flag) {
            el.innerText = '应用管理';
            el.onmouseover = null;
            el.onmouseout = null;
            el.style.cursor = 'default';
            el.style.color = 'rgba(0, 0, 0, 0.65)';
            frame.contentWindow.postMessage({ event: 'flyfish_route_event_application' }, '*');
          } else {
            if (txt.indexOf('/') !== -1) {
              el.innerText = '< ' + '应用管理' + ' / ' + event.data.name;
            } else {
              el.innerText = '< ' + txt + ' / ' + event.data.name;
            }
          }
          el.style.cursor = 'pointer';
          el.onmouseover = () => {
            el.style.color = '#1890ff';
          };
          el.onmouseout = () => {
            el.style.color = 'rgba(0, 0, 0, 0.65)';
          };
          el.onclick = () => {
            el.innerText = '应用管理';
            el.onmouseover = null;
            el.onmouseout = null;
            el.style.cursor = 'default';
            el.style.color = 'rgba(0, 0, 0, 0.65)';
            frame.contentWindow.postMessage({ event: 'flyfish_route_event_application' }, '*');
          };
        }
      }
    };
    window.getManageListener = getManageListener;
    window.addEventListener('message', getManageListener);
  }, []);

 return <>
  {
    userInfo?
    <iframe name="yapi_frame" src={`${window.LCAP_CONFIG.yapiAddress}/application?token=${userInfo.yapiAuthorization}`} width="100%" style={{height:'calc(100% - 5px)'}} frameBorder="none"></iframe>
    :null
  }
 </>;
});
export default AppList;