import React, { useState } from "react";
import { Modal, Input, Select, Form, Icon, message, Tooltip, Switch, Card, Button } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { toJS } from "@chaoswise/cw-mobx";
import styles from './assets/style.less';
export default Form.create({ name: "FORM_IN_APPLICATION" })(
  function ({ location,history, form, application = {} }) {
    const intl = useIntl();
    let [switchFlag, setSwitchFlag] = useState(false);
    const { getFieldDecorator } = form;
    const sendForm = () => {
      if (form && switchFlag) {
        form.validateFields((errors, values) => {
          if (errors == null) {
            console.log('最终数值', values.num);
          }
        });
      }
    };
    return (
      <div className={styles.controlContainer}>
        <div className={styles.topTitleContyainer}>
          <span className={styles.topTitle}>应用访问控制</span>
          <Button onClick={()=>{history.goBack();}}>返回</Button>
        </div>
        <div className={styles.container}>
          <Card bordered={false}
            title={<span >您将对此应用进行访问控制({location.state.name}):此次等同于列表内接应用APP的名称</span>}
          >
            <div className={styles.switchContainer}>
              <span style={{ fontWeight: '700' }}>应用流控策略</span>
              <Switch size='small' style={{ margin: '0 10px' }} onChange={() => { setSwitchFlag(!switchFlag); }} />
              <Tooltip title='流控策略: 每秒实际的并发量超过设置的并发量，则会进行流量控制'>
                <Icon type="question-circle" />
              </Tooltip>
            </div>
            <Form
              labelCol={{
                xs: { span: 4 },
                sm: { span: 4 },
              }}
              wrapperCol={{
                xs: { span: 17 },
                sm: { span: 17 },
              }}
              initialvalues={application || ''}
            >
              <Form.Item label="并发量:" labelAlign="right" >
                {getFieldDecorator("num", {
                  initialValue: application.num,
                  rules: [
                    {
                      required: switchFlag ? true : false,
                      message:
                        intl.formatMessage({
                          id: "common.pleaseInput",
                          defaultValue: "请输入",
                        }) + "并发量",
                    },
                    {
                      pattern: /^[1-9]\d*$/,
                      message: "请输入正确的并发量",
                    },
                  ],
                })(
                  <Input style={{ width: '200px', marginRight: '15px' }}
                    disabled={!switchFlag} />
                )}<span>次/秒</span>
              </Form.Item>
            </Form>
          </Card>
        </div>
        <Button onClick={sendForm} htmlType='submit' type='primary' style={{ marginLeft: '40px' }}>保存</Button>
      </div>

    );
  }
);
