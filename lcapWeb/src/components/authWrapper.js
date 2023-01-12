/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-02-10 16:35:07
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-05-17 17:11:14
 */
import React from 'react';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/Loading';
import { createHashHistory } from 'history';

const history = createHashHistory();
const authWrapper = (WrappedComponent) => {

  const Component = props => {
    const { getAuth, status } = useAuth();
    if (status === 'loading') {
      return (
        <Loading />
      );
    }
    if (status === 'error') {
      return '权限获取失败，请检查网络';
    }
    // 没有cookies跳转回首页
    if(status == 'noCookies') {
      if (!window.isInPortal) {
        // history.replace('/login');
      }
    }


    return <WrappedComponent getAuth={getAuth} {...props} />;
  };

  return Component;

};

export default authWrapper;
