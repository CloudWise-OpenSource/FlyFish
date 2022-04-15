
import React from 'react';

/**
 * 路由鉴权
 * @param {route} com 路由数据
 * @param {Array} authData 权限数据
 */
export const getAuthRoute = (route, authData) => {
  return com => {
    if(route.check && !authData.includes(route.id)) {
      return <div>您没有权限访问</div>;
    }
    return com;
  };
};
