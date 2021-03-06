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
  Radio,
  Upload,
} from '@chaoswise/ui';
import { useState } from 'react';
import {
  getProjectsService,
  getTagsService,
  addComponentService,
  getListDataService,
  addTagService,
} from '../../services';
import {
  componentCoverTypes,
  componentCoverTypeMapping,
} from '@/config/global';
import API from '@/services/api/component';
import globalStore from '@/stores/globalStore';

const { Option } = Select;
const { TextArea } = Input;

const AddComponent = observer((props) => {
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } =
    props.form;

  const {
    setAddModalvisible,
    treeData,
    projectsData,
    tagsData,
    getListData,
    getTagsData,
    selectedData,
  } = store;
  const { userInfo={} } = globalStore;
  const { iuser={} } = userInfo;
  // console.log(toJS(selectedData));
  const [addloading, setAddloading] = useState(false);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (!err) {
        const cateData = JSON.parse(values.category);
        values.category = cateData.one;
        values.subCategory = cateData.two;
        if (values.automaticCover !== componentCoverTypeMapping.system.id) {
          values.componentCover = values.componentCover
            ? values.componentCover[0].url
            : null;
        }
        values.desc = values.desc ? values.desc : undefined;
        if (values.tags) {
          values.tags = values.tags.map((item) => ({ name: item }));
        }
        setAddloading(true);
        const res = await addComponentService(values);
        if (res && res.code == 0) {
          setAddloading(false);
          message.success('???????????????');
          props.form.resetFields();
          setAddModalvisible(false);
          getListData();
          //???????????????
          getTagsData();
        } else {
          setAddloading(false);
          message.error(res.msg);
        }
      }
    });
  };
  return (
    <Form onSubmit={handleSubmit} className={styles.componentDevelopLabel}>
      <Form.Item label='????????????'>
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '???????????????????????????',
            },
            {
              max: 20,
              message: '???????????????20????????????',
            },
          ],
        })(<Input />)}
      </Form.Item>
      {/* <Form.Item label="????????????">
      {getFieldDecorator('logo', {
        rules: [
          {
            required: true,
            message: '???????????????????????????'
          }
        ]
      })(<Input />)}
    </Form.Item> */}
      <Form.Item
        label={
          <div>
            <Popover
              placement='left'
              content={
                <>
                  <p style={{ width: 200 }}>
                    ??????????????????????????????????????????????????????????????????"????????????"??????????????????????????????????????????
                  </p>
                  <p style={{ width: 200 }}>
                    ??????????????????????????????????????????????????????????????????????????????????????????????????????
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
            <span>????????????</span>
          </div>
        }
      >
        {getFieldDecorator('type', {
          initialValue: 'project',
          rules: [
            {
              required: true,
              message: '???????????????????????????',
            },
          ],
        })(
          <Select>
            <Option value='project'>????????????</Option>
            {iuser.isAdmin ? <Option value='common'>????????????</Option> : null}
          </Select>
        )}
      </Form.Item>
      {getFieldValue('type') == 'common' ? null : (
        <Form.Item label='????????????'>
          {getFieldDecorator('projects', {
            rules: [
              {
                required: true,
                message: '???????????????????????????',
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
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
      )}
      <Form.Item label='????????????'>
        {getFieldDecorator('category', {
          rules: [
            {
              required: true,
              message: '???????????????????????????',
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
                  };
                }),
              };
            })}
            placeholder='?????????'
            treeDefaultExpandAll
          />
        )}
      </Form.Item>
      <Form.Item
        label='????????????'
        style={
          getFieldValue('automaticCover') ==
          componentCoverTypeMapping.manualUpload.id
            ? { marginBottom: '10px' }
            : {}
        }
      >
        {getFieldDecorator('automaticCover', {
          initialValue: componentCoverTypeMapping.system.id,
          rules: [
            {
              required: true,
              message: '??????????????????????????????',
            },
          ],
        })(
          <Radio.Group name='componentCoverType'>
            {componentCoverTypes.map((type) => {
              return (
                <Radio key={`componentCoverType-${type.id}`} value={type.id}>
                  {type.name}
                </Radio>
              );
            })}
          </Radio.Group>
        )}
      </Form.Item>
      {getFieldValue('automaticCover') ==
      componentCoverTypeMapping.manualUpload.id ? (
        <Form.Item wrapperCol={{ offset: 4 }} style={{ marginBottom: '10px' }}>
          <p className={styles.uploadImgInfo}>
            ???????????????JPG/JPEG/PNG??????????????????????????????????????????????????????200px*112px
          </p>
          {getFieldDecorator('componentCover', {
            initialValue: null,
            rules: [
              {
                required: true,
                message: '????????????????????????',
              },
            ],
            valuePropName: 'fileList',
            getValueFromEvent: (e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            },
          })(
            <Upload
              accept='.jpg,.jpeg,.png'
              className={styles.uploadComponentImg}
              action={API.UPLOAD_COMPONENT_COVER}
              listType='picture-card'
              onChange={({ file, fileList }) => {
                if (file.status === 'done') {
                  file.url = JSON.parse(file.xhr.response).data;
                  file.thumbUrl =
                    window.LCAP_CONFIG.snapshotAddress + '/' + file.url;
                  fileList[0].url = file.url;
                  fileList[0].thumbUrl =
                    window.LCAP_CONFIG.snapshotAddress + '/' + file.url;
                  setTimeout(() => {
                    setFieldsValue({
                      componentCover: fileList,
                    });
                  }, 0);
                } else if (file.status === 'error') {
                  setTimeout(() => {
                    setFieldsValue({
                      componentCover: [],
                    });
                  }, 0);
                  return message.error('?????????????????????????????????');
                }
              }}
            >
              {(getFieldValue('componentCover') || []).length === 0 ? (
                <div className={styles.uploadImgWrap}>
                  <div className={styles.uploadImgButton}>
                    <Icon
                      className={styles.uploadImgButtonIcon}
                      type={'plus'}
                    />
                    <div className={styles.uploadImgButtonText}>????????????</div>
                  </div>
                </div>
              ) : null}
            </Upload>
          )}
        </Form.Item>
      ) : (
        ''
      )}

      <Form.Item label='??????'>
        {getFieldDecorator('tags', {
          rules: [],
        })(
          <Select mode='tags'>
            {tagsData.map((v, k) => {
              return (
                <Option value={v.name} key={v.id}>
                  {v.name}
                </Option>
              );
            })}
          </Select>
        )}
      </Form.Item>
      {/* <Form.Item label="????????????">
      {getFieldDecorator('status', {
        initialValue:'1',
        rules: []
      })(<Select
        disabled
      >
        <Option value='1'>?????????</Option>
      </Select>)}
    </Form.Item> */}
      <Form.Item label='??????'>
        {getFieldDecorator('desc', {
          initialValue: '',
          rules: [],
        })(<TextArea rows={4} />)}
      </Form.Item>
      <div className={styles.btnWrap}>
        <Button type='primary' htmlType='submit' disabled={addloading}>
          <Spin
            spinning={addloading}
            size='small'
            style={{ marginRight: 10 }}
          />
          <span>??????</span>
        </Button>
        <Button
          onClick={() => {
            setAddModalvisible(false);
          }}
        >
          ??????
        </Button>
        
      </div>
    </Form>
  );
});

export default Form.create({ name: 'addComponent' })(AddComponent);
