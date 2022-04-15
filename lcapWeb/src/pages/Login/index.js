import React from "react";
import { Modal, Input, Select, Form, Button } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import store from './model/index';
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ form }) {
    let project = {};
    const intl = useIntl();
    const {
      register,
      login
    } = store;
    const { getFieldDecorator } = form;
    return (
      <>
        <Form
          labelCol={{
            xs: { span: 6 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
          }}
          initialvalues={project}
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
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "用户名"
                }
              />
            )}
          </Form.Item>
         
          <Form.Item label="密码" name={"password"}>
            {getFieldDecorator("password", {
              initialValue: project.password,
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
        <Button onClick={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                register(values);
              }
            });
          }
        }}>注册</Button>
        
        <Button onClick={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                login(values);
              }
            });
          }
        }}>登录</Button>
      </>

    );
  }
);
