import { useState, useEffect } from 'react';
import { getAuthApi } from '@/services/demo';
import store from '@/stores/globalStore';

const useAuth = () => {

  const [authMap, setAuthMap] = useState({});
  const [status, setStatus] = useState('loading'); // loading 获取权限中, error 获取权限失败 

  useEffect(() => {

    getAuthApi().then(res => {
      // 暂时不校验权限/没有cookeis返回
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (res && res.code === 100000) {
        const authMap = {};
        res.data.forEach(item => {
          authMap[item.code] = item.selected;
        });
        setAuthMap(authMap);
        // 挂载权限数据到store
        store.updateAuth(authMap);
        // 改变状态
        if (keys && keys.find(item => item === 'FLY_FISH_V2.0')) {
          setStatus('');
        } else {
          setStatus('noCookies');
        }
      } else {
        setStatus('error');
      }
    }).catch(error => {
      if (error && error.response) {
        if (error.response.status !== 401) {
          setStatus('error');
        }
      }
    });
  }, []);


  return {
    auth: authMap,
    status,
    getAuth: code => {
      if (code) {
        return authMap[code];
      }
      return true;
    }
  };
};

export default useAuth;
