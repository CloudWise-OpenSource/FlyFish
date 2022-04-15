import React, { useEffect } from 'react';
import styles from './style.less';
import { Button,Input,Table } from 'antd';
import { useState } from 'react';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { getDetailDataService } from '../../services';

const Detail = observer(()=>{
  const columns = [
    {
      title: '属性',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '描述',
      className: 'column-money',
      dataIndex: 'money',
    },
    {
      title: '类型',
      dataIndex: 'address',
    },
    {
      title: '默认值',
      dataIndex: 'defa',
    },
  ];
  const { detailShow,setDetailShow,viewId } = store;

  const [adding, setAdding] = useState(false);
  const [detailData, setDetailData] = useState([]);

  useEffect(() => {
    if (viewId) {
      getDetailData();
    }
  }, [viewId]);

  const getDetailData = async ()=>{
    const res = await getDetailDataService({id:viewId});
    if (res && res.data) {
      setDetailData(res.data)
    }
  }
  
  const data = [

  ];

  return <>
    <div 
      className={styles.shadow} 
      style={{display:detailShow?'block':'none'}}
      onClick={()=>{
        setDetailShow(false)
      }}
    ></div>
    <div 
      className={styles.wrap}
      style={{display:detailShow?'block':'none'}}
    >
      <div className={styles.titleWrap}>
        <div>
          <span>组件预览</span>
        </div>
        <div>
          <Button>保存</Button>
          <Button style={{marginLeft:20}}>更新发布</Button>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.baseInfo}>
          <div>
            <label>组件名称：</label>{detailData.name}
          </div>
          <div>
            <label>组件编号：</label>{detailData.id}
          </div>
          <div>
            <label>行业：</label>{
            detailData.projects?detailData.projects.map((v,k)=>{
              return <span key={v.id}>{k===(detailData.projects.length-1)?v.name:(v.name+',')}</span>
            }):''
            }
          </div>
          <div>
            <label>标签：</label>{
              detailData.tags?detailData.tags.map((v,k)=>{
                return <span key={v.id}>{k===(detailData.tags.length-1)?v.name:(v.name+',')}</span>
              }):''
            }
          </div>
          <div>
            <label>描述：</label>{detailData.desc}
          </div>
          <div>
            <label>开发状态：</label>{detailData.developStatus==='doing'?'开发中':'已交付'}
          </div>
          <div>
            <label>创建者信息：</label>{detailData.creatorInfo?detailData.creatorInfo.username:''}
          </div>
        </div>
        <div className={styles.imgWrap}>
          <div style={{height:40}}>
            <span style={{marginRight:30}}>效果演示</span>
            <span>提供组件标识：{detailData.charactor}</span>
            <Button type='primary' style={{float:'right'}}>上传Demo代码</Button>
          </div>
          <div style={{backgroundColor:'#eee',height:300}}>
              
          </div>
        </div>
        <div className={styles.dataWrap}>
          <div style={{fontWeight:800,margin:'10px 0'}}>数据格式</div>
          <div>
            <span>注释：</span>
            <Input placeholder='输入注释' style={{margin:'10px 0'}}></Input>
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={data}
              bordered
              pagination={false}
              footer={null}
            />
          </div>
          <div style={{display:adding?'flex':'none',margin:'10px 0'}}>
              <Input style={{width:220}}></Input>
              <Input style={{width:280}}></Input>
              <Input style={{width:400}}></Input>
          </div>
          <Button onClick={()=>{
            setAdding(true)
          }}>向下添加行</Button>
        </div>
      </div>
    </div>
  </>
})

export default Detail;