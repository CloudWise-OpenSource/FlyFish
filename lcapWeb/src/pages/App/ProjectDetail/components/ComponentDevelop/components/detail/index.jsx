import React from 'react';
import styles from './style.less';
import { Button,Input,Table } from 'antd';
import { useState } from 'react';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";

const Detail = observer(()=>{
  const { detailShow,setDetailShow,detailData={
    name:'柱状图1',
    serial:'01',
    business:'通用航空',
    tag:'标签1，标签2',
    desc:'你好，这是描述',
    charactor:'abc-aaa'
  } } = store;

  const [adding, setAdding] = useState(false);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Cash Assets',
      className: 'column-money',
      dataIndex: 'money',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      money: '￥300,000.00',
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      money: '￥1,256,000.00',
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      money: '￥120,000.00',
      address: 'Sidney No. 1 Lake Park',
    },
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
            <label>组件编号：</label>{detailData.serial}
          </div>
          <div>
            <label>行业：</label>{detailData.business}
          </div>
          <div>
            <label>标签：</label>{detailData.tag}
          </div>
          <div>
            <label>描述：</label>{detailData.desc}
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