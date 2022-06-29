/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-05-31 14:01:16
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-05-31 14:05:28
 */
import React from 'react';
import { Provider, use, loadingStore } from '@chaoswise/cw-mobx';
import stores from '../stores';
import App from './app';

 function Root() {
  return (
    <Provider
      {...use(stores)} 
      loadingStore={loadingStore}
    >
      <App />
    </Provider>
  );
}

export default Root;