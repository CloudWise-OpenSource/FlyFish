/**
 * 微服务容器： 主应用用于展示子应用的组件
 */
import React, { useEffect, useState } from 'react';
import { start } from 'qiankun';
import { addErrorHandler, removeErrorHandler } from 'qiankun';
import Loading from '@/components/Loading';

function MicroAppWrapper({
  style={}
}) {

  const [ status, setStatus ] = useState('loading'); // 加载状态

  const handleError = error => {
    setStatus(error.message);
  };

  useEffect(() => {
    // 监听加载错误
    addErrorHandler(handleError);
    // 启动微服务
    start();

    return () => {
      // 取消错误监听
      removeErrorHandler(handleError);
    };
  }, []);

  const renderContent = () => {
    if(status === 'loading') {
      return <Loading />;
    }
    if(status) {
      return (
        <div>
          <h3>加载失败：</h3>
          <div>{status}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      id='micro-app-container' 
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      {
        renderContent()
      }
    </div>
  );
}

export default MicroAppWrapper;
