import React from "react";
import { Modal, Input, Select, Form, Icon, message, Tooltip } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { toJS } from "@chaoswise/cw-mobx";
import styles from './index.less';
export default Form.create({ name: "FORM_IN_APII_MODAL" })(
  function EditApiModal({ flag, list, form, onChange, project = {}, onSave, onCancel }) {
    const intl = useIntl();
    let [parameterArr, setParameterArr] = React.useState([]); //访问限制参数

    const { getFieldDecorator } = form;
    return (
      <Modal
        width='60%'
        draggable
        okText='保存'
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                if (!values.desc) delete values.desc;
                if (parameterArr.length > 0 && parameterArr.find(item => !item.name || !item.value)) {
                  message.error('参数值不能为空');
                  return;
                }
                let sendObj={
                  ...values,
                  parameterArr:parameterArr||null
                };
                flag ?
                  console.log('查看一下参数', sendObj)
                  // onSave &&
                  // onSave(values)
                  :
                  onChange &&
                  onChange(project.id, {});
              }
            });
          }
        }}
        size="middle"
        title={
          !flag
            ? intl.formatMessage({
              id: "pages.apiManage.edit",
              defaultValue: "编辑应用",
            })
            : intl.formatMessage({
              id: "pages.apiManage.createOne",
              defaultValue: "创建应用",
            })
        }
        visible={true}
      >
        <Form
          labelCol={{
            xs: { span: 5 },
            sm: { span: 5 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
          }}
          initialvalues={project || {}}
        >
          <Form.Item label="应用名称" >
            {getFieldDecorator("name", {
              initialValue: project.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "应用名称",
                },
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
          <Form.Item label="描述" >
            {getFieldDecorator("desc", {
              initialValue: project.desc,
            })(
              <Input.TextArea
                row={3}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "描述"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="访问限制参数" className={styles.apiModal}>
            {
              parameterArr.length > 0 && parameterArr.map((item, index) => {
                return (
                  <div className={styles.arrContainer} key={index}>
                    <Input className={styles.input} value={parameterArr[index].name} onChange={(e) => {
                      parameterArr[index].name = e.target.value;
                      setParameterArr(parameterArr.splice(0));
                    }}
                    />
                    <Icon type="pause" style={{ transform: 'rotate(90deg)' }} className={styles.icon} />
                    <Input className={styles.input}
                      value={parameterArr[index].value} onChange={(e) => {
                        parameterArr[index].value = e.target.value;
                        setParameterArr(parameterArr.splice(0));
                      }}
                    />
                    <Icon type="close-circle" className={styles.icon} onClick={() => {
                      setParameterArr(parameterArr => {
                        parameterArr.splice(index, 1);
                        return parameterArr.splice(0);
                      });
                    }} />
                    <Tooltip title={() => {
                      return (
                        <div style={{ paddingBottom: '10px', lineHeight: '25px' }}>
                          <div>1、该应用访问访问某个API时，自动带上访问参数;</div>
                          <div>2、若访问数据没有该参数，则不返回任务结果;</div>
                        </div>
                      );
                    }}>
                      <Icon type="question-circle" className={styles.icon} />
                    </Tooltip>
                  </div>
                );
              })
            }
            <span className={styles.addContainer} onClick={() => {
              if (parameterArr.length >= 5) {
                message.error('最多仅支持5个参数!');
                return;
              }
              setParameterArr(state => {
                return [
                  ...state,
                  {
                    name: '',
                    value: ''
                  }
                ];
              });

            }}>
              <Icon type="plus-circle" className={styles.icon} />添加</span>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
