import React, { Component } from 'react';
import { Modal,Form,Input,Icon,Button, Upload } from 'antd';
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
      uploaded:false,
      uploadRes:{},
      fileList:[]
    }
  }

  handleOk(){
    const { validateFields } = this.props.form;
    validateFields((errors,values)=>{
      if (!this.state.uploaded) {
        T.prompt.error('文件未上传成功!')
        return
      }
      if (!errors) {
        sceneAPI.addScene({
          ...values,
          ...this.state.uploadRes
        }).then((res)=>{
          if (res && res.msg=='success') {
            this.closeModal();
            T.prompt.success('添加成功!');
            this.props.sceneIns.initList();
          }
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
    
    return <Modal
      title="上传场景"
      visible={this.state.visible}
      onOk={this.handleOk.bind(this)}
      onCancel={this.handleCancel.bind(this)}
    >
      <Form>
        <Form.Item label="场景名称" {...formItemLayout}>
          {getFieldDecorator('sceneName', {
            rules: [{ required: true, message: '请输入场景名称!' }],
          })(
            <Input placeholder="场景名称"/>,
          )}
        </Form.Item>
        <Form.Item label="场景描述" {...formItemLayout}>
          {getFieldDecorator('desc', {
            rules: [{ max: 20, message: '不能超过20字!' }],
          })(
            <Input placeholder="场景描述"/>,
          )}
        </Form.Item>
        <Form.Item label="开发者" {...formItemLayout}>
          {getFieldDecorator('author', {
            rules: [{ max: 20, message: '不能超过20字!' }],
          })(
            <Input placeholder="开发者"/>,
          )}
        </Form.Item>
        <Form.Item label="场景文件" {...formItemLayout}>
          {getFieldDecorator('dirPath', {
            // rules: [{ required: true, message: '请选择文件!' }],
          })(
            <Upload
              name='file'
              action={window.ENV.apiDomain+EnumAPI.scene_upload}
              headers={{ authorization: 'authorization-text' }}
              accept='.zip'
              fileList={this.state.fileList}
              beforeUpload={(file, fileList) => {
                if (fileList && fileList.length > 0) {
                    this.setState({
                      ...this.state,
                      fileList:[fileList[fileList.length - 1]]
                    })
                }
              }}
              onChange={({ event, file, fileList }) => {
                if (file.status === 'uploading') {
                  this.setState({
                    ...this.state,
                    uploaded:false
                  })
                }
                if (file.status === 'done') {
                  this.setState({
                    ...this.state,
                    uploaded:true,
                    uploadRes:file.response.data
                  })
                }
              }}
            >
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          )}
        </Form.Item>
      </Form>
    </Modal>
  }
}

export default Form.create({ name: 'editScene' })(EditScene)