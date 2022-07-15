/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-04-19 11:00:14
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-04-19 11:48:13
 */
import React, { useEffect } from "react";
import globalStore from '@/stores/globalStore';
const { getUserInfo } = globalStore;

const App = ({ children }) => {
  useEffect(() => {
    getUserInfo();
  }, []);
  return <div style={{ background: "#fff", height: "100%" }}>{children}</div>;
};

export default App;
