import React from "react";
import { Form } from "antd";
import { Modal, Input } from "@chaoswise/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styles from "./style.less";


export default Form.create({ name: "FORM_IN_DATA_SEARCH_FORM" })(
  ({ form, dataSearch = {}, onSave, onCancel }) => {
    const intl = useIntl();
    const { getFieldDecorator } = form;
    return (
      <Modal
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                onSave &&
                  onSave({
                    ...values,
                  });
              }
            });
          }
        }}
        title={intl.formatMessage({
          id: "common.save",
          defaultValue: "保存",
        })}
        visible
      >
        <Form
          labelCol={{
            xs: { span: 4 },
            sm: { span: 4 },
          }}
          wrapperCol={{
            xs: { span: 20 },
            sm: { span: 19 },
          }}
          className={styles.editModalForm}
          initialvalues={dataSearch || {}}
        >
          <Form.Item
            label={intl.formatMessage({
              id: "pages.dataSearch.queryName",
              defaultValue: "查询名称",
            })}
            name={"queryName"}
            className={styles.editModalFormItem}
          >
            {getFieldDecorator("queryName", {
              initialValue: dataSearch.queryName,
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: "pages.dataSearch.pleaseInputQueryName",
                    defaultValue: "请输入查询名称！",
                  }),
                },
                {
                  max: 20,
                  message: intl.formatMessage({
                    id: "pages.dataSearch.inputQueryNameSizeRule",
                    defaultValue: "请最多输入20个字符！",
                  }),
                },
              ],
            })(
              <Input
                placeholder={intl.formatMessage({
                  id: "pages.dataSearch.pleaseInputQueryName",
                  defaultValue: "请输入查询名称！",
                })}
              />
            )}
          </Form.Item>
          <p style={{ marginLeft: "17%", color: "rgba(0,0,0,0.5)" }}>
            <FormattedMessage
              id="pages.dataSearch.editConfirmMessage"
              defaultValue="如果查询已关联应用，修改后应用内组件将有可能展示异常。"
            />
          </p>
        </Form>
      </Modal>
    );
  }
);
