import React, { useEffect, useState, useRef } from "react";
import { Modal, Input, Select, Form, Button, message } from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;
import JSONPath from 'JSONPath';
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
  function EditactiveItemModal({ form, activeItem = {}, columnsArr = [], onSave, onCancel, lookDataJson }) {
    const intl = useIntl();
    const [resultValue, setResultValue] = useState('');
    const [sendValue, setSendValue] = useState('');
    const { getFieldDecorator, setFieldsValue } = form;
    useEffect(() => {
      setSendValue(activeItem?.resultValue)
      setFieldsValue({
        resultValue: JSON.stringify(activeItem?.resultValue)
      })
    }, [activeItem])
    return (
      <Modal
        draggable
        maskClosable={false}
        style={{ marginTop: '10vh' }}
        width={500}
        onCancel={() => {
          onCancel && onCancel(false);
        }}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                if (!activeItem.id) {
                  if (columnsArr && columnsArr.length > 0 && columnsArr.findIndex(item => item.fieldName == values.fieldName) !== -1) {
                    message.error('表格中已有相同名称的列,请修改名称后再进行新增!');
                    return;
                  }
                } else {
                  if (columnsArr && columnsArr.length > 0 && columnsArr.findIndex(item => item.fieldName == values.fieldName) !== -1
                    && values.fieldName !== activeItem.fieldName
                  ) {
                    message.error('表格中已有相同名称的列,请修改名称后再进行新增!');
                    return;
                  }
                }
                onSave && onSave({
                  ...activeItem,
                  fieldName: values.fieldName,
                  fieldType: values.fieldType,
                  jsonpath: values.jsonpath,
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
          initialvalues={activeItem || {}}
        >
          <Form.Item label="字段名称" name={"fieldName"}>
            {getFieldDecorator("fieldName", {
              initialValue: activeItem.fieldName,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "字段名称",
                }, {
                  max: 20,
                  message: "字段名称长度不能超过20个字符!",
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
          <Form.Item label="字段类型" name={"fieldType"}>
            {getFieldDecorator("fieldType", {
              initialValue: activeItem.fieldType || 'String',
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
          <Form.Item label="数据抽取" name={"jsonpath"}>
            {getFieldDecorator("jsonpath", {
              initialValue: activeItem.jsonpath,
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
                      if (a) {
                        setFieldsValue({
                          resultValue: a.map(item => JSON.stringify(item))
                        })
                      }

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
