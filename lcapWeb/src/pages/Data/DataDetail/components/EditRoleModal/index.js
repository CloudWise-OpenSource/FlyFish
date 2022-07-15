import React, { useEffect, useState, useRef } from "react";
import { Modal, Input, Select, Form, Button, message } from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;
import JSONPath from 'JSONPath';
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
  function EditRoleModal({ form, role = {}, columnsArr = [], onSave, onCancel, lookDataJson }) {
    const intl = useIntl();
    const [resultValue, setResultValue] = useState('');
    const [sendValue, setSendValue] = useState('');
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        maskClosable={false}
        style={{ marginTop: '10vh' }}
        width={500}
        onCancel={() => {
          onCancel && onCancel();
        }}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                if (columnsArr && columnsArr.length > 0 && columnsArr.findIndex(item => item.title == values.name) !== -1) {
                  message.error('表格中已有相同名称的列,请修改名称后再进行新增!');
                  return;
                }
                onSave && onSave({
                  name: values.name,
                  type: values.type,
                  dataExtraction: values.dataExtraction,
                  resultValue: sendValue
                });
                onCancel(false);
                setResultValue('');
              }
            });
          }
        }}
        size="middle"
        title='新增表格'
        visible={true}
      >
        <Form
          labelAlign='left'
          labelCol={{
            xs: { span: 24 },
            sm: { span: 24 },
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 24 },
          }}
          initialvalues={role || {}}
        >
          <Form.Item label="字段名称" name={"name"}>
            {getFieldDecorator("name", {
              initialValue: role.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "字段名称",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "字段名称"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="字段类型" name={"type"}>
            {getFieldDecorator("type", {
              initialValue: role.type || 'String',
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "选择",
                    }) + "字段类型",
                },
              ],
            })(
              <Select >
                <Option value="String">文本</Option>
                <Option value="Int">整数</Option>
                <Option value="Double" >浮点数</Option>
                <Option value="Boolean">布尔值</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="数据抽取" name={"dataExtraction"}>
            {getFieldDecorator("dataExtraction", {
              initialValue: role.dataExtraction,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "数据抽取",
                },
              ],
            })(
              <Input
                onChange={
                  (e) => {
                    if (e.target.value) {
                      let a = JSONPath({
                        json: toJS(lookDataJson),
                        path: e.target.value
                      });
                      setSendValue(a);
                      setResultValue(a.map(item => JSON.stringify(item)));
                    }

                  }}
                placeholder='$.data[*].subjectId'
              />
            )}
          </Form.Item>
          <Form.Item label="数据预览" name={"resultValue"}>
            {getFieldDecorator("resultValue", {
              initialValue: resultValue,
              rules: [
                {
                  required: true,
                  message: '请查找到正确数据后再进行保存！'
                },
              ],
            })(
              <Input.TextArea
                disabled
                rows={7}         
              />
            )}
          </Form.Item>


        </Form>
      </Modal>
    );
  }
);
