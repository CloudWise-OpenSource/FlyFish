import React from "react";
import { Modal, Input, Select, Form, Button } from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;
import { observer, toJS } from '@chaoswise/cw-mobx';

import { APP_DEVELOP_STATUS } from '@/config/global';

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ form, projectId, project = {}, type, projectList, tagList, addOrChangeFlag, onChange, onSave, onCopy, onCancel }) {
    const intl = useIntl();
    const projectData = toJS(project);
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        style={{ marginTop: '10vh' }}
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                if (addOrChangeFlag === 0) {
                  onSave && delete values.developStatus &&
                    onSave({
                      projectId,
                      type: type || '2D',
                      ...project,
                      ...values,
                      tags: values.tags && values.tags.map(item => {
                        return { name: item };
                      })
                    });
                }
                if (addOrChangeFlag === 1) {
                  onChange && delete values.name &&
                    onChange(project.id, {
                      type: type || '2D',
                      ...values,
                      tags: values.tags && values.tags.map(item => {
                        return { name: item };
                      })
                    });
                }
                if (addOrChangeFlag === 2) {
                  onCopy && delete values.developStatus && onCopy(project.id, {
                    ...values,
                    tags: values.tags && values.tags.map(item => {
                      return { name: item };
                    })
                  });
                }
              }
            });
          }
        }}
        size="middle"
        title={(() => {
          if (addOrChangeFlag === 0) {
            return intl.formatMessage({
              id: "pages.applyDevelop.create",
              defaultValue: "????????????",
            });
          }
          if (addOrChangeFlag === 1) {
            return intl.formatMessage({
              id: "pages.applyDevelop.edit",
              defaultValue: "????????????",
            });
          } else {
            return intl.formatMessage({
              id: "pages.applyDevelop.copy",
              defaultValue: "????????????",
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
          <Form.Item label="????????????" name={"name"}>
            {getFieldDecorator("name", {

              initialValue: projectData.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "?????????",
                    }) + "????????????",
                },{
                  pattern: /^[^\s]*$/,
                  message: "?????????????????????????????????"
                }
              ],
            })(
              <Input
                disabled={addOrChangeFlag === 1}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "?????????",
                  }) + "????????????"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="????????????" name={"projectId"}>
            {getFieldDecorator("projectId", {
              initialValue: addOrChangeFlag === 0 ? projectData.projectId : projectData.projects,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "?????????",
                    }) + "????????????",
                },
              ],
            })(
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                disabled={addOrChangeFlag === 2}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "?????????",
                  }) + "????????????"
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
          <Form.Item label="??????" >
            {getFieldDecorator("tags", {
              initialValue: projectData.tags,

            })(
              <Select
                disabled={addOrChangeFlag === 2}
                mode='tags'
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "?????????",
                  }) + "??????"
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

          <Form.Item label="????????????" name={"developStatus"}>
            {getFieldDecorator("developStatus", {
              initialValue: addOrChangeFlag === 0 ? 'doing' : projectData.developStatus,
            })(
              <Select
                disabled={
                  addOrChangeFlag === 0 || addOrChangeFlag === 2
                }
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "?????????",
                  }) + "????????????"
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
