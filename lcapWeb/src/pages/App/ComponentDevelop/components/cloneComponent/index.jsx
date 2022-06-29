import React, { useEffect } from 'react';
import styles from './style.less';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from './model/index';
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
  componentCoverTypes,
  componentCoverTypeMapping,
} from '@/config/global';
import API from '@/services/api/component';
import { copyComponentService } from '@/pages/App/ComponentDevelop/services';

const { Option } = Select;
const { TextArea } = Input;

const CloneComponent = observer(
  ({
    form,
    cloneId,
    record,
    tree,
    projects,
    tags,
    user,
    onCancel,
    onSaved,
  }) => {
    const { getFieldDecorator, validateFields, getFieldValue, setFieldsValue } =
      form;

    const { treeData, projectsData, tagsData, userInfo } = store;

    // console.log(toJS(selectedData));
    const [addloading, setCloneloading] = useState(false);
    const [componentCoverUploadImgList, setComponentCoverUploadImgList] =
      useState([]);

    useEffect(() => {
      if (tree) {
        store.setTreeData(tree);
      } else {
        store.getTreeData();
      }
      if (user) {
        store.setUserInfo(user);
      } else {
        store.getUserInfo();
      }
      if (projects) {
        store.setProjectsData(projects);
      } else {
        store.getProjectsData();
      }
      if (tags) {
        store.setTagsData(tags);
      } else {
        store.getTagsData();
      }
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      validateFields(async (err, values) => {
        if (!err) {
          const cateData = JSON.parse(values.category);
          values.category = cateData.one;
          values.subCategory = cateData.two;
          values.desc = values.desc ? values.desc : undefined;
          if (values.automaticCover !== componentCoverTypeMapping.system.id) {
            values.componentCover = values.componentCover
              ? values.componentCover[0].url
              : null;
          }
          if (values.tags) {
            values.tags = values.tags.map((item) => ({ name: item }));
          }
          setCloneloading(true);
          const res = await copyComponentService(cloneId, values);
          if (res && res.code == 0) {
            setCloneloading(false);
            message.success('复制成功！');
            form.resetFields();
            //刷新
            onSaved && onSaved();
          } else {
            setCloneloading(false);
            message.error(res.msg || '复制失败，请稍后重试！');
          }
        }
      });
    };

    if (!record) {
      return '';
    }
    return (
      <Form className={styles.componentDevelopLabel} onSubmit={handleSubmit}>
        <Form.Item label='组件名称'>
          {getFieldDecorator('name', {
            initialValue: record.name,
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
              {userInfo.isAdmin ? (
                <Option value='common'>基础组件</Option>
              ) : null}
            </Select>
          )}
        </Form.Item>
        {getFieldValue('type') == 'common' ? null : (
          <Form.Item label='所属项目'>
            {getFieldDecorator('projects', {
              initialValue: record.projects
                ? record.projects.map((item) => item.id)
                : [],
              preserve: false,
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
            initialValue: JSON.stringify({
              one: record.category,
              two: record.subCategory,
            }),
            rules: [
              {
                required: true,
                message: '组件分类不能为空！',
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
              placeholder='请选择'
              treeDefaultExpandAll
            />
          )}
        </Form.Item>
        <Form.Item
          label='封面设置'
          style={
            getFieldValue('automaticCover') ==
            componentCoverTypeMapping.manualUpload.id
              ? { marginBottom: '10px' }
              : {}
          }
        >
          {getFieldDecorator('automaticCover', {
            initialValue: record.automaticCover
              ? record.automaticCover
              : componentCoverTypeMapping.system.id,
            rules: [],
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
          <Form.Item
            wrapperCol={{ offset: 4 }}
            style={{ marginBottom: '10px' }}
          >
            <p className={styles.uploadImgInfo}>
              图片格式：JPG/JPEG/PNG格式，仅支持长宽等比例图片，建议大小200px*112px
            </p>
            {getFieldDecorator('componentCover', {
              initialValue:
                record.automaticCover ==
                  componentCoverTypeMapping.manualUpload.id && record.cover
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: record.cover,
                        thumbUrl:
                          window.LCAP_CONFIG.snapshotAddress + record.cover,
                      },
                    ]
                  : [],
              rules: [
                {
                  required: true,
                  message: '请上传组件封面！',
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
            initialValue: record.tags.map((item) => item.name),
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
        <Form.Item label='描述'>
          {getFieldDecorator('desc', {
            initialValue: record.desc,
            rules: [],
          })(<TextArea rows={4} />)}
        </Form.Item>
        <div className={styles.btnWrap}>
            <Button
              onClick={() => {
                onCancel && onCancel();
              }}
            >
              取消
            </Button>
            <Button type='primary' htmlType='submit' disabled={addloading}>
              <Spin
                spinning={addloading}
                size='small'
                style={{ marginRight: 10 }}
              />
              <span>保存</span>
            </Button>
        </div>
      </Form>
    );
  }
);

export default Form.create({ name: 'cloneComponent' })(CloneComponent);
