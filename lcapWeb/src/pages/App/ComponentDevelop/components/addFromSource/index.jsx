import React from 'react';
import styles from './style.less';
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import { Form,Input,Select,Button,Row,Col,Icon,Popover,TreeSelect,message,Spin,Upload,Progress, DemoShow, Space } from '@chaoswise/ui';
import { useState } from 'react';
import { useEffect } from 'react';
import { getProjectsService,getTagsService,addComponentService, getListDataService,addTagService,importsource } from '../../services';
import API from '../../../../../services/api/component';
import { set, value } from '@chaoswise/utils';
import globalStore from '@/stores/globalStore';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const AddFromSource = observer((props)=>{
  const { getFieldDecorator,validateFields,getFieldValue } = props.form;

  const { setAddFromSourcevisible,treeData,projectsData,tagsData,getListData,getTagsData,selectedData } = store;
  const { userInfo={} } = globalStore;
  const { iuser={} } = userInfo;

  const [uploadId, setUploadId] = useState('');
  const [addloading, setAddloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileInfo, setUploadFileInfo] = useState();
  const [uploadFileList, setUploadFileList] = useState([]);

  const handleSubmit = (e)=>{
    e.preventDefault();
    validateFields(async (err, value) => {
      if (!err) {
        let { sourceFile, ...values} = value
        const cateData = JSON.parse(values.category);
        values.category = cateData.one;
        values.subCategory = cateData.two;
        values.desc=values.desc?values.desc:undefined;
        values.automaticCover = 1
        if (values.tags) { 
          values.tags = values.tags.map(item=>({name:item}))
        }
        setAddloading(true)
        const res = await addComponentService(values);
        if (res && res.code==0) {
          setUploadFileList([])
          let uploadFileFormData = new FormData()
          uploadFileFormData.append('file',uploadFileInfo)
          setAddloading(false)
          props.form.resetFields()
          setAddFromSourcevisible(false);
          setUploadProgress(0)
          getListData();
          //???????????????
          getTagsData();
          const uploadRes = await importsource(res.data.id,uploadFileFormData)
          if(uploadRes && uploadRes.code===0){
            message.success('???????????????');
          } else {
            message.error('???????????????????????????' + uploadRes.msg)
          }
          setUploadProgress(0)
        }else{
          setAddloading(false)
          message.error(res.msg)
        }
      }
    });
  }
  return <Form
    onSubmit={handleSubmit}
    className={styles.componentDevelopLabel}
  >
    <Form.Item label="????????????">
      {getFieldDecorator('name', {
        rules: [
          {
            required: true,
            message: '???????????????????????????'
          },{
            max:50,
            message: '??????????????????????????????50???'
          }
        ]
      })(<Input />)}
    </Form.Item>
    <Form.Item label={<>
      <Popover 
        placement='left' 
        content={
          <>
            <p style={{width:200}}>
              ??????????????????????????????????????????????????????????????????"????????????"??????????????????????????????????????????
            </p>
            <p style={{width:200}}>
              ??????????????????????????????????????????????????????????????????????????????????????????????????????
            </p>
          </>
        }>
        <Icon
          type='question-circle'
          style={{
            margin: '0px 5px',
            verticalAlign: 'middle',
            transform: 'translateY(-2px)',
          }}
        />
      </Popover>
      <span>????????????</span>
    </>}>
      {getFieldDecorator('type', {
        initialValue:'project',
        rules: [
          {
            required: true,
            message: '???????????????????????????'
          }
        ]
      })(<Select>
        <Option value='project'>????????????</Option>
        {
          iuser.isAdmin?<Option value='common'>????????????</Option>:null
        }
      </Select>)}
    </Form.Item>
    {
      getFieldValue('type')=='common'?null:
      <Form.Item label="????????????">
        {getFieldDecorator('projects', {
          rules: [
            {
              required: true,
              message: '???????????????????????????'
            }
          ]
        })(<Select
          mode="multiple"
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            projectsData.map((v,k)=>{
              return <Option value={v.id} key={v.id}>{v.name}</Option>
            })
          }
        </Select>)}
      </Form.Item>
    }
    <Form.Item label="????????????">
      {getFieldDecorator('category', {
        rules: [
          {
            required: true,
            message: '???????????????????????????'
          }
        ],
        initialValue:selectedData.subCategory?JSON.stringify({one:selectedData.category,two:selectedData.subCategory}):undefined
      })(<TreeSelect
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={
          treeData.map((v,k)=>{
            return {
              title:v.name,
              value:v.id,
              key:k+'',
              disabled:true,
              children:v.children.map((v1,k1)=>{
                return {
                  title:v1.name,
                  value:JSON.stringify({one:v.id,two:v1.id}),
                  key:k+'-'+k1,
                }
              })
            }
          })
        }
        placeholder="?????????"
        treeDefaultExpandAll
      />)}
    </Form.Item>
    <Form.Item label="????????????">
      {getFieldDecorator('sourceFile', {
          rules: [
            {
              required: true,
              message: '?????????????????????'
            }
          ],
        })(<div style={{display:'flex',flexDirection:'column',height:170,marginBottom:55}}>
          <DemoShow
            description='?????????????????????????????????'>
            <Space
                direction="vertical"
                style={{
                width: '100%'
                }}
            >
            <Dragger 
              accept=".zip"
              height={170}
              action={API.UPLOAD_COMPONENT+'/'+uploadId}
              headers={{authorization: 'authorization-text'}}
              method="post"
              name="file"
              fileList={uploadFileList}
              showUploadList={true}
              // dropSingleFileUpload={true}
              beforeUpload={(file,fileList) => {
                setUploadFileList(fileList)
                setUploadProgress(100);
                return false
              }}
              onChange={({file,fileList,event})=>{
                setUploadFileInfo(file);
                if (event) {
                  setUploadProgress(event.percent);
                }
              }}
            />
            </Space>
          </DemoShow>
      </div>)}
    </Form.Item>
    <Form.Item label="??????">
      {getFieldDecorator('tags', {
        rules: []
      })(<Select
        mode="tags"
      >
        {
          tagsData.map((v,k)=>{
          return <Option value={v.name} key={v.id}>{v.name}</Option>
          })
        }
      </Select>)}
    </Form.Item>
    <Form.Item label="??????">
      {getFieldDecorator('desc', {
        initialValue:'',
        rules: []
      })(<TextArea rows={4}/>)}
    </Form.Item>
    <div className={styles.btnWrap}>
      <Button type='primary' htmlType='submit' disabled={addloading}>
        <Spin spinning={addloading} size='small' style={{marginRight:10}}/> 
        <span>??????</span>
      </Button>
      <Button onClick={()=>{
        setAddFromSourcevisible(false)
      }}>??????</Button>
    </div>
  </Form>
})

export default Form.create({name:'addFromSource'})(AddFromSource);