/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-05-10 15:55:28
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-10-18 15:22:09
 */
import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';
import './assets/css/index.less';
import './assets/css/iconfont/iconfont.less';
// 引入 singleSpaReact
import singleSpaReact from 'single-spa-react';
import portalStore from './stores/portalStore';
window.isInPortal = !!document.querySelector('#singlespa-container');

const rootEle = document.getElementById('lcap-root');

if (rootEle) {
  ReactDOM.render(<Root />, rootEle);
}

// 国际化配置
if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'zh');
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
  domElementGetter,
});

// 应用启动的钩子
export const bootstrap = [reactLifecycles.bootstrap];

// 应用启动后的钩子
// export const mount = [reactLifecycles.mount];
export function mount(props) {
  console.log('传递进来的属性', props);
  portalStore = props.layoutStore;
  return reactLifecycles.mount(props);
}

// 应用卸载的钩子
export const unmount = [
  reactLifecycles.unmount,
  // FIXED: ace子应用之间互相影响
  () => {
    window.ace = null;
    return Promise.resolve();
  },
];
