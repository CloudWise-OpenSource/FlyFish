/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-05-13 15:51:07
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-05-31 14:05:15
 */
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';
import '../assets/css/index.less';
// 引入 singleSpaReact
import singleSpaReact from 'single-spa-react';

window.isInPortal = !!document.querySelector('#singlespa-container');

const rootEle = document.getElementById("lcap-root");

if(rootEle) {
  ReactDOM.render(
    <Root />,
    rootEle
  );  
}

/**
 * 加入以下微服务挂载所需要的的生命周期钩子（非微服务集成，以下代码不会执行）
*/

// 集成到portal后挂载节点，此id为portal承载子应用约定好的节点
function domElementGetter() {
  return document.getElementById('singlespa-container');
}
// 生产环境 - 打包成amd规范的文件，由Portal作为微服务引入应用
const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  // eslint-disable-next-line react/display-name
  rootComponent: (singlespa) => {
    return <Root {...singlespa} />;
  },
  domElementGetter
});

// 应用启动的钩子
export const bootstrap = [
  reactLifecycles.bootstrap,
];

// 应用启动后的钩子
export const mount = [
  reactLifecycles.mount,
];

// 应用卸载的钩子
export const unmount = [
  reactLifecycles.unmount,
];