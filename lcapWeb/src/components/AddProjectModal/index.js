import React from 'react';
import { Modal, Input, Select, Form } from '@chaoswise/ui';
import { useIntl } from 'react-intl';
const { Option } = Select;
import { toJS } from '@chaoswise/cw-mobx';

import { APP_DEVELOP_STATUS } from '@/config/global';

export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(
  function EditProjectModal({
    form,
    project = {},
    type,
    projectList,
    tagList,
    addOrChangeFlag,
    onChange,
    onSave,
    onCopy,
    onCancel,
  }) {
    const intl = useIntl();
    const projectData = toJS(project);
    const validateToTag = (rule, value = '', callback) => {
      let across = true;
      value != '' &&
        value.map((item) => {
          if (item.length > 20) across = false;
        });
      if (!across) {
        callback(
          intl.formatMessage({
            id: 'pages.overview.validTagLengthMessage',
            defaultValue: '标签名称不能超过20个字符！',
          })
        );
      } else {
        callback();
      }
    };
    const interStatusFit = [
      'common.underDevelopment',
      'common.underTest',
      'common.delivered',
      'common.demo',
    ];
    const { getFieldDecorator } = form;
    const numberFlag = Number(addOrChangeFlag);
    return (
      <Modal
        draggable
        style={{ marginTop: '10vh' }}
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                if (numberFlag === 0) {
                  onSave &&
                    delete values.developStatus &&
                    onSave({
                      type: type || '2D',
                      ...project,
                      ...values,
                      tags:
                        values.tags &&
                        values.tags.map((item) => {
                          return { name: item };
                        }),
                    });
                }
                if (numberFlag === 1) {
                  onChange &&
                    onChange(project.id, {
                      type: type || '2D',
                      ...values,
                      tags:
                        values.tags &&
                        values.tags.map((item) => {
                          return { name: item };
                        }),
                    });
                }
                if (numberFlag === 2) {
                  onCopy &&
                    delete values.developStatus &&
                    onCopy(project.id, {
                      ...values,
                      tags:
                        values.tags &&
                        values.tags.map((item) => {
                          return { name: item };
                        }),
                    });
                }
                if (numberFlag === 3) {
                  onCopy &&
                    delete values.developStatus &&
                    onCopy(project.id, {
                      ...values,
                      tags:
                        values.tags &&
                        values.tags.map((item) => {
                          return { name: item };
                        }),
                    });
                }
              }
            });
          }
        }}
        size='middle'
        title={(() => {
          if (numberFlag === 0) {
            return intl.formatMessage({
              id: 'common.createApp',
              defaultValue: '添加应用',
            });
          }
          if (numberFlag === 1) {
            return intl.formatMessage({
              id: 'common.editApp',
              defaultValue: '编辑应用',
            });
          }
          if (numberFlag === 2) {
            return intl.formatMessage({
              id: 'common.copyApp',
              defaultValue: '复制应用',
            });
          } else {
            return intl.formatMessage({
              id: 'pages.overview.useTemplates',
              defaultValue: '使用模板',
            });
          }
        })()}
        visible={true}
      >
        <Form
          labelCol={{
            xs: { span: 4 },
            sm: { span: 4 },
          }}
          wrapperCol={{
            xs: { span: 19 },
            sm: { span: 19 },
          }}
          initialvalues={projectData || {}}
        >
          <Form.Item
            label={intl.formatMessage({
              id: 'common.appName',
              defaultValue: '应用名称',
            })}
            name={'name'}
          >
            {getFieldDecorator('name', {
              initialValue: projectData.name,
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'common.inputAppNameInfo',
                    defaultValue: '请输入应用名称',
                  }),
                },
                {
                  pattern: /^[^\s]*$/,
                  message: intl.formatMessage({
                    id: 'common.inputCorrectAppNameInfo',
                    defaultValue: '请输入正确的应用名称！',
                  }),
                },
                {
                  max: 20,
                  message: intl.formatMessage({
                    id: 'common.validAppNameLengthMessage',
                    defaultValue: '应用名称不能超过20个字符！',
                  }),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage({
                  id: 'common.inputAppNameInfo',
                  defaultValue: '请输入应用名称',
                })}
              />
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'common.relyProject',
              defaultValue: '所属项目',
            })}
            name={'projectId'}
          >
            {getFieldDecorator('projectId', {
              initialValue:
                numberFlag === 0 ? projectData.projectId : projectData.projects,
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'common.relyProjectInfo',
                    defaultValue: '请选择所属项目',
                  }),
                },
              ],
            })(
              <Select
                // style={{ width: '510px' }}
                showSearch
                maxTagTextLength={20}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder={intl.formatMessage({
                  id: 'common.relyProjectInfo',
                  defaultValue: '请选择所属项目',
                })}
              >
                {projectList.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'common.tags',
              defaultValue: '标签',
            })}
          >
            {getFieldDecorator('tags', {
              initialValue: projectData.tags,
              rules: [
                {
                  validator: validateToTag,
                },
              ],
            })(
              <Select
                mode='tags'
                maxTagTextLength={20}
                placeholder={intl.formatMessage({
                  id: 'common.tagsInfo',
                  defaultValue: '请选择标签',
                })}
                onChange={(val) => {
                  console.log(val);
                }}
              >
                {tagList.length > 0
                  ? tagList.map((item) => {
                      return (
                        <Option key={item.name} value={item.name}>
                          {item.name}
                        </Option>
                      );
                    })
                  : null}
              </Select>
            )}
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'common.developStatus',
              defaultValue: '开发状态',
            })}
            name={'developStatus'}
          >
            {getFieldDecorator('developStatus', {
              initialValue:
                numberFlag === 0 ? 'doing' : projectData.developStatus,
            })(
              <Select
                disabled={numberFlag !== 1}
                placeholder={intl.formatMessage({
                  id: 'common.chooseDevelopStatus',
                  defaultValue: '请选择开发状态',
                })}
              >
                {APP_DEVELOP_STATUS.map((item, index) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {intl.formatMessage({
                        id: interStatusFit[index],
                        defaultValue: item.name,
                      })}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
