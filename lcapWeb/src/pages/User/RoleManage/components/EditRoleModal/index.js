import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
  function EditRoleModal({ form, role = {}, onSave,onChange, onCancel,flag }) {
    const intl = useIntl();
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
               flag? onSave &&
                  onSave({
                    ...role,
                    ...values,
                  }):onChange&&onChange(role.id,{
                    desc:values.desc
                  });
              }
            });
          }
        }}
        size="middle"
        title={
          !flag
            ? intl.formatMessage({
              id: "pages.roleManage.edit",
              defaultValue: "编辑角色",
            })
            : intl.formatMessage({
              id: "pages.roleManage.create",
              defaultValue: "添加角色",
            })
        }
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
          initialvalues={role || {}}
        >
          <Form.Item label="角色名" name={"name"}>
            {getFieldDecorator("name", {
              initialValue: role.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "角色名",
                },
              ],
            })(
              <Input
                disabled={!flag}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "角色名"
                }
              />
            )}
          </Form.Item><Form.Item label="描述" name={"desc"}>
            {getFieldDecorator("desc", {
              initialValue: role.desc,
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "描述",
                }
              ],
            })(
              <Input.TextArea
              row={3}
              />
            )}
          </Form.Item>
         
          
        </Form>
      </Modal>
    );
  }
);
