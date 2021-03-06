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
  Radio,
  Upload,
} from '@chaoswise/ui';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  getProjectsService,
  getTagsService,
  editComponentService,
} from '../../services';
import {
  componentCoverTypes,
  componentCoverTypeMapping,
} from '@/config/global';
import API from '@/services/api/component';
import globalStore from '@/stores/globalStore';
const { Option } = Select;
const { TextArea } = Input;

const EditComponent = observer((props) => {
  const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } =
    props.form;

  const {
    setEditModalvisible,
    treeData,
    editData,
    getListData,
    tagsData,
    projectsData,
  } = store;
  const { userInfo={} } = globalStore;
  const { iuser={} } = userInfo;
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
        } else {
          values.componentCover = null;
        }
        if (
          values.componentCover === editData.cover ||
          values.componentCover == null
        ) {
          delete values.componentCover;
        }
        if (values.tags) {
          values.tags = values.tags.map((item) => ({ name: item }));
        }
        // values.desc=(values.desc?values.desc:undefined);
        // values.name=undefined;
        const res = await editComponentService(editData.id, values);
        if (res && res.code == 0) {
          message.success('???????????????');
          setEditModalvisible(false);
          getListData();
        } else {
          message.error(res.msg);
        }
      }
    });
  };
  useEffect(() => {
    setFieldsValue({
      projects: editData.projects.map((item) => item.id),
      desc: editData.desc,
    });
  }, [editData]);
  return (
    <Form onSubmit={handleSubmit} className={styles.componentDevelopLabel}>
      <Form.Item label='????????????'>
        {getFieldDecorator('name', {
          initialValue: editData.name,
          rules: [
            {
              required: true,
              message: '???????????????????????????',
            },
            {
              max: 20,
              message: '???????????????20????????????',
            },
            {
              pattern: /^[^\s]*$/,
              message: "?????????????????????????????????"
            }
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
          </>
        }
      >
        {getFieldDecorator('type', {
          initialValue: editData.type,
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
            initialValue: editData.projects.map((item) => item.id),
            preserve: false,
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
          initialValue: JSON.stringify({
            one: editData.category,
            two: editData.subCategory,
          }),
          rules: [
            {
              required: true,
              message: '???????????????????????????',
            },
          ],
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
          initialValue: editData.automaticCover
            ? editData.automaticCover
            : componentCoverTypeMapping.system.id,
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
            initialValue:
              editData.automaticCover ==
                componentCoverTypeMapping.manualUpload.id && editData.cover
                ? [
                    {
                      uid: '-1',
                      name: 'image.png',
                      status: 'done',
                      url: editData.cover,
                      thumbUrl:
                        window.LCAP_CONFIG.snapshotAddress + editData.cover,
                    },
                  ]
                : [],
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
          initialValue: editData.tags.map((item) => item.name),
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
          initialValue: editData.desc,
          rules: [],
        })(<TextArea rows={4} />)}
      </Form.Item>
      <div className={styles.btnWrap}>
        <Button type='primary' htmlType='submit'>
          ??????
        </Button>
        <Button
          onClick={() => {
            setEditModalvisible(false);
          }}
        >
          ??????
        </Button>
      </div>
    </Form>
  );
});

export default Form.create({ name: 'editComponent' })(EditComponent);
