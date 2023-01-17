import React from 'react';
import styles from './style.less';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from '../../model/index';
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Icon,
  Popover,
  TreeSelect,
  message,
  Spin,
  Upload,
  Progress,
  DemoShow,
  Space,
} from '@chaoswise/ui';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  getProjectsService,
  getTagsService,
  addComponentService,
  getListDataService,
  addTagService,
  importsource,
} from '../../services';
import API from '../../../../../services/api/component';
import { set, value } from '@chaoswise/utils';
import globalStore from '@/stores/globalStore';
import { componentCoverTypeMapping } from '../../../../../config/global';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const AddFromSource = observer((props) => {
  const { getFieldDecorator, validateFields, getFieldValue } = props.form;

  const {
    setAddFromSourcevisible,
    treeData,
    projectsData,
    tagsData,
    getListData,
    getTagsData,
    selectedData,
  } = store;
  const { userInfo = {} } = globalStore;
  const { iuser = {} } = userInfo;

  const [uploadId, setUploadId] = useState('');
  const [addloading, setAddloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileList, setUploadFileList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields(async (err, value) => {
      if (!err) {
        let { sourceFile, ...values } = value;;
        const cateData = JSON.parse(values.category);
        values.category = cateData.one;
        values.subCategory = cateData.two;
        values.desc = values.desc ? values.desc : undefined;
        values.automaticCover = componentCoverTypeMapping.system.id;
        if (values.tags) {
          values.tags = values.tags.map((item) => ({ name: item }));;
        }
        setAddloading(true);
        const res = await addComponentService(values);
        console.log('uploadFileList', uploadFileList);
        if (res && res.code == 0) {
          setUploadFileList([]);
          let uploadFileFormData = new FormData();
          uploadFileFormData.append('file', uploadFileList[0]);;
          setAddloading(false);
          props.form.resetFields();
          setAddFromSourcevisible(false);
          setUploadProgress(0);
          getListData();
          //刷新标签库
          getTagsData();
          const uploadRes = await importsource(res.data.id, uploadFileFormData);;
          if (uploadRes && uploadRes.code === 0) {
            message.success('添加成功！');
          } else {
            message.error('组件创建成功，源码' + uploadRes.msg);
          }
          setUploadProgress(0);
        } else {
          setAddloading(false);
          message.error(res.msg);
        }
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit} className={styles.componentDevelopLabel}>
      <Form.Item label='组件名称'>
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '组件名称不能为空！',
            },
            {
              max: 20,
              message: '组件名称长度不能超过50！',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item
        label={
          <>
            <Popover
              placement='left'
              content={
                <>
                  <p style={{ width: 200 }}>
                    组件类别用于区分项目组件或基础组件，默认选择"项目组件"，即特定项目可以使用的组件。
                  </p>
                  <p style={{ width: 200 }}>
                    基础组件默认所有项目都可以使用；只有管理员才能将组件修改为基础组件。
                  </p>
                </>
              }
            >
              <Icon
                type='question-circle'
                style={{
                  margin: '0px 5px',
                  verticalAlign: 'middle',
                  transform: 'translateY(-2px)',
                }}
              />
            </Popover>
            <span>组件类别</span>
          </>
        }
      >
        {getFieldDecorator('type', {
          initialValue: 'project',
          rules: [
            {
              required: true,
              message: '组件类别不能为空！',
            },
          ],
        })(
          <Select>
            <Option value='project'>项目组件</Option>
            {iuser.isAdmin ? <Option value='common'>基础组件</Option> : null}
          </Select>
        )}
      </Form.Item>
      {getFieldValue('type') == 'common' ? null : (
        <Form.Item label='所属项目'>
          {getFieldDecorator('projects', {
            rules: [
              {
                required: true,
                message: '所属项目不能为空！',
              },
            ],
          })(
            <Select
              mode='multiple'
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {projectsData.map((v, k) => {
                return (
                  <Option value={v.id} key={v.id}>
                    {v.name}
                  </Option>;
                );
              })}
            </Select>
          )}
        </Form.Item>
      )}
      <Form.Item label='组件分类'>
        {getFieldDecorator('category', {
          rules: [
            {
              required: true,
              message: '组件分类不能为空！',
            },
          ],
          initialValue: selectedData.subCategory
            ? JSON.stringify({
                one: selectedData.category,
                two: selectedData.subCategory,
              })
            : undefined,
        })(
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData.map((v, k) => {
              return {
                title: v.name,
                value: v.id,
                key: k + '',
                disabled: true,
                children: v.children.map((v1, k1) => {
                  return {
                    title: v1.name,
                    value: JSON.stringify({ one: v.id, two: v1.id }),
                    key: k + '-' + k1,
                  };;
                }),
              };;
            })}
            placeholder='请选择'
            treeDefaultExpandAll
          />
        )}
      </Form.Item>
      <Form.Item label='源码文件'>
        {getFieldDecorator('sourceFile', {
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value.fileList.length) {
                  callback();
                } else {
                  callback('请传入源码文件');;
                }
              },
            },
          ],
        })(
          <Dragger
            accept='.zip'
            height={170}
            name='file'
            fileList={uploadFileList}
            showUploadList={true}
            beforeUpload={(file, fileList) => {
              setUploadFileList([file]);
              return false;
            }}
            onRemove={() => {
              setUploadFileList([]);
            }}
          />
        )}
      </Form.Item>
      <Form.Item label='标签'>
        {getFieldDecorator('tags', {
          rules: [],
        })(
          <Select mode='tags'>
            {tagsData.map((v, k) => {
              return (
                <Option value={v.name} key={v.id}>
                  {v.name}
                </Option>;
              );
            })}
          </Select>
        )}
      </Form.Item>
      <Form.Item label='描述'>
        {getFieldDecorator('desc', {
          initialValue: '',
          rules: [],
        })(<TextArea maxLength={100} showCount={true} />)}
      </Form.Item>
      <div className={styles.btnWrap}>
        <Button type='primary' htmlType='submit' disabled={addloading}>
          <Spin
            spinning={addloading}
            size='small'
            style={{ marginRight: 10 }}
          />
          <span>保存</span>
        </Button>
        <Button
          onClick={() => {
            setAddFromSourcevisible(false);;
          }}
        >
          取消
        </Button>
      </div>
    </Form>;
  );
});;

export default Form.create({ name: 'addFromSource' })(AddFromSource);
