import React, { Component } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import BoxContent from 'templates/ToolComponents/BoxContent';
import Table from 'templates/ToolComponents/Table';
import { Button, Modal, message } from 'antd';
import T from 'utils/T';
import * as sceneAPI from '../../webAPI/scene';

import SceneEdit from './SceneEdit'
import AddScene from './AddScene';
import moment from 'moment';
import ComponentModalCreate from '../ComponentList/ComponentModalCreate';

const { confirm } = Modal;

class SceneManage extends Component{

  constructor(props){
    super(props)
    this.state = {
      loading:false,
      datas:[],
      current:1,
      pageSize:10,
      total:100
    }
  }

  componentDidMount(){
    this.initList();
  }

  initList(){
    const params = {
      page:this.state.current,
      pageSize:this.state.pageSize
    }
    sceneAPI.queryScene(params).then((res)=>{
      this.setState({
        datas:res.data.result.map(item=>{
          item.id=item.sceneId;
          return item;
        }),
        total:res.data.total
      })
    })
  }
  render(){
    const columns = [
      {
          key:'sceneName',
          title: '场景名称',
          dataIndex: 'sceneName',
      },
      {
          key:'desc',
          title: '场景描述',
          dataIndex: 'desc'
      },
      // {
      //     key:'dirPath',
      //     title: '场景快照',
      //     dataIndex: 'dirPath',
      //     render: (text,record)=>{
      //       return <img src={"/apexAPI"+text+"/storage/scenes/"+record.fileName.split('.')[0]+'.png'}></img>;
      //     }
      // },
      {
          key:'author',
          title: '开发者',
          dataIndex: 'author',
      },
      {
          key:'createTime',
          title: '创建时间',
          dataIndex: 'createTime',
          render:(text)=>{
            return moment(Number(text)).format('YYYY-MM-DD HH:mm:ss')
          }
      },
      {
          key:'operate',
          title: '操作',
          render: (text, record) => [
              <Button
                  key={1}
                  type="primary"
                  icon="edit"
                  onClick={() => T.helper.renderModal(<SceneEdit sceneIns={this} record={record}/>)}
              >修改</Button>
              ,
              <Button key={3} disabled type="primary" icon="download" onClick={() => {
                  
              }} style={{ marginLeft: 5 }}>导出</Button>
              ,
              <Button key={4} type="danger" icon="delete" onClick={() => {
                confirm({
                  title: '确定要删除吗?',
                  onOk:()=>{
                    sceneAPI.delScene(record.sceneId).then((res)=>{
                      if (res && res.msg=='success') {
                        message.success('删除成功!');
                        const {current,datas}=this.state
                        this.setState({
                          current: datas.length === 1 && current > 1 ? current - 1 : current
                        }, () => {
                          this.initList()
                        })
                      }else{
                        message.error('删除失败!')
                      }
                    })
                  }
                });
              }} style={{ marginLeft: 5 }}>删除</Button>
          ]
      }
    ];
    return <div>
    <MainHeader title="场景管理" rightRender={
      <React.Fragment>
        <Button type="primary" icon="picture" style={{marginRight:20}} onClick={() => {window.open('http://'+window.location.hostname+':5566/index3d.html')}}>场景开发</Button>
        <Button type="primary" icon="cloud-upload" onClick={() => T.helper.renderModal(<AddScene sceneIns={this}/>)}>场景上传</Button>
      </React.Fragment>
    } />

    <MainContent>
        <BoxContent loading={this.state.loading}>
            <Table
                dataSource={this.state.datas}
                columns={columns}
                pagination={{
                    showSizeChanger:true,
                    current: this.state.current,
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onChange: (current,pageSize) => {
                      this.setState({
                        ...this.state,
                        current,
                        pageSize
                      },()=>{
                        this.initList();
                      })
                    },
                    onShowSizeChange:(current, pageSize)=>{
                      this.setState({
                        ...this.state,
                        current:1,
                        pageSize
                      },()=>{
                        this.initList();
                      })
                    }
                }}
                loading={this.state.loading}
                rowKey={(record) => record.id}
            />
        </BoxContent>
    </MainContent>
  </div>
  }
}

export default SceneManage;