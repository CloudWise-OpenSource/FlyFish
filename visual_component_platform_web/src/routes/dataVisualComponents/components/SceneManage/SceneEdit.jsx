import React, { Component } from 'react';
import { Modal,Form,Input,Icon,Button, Upload,Progress } from 'antd';
import T from 'utils/T';
import * as sceneAPI from '../../webAPI/scene'
import EnumAPI from '../../../../constants/EnumAPI';

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  },
};
class EditScene extends Component{

  constructor(props){
    super(props)
    this.state={
      visible:true,
      fileList:[],
      uploadProgress:0//上传文件进度
    }
  }

  handleOk(){
    const { validateFields } = this.props.form;
    validateFields((errors,values)=>{
      if (!errors) {
        //检查重复
        sceneAPI.checkSceneEdit({
          ...values,
          sceneId:this.props.record.sceneId
        }).then((res)=>{
          //上传文件
          if (this.state.fileList.length>0) {
            const formData = new FormData();
            this.state.fileList.forEach(file => {
              formData.append('file', file);
            });
            const progressCallback = (evt)=>{
              this.setState({
                ...this.state,
                uploadProgress: Math.round((evt.loaded * 100) / evt.total)
              })
            }
            sceneAPI.uploadScene(formData,progressCallback).then((res)=>{
              sceneAPI.editScene({
                ...values,
                ...res.data,
                sceneId:this.props.record.sceneId
              }).then((res)=>{
                if (res) {
                  this.closeModal();
                  //恢复进度条
                  this.setState({
                    ...this.state,
                    uploadProgress:0
                  })
                  T.prompt.success(res.msg);
                  this.props.sceneIns.initList();
                }
              },(res)=>{
                T.prompt.error(res.msg)
              })
            },(res)=>{
              T.prompt.error(res.msg)
            })
          }else{
            sceneAPI.editScene({
              ...values,
              sceneId:this.props.record.sceneId
            }).then((res)=>{
              if (res) {
                this.closeModal();
                //恢复进度条
                this.setState({
                  ...this.state,
                  uploadProgress:0
                })
                T.prompt.success(res.msg);
                this.props.sceneIns.initList();
              }
            },(res)=>{
              T.prompt.error(res.msg)
            })
          }
        },(res)=>{
          T.prompt.error(res.msg)
        })
      }
    })
  }
  handleCancel(){
    this.closeModal()
  }
  closeModal(){
    this.setState({
      ...this.state,
      visible:false
    })
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { record } = this.props;
    return <Modal
      title="修改场景"
      visible={this.state.visible}
      onOk={this.handleOk.bind(this)}
      onCancel={this.handleCancel.bind(this)}
    >
      <Form>
        <Form.Item label="场景名称" {...formItemLayout}>
          {getFieldDecorator('sceneName', {
            initialValue:record.sceneName,
            rules: [{ required: true, message: '请输入场景名称!' }],
          })(
            <Input placeholder="场景名称"/>,
          )}
        </Form.Item>
        <Form.Item label="场景描述" {...formItemLayout}>
          {getFieldDecorator('desc', {
            initialValue:record.desc,
            rules: [{ max: 20, message: '不能超过20字!' }],
          })(
            <Input placeholder="场景描述"/>,
          )}
        </Form.Item>
        <Form.Item label="开发者" {...formItemLayout}>
          {getFieldDecorator('author', {
            initialValue:record.author,
            rules: [{ max: 20, message: '不能超过20字!' }],
          })(
            <Input placeholder="开发者"/>,
          )}
        </Form.Item>
        <Form.Item label="场景文件" {...formItemLayout}>
          {getFieldDecorator('dirPath', {
            
          })(
            <Upload
              accept='.zip'
              fileList={this.state.fileList}
              beforeUpload={(file, fileList) => {
                if(file.size/1024/1024<100){
                  if (fileList && fileList.length > 0) {
                    this.setState({
                      ...this.state,
                      fileList:[fileList[fileList.length - 1]]
                    })
                  }
                }else{
                  T.prompt.error('上传文件不能大于100M!')
                }
                
                return false;
              }}
              onRemove={file => {
                if (this.state.uploadProgress==100) {
                  this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                      fileList: newFileList,
                      uploadProgress:0
                    };
                  });
                }
              }}
            >
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          )}
          <Progress style={{display:this.state.uploadProgress>0?'block':'none'}} percent={this.state.uploadProgress} size="small" />
        </Form.Item>
      </Form>
    </Modal>
  }
}

export default Form.create({ name: 'editScene' })(EditScene)