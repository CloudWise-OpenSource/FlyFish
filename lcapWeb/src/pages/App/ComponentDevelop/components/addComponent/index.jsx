import React, { useEffect } from 'react';
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
import { useIntl } from 'react-intl';

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
  const { userInfo = {} } = globalStore;
  const { iuser = {} } = userInfo;
  // console.log(toJS(selectedData));
  const [addloading, setAddloading] = useState(false);
  const intl = useIntl();

  useEffect(() => {
    return () => {
      setAddloading(false);
    };
  }, []);

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  };
  const validateToTag = (rule, value = '', callback) => {
    let across = true;
    value != '' &&
      value.map((item) => {
        if (item.length > 20) across = false;
      });
    if (!across) {
      callback(
        intl.formatMessage({
          id: 'components.addComponent.validTagLengthMessage',
          defaultValue: '标签名称不能超过20个字符！',
        })
      );
    } else {
      callback();
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (!err) {
        const cateData = JSON.parse(values.category);
        values.category = cateData.one;
        values.subCategory = cateData.two;
        if (values.automaticCover !== componentCoverTypeMapping.system.id) {
          values.componentCover =
            values.componentCover && values.componentCover.length > 0
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
          message.success('添加成功！');
          props.form.resetFields();
          setAddModalvisible(false);
          getListData();
          //刷新标签库
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
      <Form.Item label='组件名称'>
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '组件名称不能为空！',
            },
            {
              max: 20,
              message: '请最多输入20个字符！',
            },
          ],
        })(<Input maxLength={20} />)}
      </Form.Item>
      {/* <Form.Item label="组件标识">
      {getFieldDecorator('logo', {
        rules: [
          {
            required: true,
            message: '组件标识不能为空！'
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
          </div>
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
                  </Option>
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
                  };
                }),
              };
            })}
            placeholder='请选择'
            treeDefaultExpandAll
          />
        )}
      </Form.Item>
      <Form.Item
        label='封面设置'
        style={{ marginBottom: '10px', display: 'none' }}
      >
        {getFieldDecorator('automaticCover', {
          initialValue: componentCoverTypeMapping.manualUpload.id,
          rules: [
            {
              required: true,
              message: '请选择组件封面设置！',
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
        <Form.Item label='封面设置' style={{ marginBottom: '10px' }}>
          <p className={styles.uploadImgInfo}>
            图片格式：JPG/JPEG/PNG格式，仅支持长宽等比例图片，建议大小200px*112px
          </p>
          {getFieldDecorator('componentCover', {
            initialValue: null,
            rules: [],
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
                    window.FLYFISH_CONFIG.snapshotAddress + '/' + file.url;
                  fileList[0].url = file.url;
                  fileList[0].thumbUrl =
                    window.FLYFISH_CONFIG.snapshotAddress + '/' + file.url;
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
                  return message.error('上传失败，请稍后重试！');
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
                    <div className={styles.uploadImgButtonText}>点击上传</div>
                  </div>
                </div>
              ) : null}
            </Upload>
          )}
        </Form.Item>
      ) : (
        ''
      )}

      <Form.Item label='标签'>
        {getFieldDecorator('tags', {
          rules: [
            {
              validator: validateToTag,
            },
          ],
        })(
          <Select mode='tags' maxTagTextLength={20}>
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
      {/* <Form.Item label="开发状态">
      {getFieldDecorator('status', {
        initialValue:'1',
        rules: []
      })(<Select
        disabled
      >
        <Option value='1'>开发中</Option>
      </Select>)}
    </Form.Item> */}
      <Form.Item label='描述'>
        {getFieldDecorator('desc', {
          initialValue: '',
          rules: [],
        })(
          <TextArea
            maxLength={100}
            showCount={true}
            style={{ width: '100%' }}
          />
        )}
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
            setAddModalvisible(false);
          }}
        >
          取消
        </Button>
      </div>
    </Form>
  );
});

export default Form.create({ name: 'addComponent' })(AddComponent);
