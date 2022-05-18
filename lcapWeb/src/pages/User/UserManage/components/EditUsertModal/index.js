import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
  function EditProjectModal({ form, project = {},flag, onSave, onChange,onCancel }) {
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
                if(flag){
                  onSave &&
                  onSave({
                    ...project,
                    ...values,
                  });
                }else{
                  onChange &&
                  onChange(project.id,{
                    email:values.email,
                    phone:values.phone,
                    password:values.password
                  });
                }
              }
            });
          }
        }}
        size="middle"
        title={
          !flag
            ? intl.formatMessage({
              id: "pages.userManage.edit",
              defaultValue: "编辑用户",
            })
            : intl.formatMessage({
              id: "pages.userManage.create",
              defaultValue: "添加用户",
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
          initialvalues={project || {}}
        >
          <Form.Item label="用户名" name={"username"}>
            {getFieldDecorator("username", {
              initialValue: project.username,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "用户名",
                }
              ],
            })(
              <Input
                disabled={!flag}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "用户名"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="用户邮箱" name={"mail"}>
            {getFieldDecorator("email", {
              initialValue: project.email,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "用户邮箱",
                },
                {
                  pattern: /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/,
                  message: "请输入正确的邮箱格式",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "用户邮箱"
                }
              />
            )}
          </Form.Item>

          <Form.Item label="手机号" name={"phone"}>
            {getFieldDecorator("phone", {
              initialValue: project.phone,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "手机号",
                },
                {
                  pattern: /^[1]([3-9])[0-9]{9}$/ ,
                  message: "请输入正确的手机号",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "手机号"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="密码" name={"password"}>
            {getFieldDecorator("password", {
              initialValue: project.password,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "密码",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "密码"
                }
              />
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
);
