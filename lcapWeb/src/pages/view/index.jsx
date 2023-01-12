/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2022-11-30 16:40:03
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2022-12-05 10:15:09
 */
import React,{useEffect,useState} from 'react';
import Loading from '@/components/Loading'
import './index.less'
const View = ()=>{
  const [startLoading,setStartLoading]=useState(true)
  useEffect(() => {
    setStartLoading(true)
    const env = document.createElement('script');
    env.src='/lcapWeb/www/web/screen/config/env.js';
    document.body.appendChild(env);

    env.onload = ()=>{
      const datavi = document.createElement('script');
      datavi.src='/lcapWeb/www/common/data-vi.js';
      document.body.appendChild(datavi);
  
      datavi.onload = ()=>{
        window.require(['data-vi/start'], function (start) {
          setStartLoading(false)
          start.initialize(document.getElementById('container'));
        });
      }
    }
    if ('onhashchange' in window) {
      window.onhashchange = ()=>{
        window.location.reload();
      }; 
    }
  }, []);
  return(
    startLoading?<Loading/>:<div id="container" style={{width:'100%',height:'100%'}}></div>
  )
}

export default View;