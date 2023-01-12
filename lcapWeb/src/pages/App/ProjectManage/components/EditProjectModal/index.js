import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { toJS } from "@chaoswise/cw-mobx";

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ flag, list, form, onChange, project = {}, onSave, onCancel }) {
    const intl = useIntl();
    let selectArr = toJS(list);//下拉框总数据
    let newarr = toJS(project).trades;
    const validateToTrade = (rule, value='', callback)=>{
      let across = true;
      value!='' && value.map((item)=>{
        if(item.length > 20) across = false;
      });
      if(!across){
        callback("行业名称不能超过20个字符！");
      }else{
        callback();
      }
    }
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        okText='保存'
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                for (let i in values) {
                  if (!values[i]) {
                    delete values[i];
                  }
                }
                let changeObj=values.desc?values:{...values,desc:''};

                flag ?
                  onSave &&
                  onSave({
                    ...values,
                    trades: values.trades&&values.trades.map(item => {
                      return { name: item };
                    })
                  })
                  : 
                onChange &&
                  onChange(project.id, {
                    ...changeObj,
                    trades: values.trades&&values.trades.map(item => {
                      return { name: item };
                    })
                  });
              }
            });
          }
        }}
        size="middle"
        title={
          !flag
            ? intl.formatMessage({
              id: "pages.projectManage.edit",
              defaultValue: "编辑项目",
            })
            : intl.formatMessage({
              id: "pages.projectManage.create",
              defaultValue: "添加项目",
            })
        }
        visible={true}
      >
        <Form
          labelCol={{
            xs: { span: 6 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
          }}
          initialvalues={project || {}}
        >
          <Form.Item label="项目名称" >
            {getFieldDecorator("name", {
              initialValue: project.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "项目名称",
                },{
                  pattern: /^[^\s]*$/,
                  message: "请输入正确的项目名称！"
                },
                {
                  max: 20,
                  message: "项目名称不能超过20个字符"
                }
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "项目名称"
                }
              />
            )}
          </Form.Item>
          {flag ? <Form.Item label="行业" >
            {getFieldDecorator("trades", {
              initialValue: project.trades,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "请选择",
                    }) + "行业",
                },
                {
                  validator: validateToTrade
                }
                
              ],
            })(
              <Select
                mode='tags'
                maxTagTextLength={20}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "行业"
                }
              >
                {
                  selectArr ? selectArr.map(item => {
                    return <Select.Option key={item.id} value={item.name} label={item.name}>{item.name}</Select.Option>;
                  }) : null
                }

              </Select>
            )}
          </Form.Item> : <Form.Item label="行业" >
            {getFieldDecorator("trades", {
              initialValue: newarr,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "请选择",
                    }) + "行业",
                },
                {
                  validator: validateToTrade
                }
              ],
            })(
              <Select
                showSearch={true}
                mode='tags'
                maxTagTextLength={20}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "行业"
                }
              >
                {
                  selectArr.map(item => {
                    return <Select.Option key={item.id} value={item.name}>{item.name}</Select.Option>;
                  })
                }

              </Select>
            )}
          </Form.Item>}
          <Form.Item label="描述" >
            {getFieldDecorator("desc", {
              initialValue: project.desc,
            })(
              <Input.TextArea
              autoSize={{ minRows: 3 }}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "描述"
                }
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
