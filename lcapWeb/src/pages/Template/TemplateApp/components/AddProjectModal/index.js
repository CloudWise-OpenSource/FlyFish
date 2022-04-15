import React from "react";
import { Modal, Input, Select, Form, Button } from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;
import { observer, toJS } from '@chaoswise/cw-mobx';

import { APP_DEVELOP_STATUS } from '@/config/global';

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ form, project = {}, type, projectList, tagList, onChange, onSave, onCopy, onCancel }) {
    const intl = useIntl();
    const projectData = toJS(project);
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                onCopy && delete values.developStatus && onCopy(project.id, {
                  ...values,
                  tags: values.tags && values.tags.map(item => {
                    return { name: item };
                  })
                });
              }
            });
          }
        }}
        size="middle"
        title={(() => {
          return intl.formatMessage({
            id: "pages.applyDevelop.use",
            defaultValue: "使用模板",
          });
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
          <Form.Item label="应用名称" name={"name"}>
            {getFieldDecorator("name", {

              initialValue: projectData.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "应用名称",
                }
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "应用名称"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="所属项目" name={"projectId"}>
            {getFieldDecorator("projectId", {
              initialValue: projectData.projectId,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "请选择",
                    }) + "所属项目",
                },
              ],
            })(
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "所属项目"
                }
              >
                {
                  projectList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="标签" >
            {getFieldDecorator("tags", {
              initialValue: projectData.tags,

            })(
              <Select
                mode='tags'
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "标签"
                }
              >
                {
                  tagList.length > 0 ? tagList.map(item => {
                    return <Option key={item.name} value={item.name}>{item.name}</Option>;
                  }) : null
                }
              </Select>
            )}
          </Form.Item>

          <Form.Item label="开发状态" name={"developStatus"}>
            {getFieldDecorator("developStatus", {
              initialValue: projectData.developStatus,
            })(
              <Select
                disabled={true}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "开发状态"
                }
              >
                {
                  APP_DEVELOP_STATUS.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
