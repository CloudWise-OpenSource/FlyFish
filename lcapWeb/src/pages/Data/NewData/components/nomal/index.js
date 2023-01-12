import React, { useEffect, useState, useRef } from 'react';
import { Input, Select, Button, message, Icon, Form } from '@chaoswise/ui';
import { useIntl } from 'react-intl';
import enums from '@/utils/enums.js';
import { useHistory } from 'react-router-dom';
const { Option } = Select;

import { successCode } from '@/config/global';
import { toJS } from '@chaoswise/cw-mobx';

import _ from 'lodash';
let dataTypePlaceHolder = {
  MySQL: 'jdbc:mysql://10.2.2.254:18103/cw_douc?createDatabaseIfNotExist=true',
  Postgres:
    'jdbc:postgresql://10.2.2.254:18103/cw_douc?createDatabaseIfNotExist=true',
  HTTP: '',
  ClickHouse: 'jdbc:clickhouse://10.2.3.56:18100/default',
  MariaDB: 'jdbc:mariadb://10.2.3.56:18100/test',
  SqlServer: 'jdbc:sqlserver://localhost:1433;DatabaseName=wrySelectCourse3',
  DM: 'jdbc:dm://10.2.3.56:18100/SYSDBA',
  Oracle: 'jdbc:oracle:thin:@10.2.3.223:18100:helowin',
};
export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(
  function EditProjectModal({
    form,
    activeData = {},
    changeData,
    saveData,
    type,
    dataUsability,
    ref1,
  }) {
    const { getFieldDecorator } = form;
    const [projectData, setProjectData] = useState(activeData); // 初始数据
    const [connectState, setConnectState] = useState(false); // 链接状态
    const [saveLoading, setSaveLoading] = useState(false); //loading
    const history = useHistory();
    const intl = useIntl();

    useEffect(() => {
      // 编辑页挂载
      if (projectData && projectData.schemaType) {
        try {
          setProjectData({
            ...projectData,
            ...JSON.parse(toJS(projectData.connectData)),
          });
        } catch (error) {
          console.log(error);
        }
      }
    }, []);
    ref1.current = {
      deleteAllRules: () => {
        form.resetFields();
      },
    };
    const lookIsUsability = () => {
      form.validateFields(async (err, values) => {
        if (!err) {
          let sendData = {
            datasourceName: values.datasourceName,
            schemaType: type,
            connectData: JSON.stringify(values),
          };
          setConnectState(true);
          dataUsability(sendData, (res) => {
            setConnectState(false);
            if (res.code === successCode && res.data.available) {
              message.success('连接成功！');
            } else {
              message.error(res.msg || '连接失败，请稍后重试！');
            }
          }).catch((res) => {
            setConnectState(false);
          });
        }
      });
    };
    const handleSubmit = (e) => {
      e.preventDefault();
      form.validateFields(async (err, values) => {
        if (!err) {
          if (projectData && projectData.schemaType) {
            let sendData = {};
            sendData = {
              datasourceId: projectData.datasourceId,
              datasourceName: values.datasourceName,
              modelName: values.modelName,
              schemaType: type,
              schemaName: values.schemaName,
              connectData: JSON.stringify(values),
            };
            setSaveLoading(true);
            changeData(sendData, (res) => {
              setSaveLoading(false);
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: 'common.changeSuccess',
                    defaultValue: '编辑成功！',
                  })
                );
                history.push('/data');
              } else {
                message.error(
                  res.msg ||
                    intl.formatMessage({
                      id: 'common.changeError',
                      defaultValue: '编辑失败，请稍后重试！',
                    })
                );
              }
            }).catch((res) => {
              setSaveLoading(false);
            });
          } else {
            let sendData = {};
            sendData = {
              schemaType: type,
              connectData: JSON.stringify(values),
            };
            setSaveLoading(true);
            saveData(sendData, (res) => {
              setSaveLoading(false);
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: 'common.addSuccess',
                    defaultValue: '新增成功！',
                  })
                );
                history.push('/data');
              } else {
                message.error(
                  res.msg ||
                    intl.formatMessage({
                      id: 'common.addError',
                      defaultValue: '新增失败，请稍后重试！',
                    })
                );
              }
            }).catch((res) => {
              setSaveLoading(false);
            });
          }
        }
      });
    };
    //服务自动拆分数据库
    const serversChange = (e, type) => {
      let value = e.target.value;
      if (value && value.split('?').length > 0) {
        let endValue = value.split('?')[0].split(':').pop();
        if (!endValue) return;
        if (type === 'Oracle') {
          form.setFieldsValue({
            schemaName: endValue,
          });
          return;
        }
        const endValueArr =
          type === 'SqlServer' ? endValue.split('=') : endValue.split('/');
        if (endValueArr.length > 1) {
          let last = endValueArr.pop();
          form.setFieldsValue({
            schemaName: last,
          });
        }
      }
    };
    return (
      <Form
        style={{ width: '80%' }}
        onSubmit={handleSubmit}
        labelAlign='left'
        layout='vertical'
        initialvalues={projectData || {}}
      >
        {
          <>
            <Form.Item label='数据源名称' name={'datasourceName'}>
              {getFieldDecorator('datasourceName', {
                initialValue: projectData?.datasourceName,
                rules: [
                  {
                    required: true,
                    message:
                      intl.formatMessage({
                        id: 'common.pleaseInput',
                        defaultValue: '请输入',
                      }) + '数据源名称',
                  },
                  {
                    pattern: /^[\u4e00-\u9fa5\da-zA-Z\-\_]+$/,
                    message: '请输入非特殊字符的数据源名称!',
                  },
                  {
                    max: 20,
                    message: '数据源名称长度不能超过20个字符!',
                  },
                ],
              })(
                <Input
                  placeholder={
                    intl.formatMessage({
                      id: 'common.pleaseInput',
                      defaultValue: '请输入',
                    }) + '数据源名称'
                  }
                />
              )}
            </Form.Item>
            {![
              'MySQL',
              'Postgres',
              'SqlServer',
              'DM',
              'MariaDB',
              'ClickHouse',
              'Oracle',
            ].includes(type) && (
              <Form.Item label='连接地址' name={'servers'}>
                {getFieldDecorator('servers', {
                  initialValue: projectData?.servers,
                  rules: [
                    {
                      required: true,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '连接地址',
                    },
                  ],
                })(<Input placeholder={dataTypePlaceHolder[type]} />)}
              </Form.Item>
            )}
            {(type == 'MySQL' ||
              type === 'MariaDB' ||
              type === 'DM' ||
              type === 'ClickHouse') && (
              <Form.Item label='连接地址' name={'servers'}>
                {getFieldDecorator('servers', {
                  initialValue: projectData?.servers,
                  rules: [
                    {
                      required: true,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '连接地址',
                    },
                  ],
                })(
                  <Input
                    onChange={serversChange}
                    placeholder={dataTypePlaceHolder[type]}
                  />
                )}
              </Form.Item>
            )}
            {type == enums.Postgres && (
              <Form.Item label='连接地址' name={'servers'}>
                {getFieldDecorator('servers', {
                  initialValue: projectData?.servers,
                  rules: [
                    {
                      required: true,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '连接地址',
                    },
                  ],
                })(
                  <Input
                    onChange={serversChange}
                    placeholder={dataTypePlaceHolder[type]}
                  />
                )}
              </Form.Item>
            )}
            {(type === 'SqlServer' || type === 'Oracle') && (
              <Form.Item label='连接地址' name={'servers'}>
                {getFieldDecorator('servers', {
                  initialValue: projectData?.servers,
                  rules: [
                    {
                      required: true,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '连接地址',
                    },
                  ],
                })(
                  <Input
                    onChange={(e) => serversChange(e, type)}
                    placeholder={dataTypePlaceHolder[type]}
                  />
                )}
              </Form.Item>
            )}
            {![enums.HTTP].includes(type) && (
              <Form.Item label='数据库名称'>
                {getFieldDecorator('schemaName', {
                  initialValue: projectData?.schemaName,
                  rules: [
                    {
                      required: true,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '数据库名称',
                    },
                    {
                      pattern: /^[_a-zA-Z0-9]+$/,
                      message: '请输入只包含数字/大小写字母/下划线数据库名称!',
                    },
                    {
                      pattern: /^(?!\d+$)[^\?\!\,\.]*?$/,
                      message: '数据库名称不能是纯数字!',
                    },
                  ],
                })(
                  <Input
                    disabled={[
                      'Postgres',
                      'MySQL',
                      'SqlServer',
                      'DM',
                      'MariaDB',
                      'ClickHouse',
                      'Oracle',
                    ].includes(type)}
                    placeholder={
                      intl.formatMessage({
                        id: 'common.pleaseInput',
                        defaultValue: '请输入',
                      }) + '数据库名称'
                    }
                  />
                )}
              </Form.Item>
            )}
            {(type == 'Postgres' ||
              type === 'SqlServer' ||
              type === 'Oracle') && (
              <Form.Item label='Schema名称'>
                {getFieldDecorator('modelName', {
                  initialValue: projectData?.modelName,
                  rules: [
                    {
                      required: true,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + 'schema名称',
                    },
                    {
                      pattern: /^[_a-zA-Z0-9]+$/,
                      message: '请输入只包含数字/大小写字母/下划线数据库名称!',
                    },
                  ],
                })(
                  <Input
                    placeholder={
                      intl.formatMessage({
                        id: 'common.pleaseInput',
                        defaultValue: '请输入',
                      }) + 'schema名称'
                    }
                  />
                )}
              </Form.Item>
            )}
            {[
              'MySQL',
              'Postgres',
              'Zabbix',
              'DM',
              'SqlServer',
              'MariaDB',
              'ClickHouse',
              'Oracle',
            ].includes(type) && (
              <Form.Item label='用户名'>
                {getFieldDecorator('username', {
                  initialValue: projectData?.username || '',
                  rules: [
                    {
                      required: ['Zabbix'].includes(type) ? true : false,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '用户名',
                    },
                  ],
                })(
                  <Input
                    placeholder={
                      intl.formatMessage({
                        id: 'common.pleaseInput',
                        defaultValue: '请输入',
                      }) + '用户名'
                    }
                  />
                )}
              </Form.Item>
            )}
            {[
              'MySQL',
              'Postgres',
              'Zabbix',
              'DM',
              'SqlServer',
              'MariaDB',
              'ClickHouse',
              'Oracle',
            ].includes(type) && (
              <Form.Item label='密码'>
                {getFieldDecorator('password', {
                  initialValue: projectData?.password || '',
                  rules: [
                    {
                      required: ['Zabbix'].includes(type) ? true : false,
                      message:
                        intl.formatMessage({
                          id: 'common.pleaseInput',
                          defaultValue: '请输入',
                        }) + '密码',
                    },
                  ],
                })(
                  <Input.Password
                    placeholder={
                      intl.formatMessage({
                        id: 'common.pleaseInput',
                        defaultValue: '请输入',
                      }) + '密码'
                    }
                  />
                )}
              </Form.Item>
            )}
          </>
        }
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type='primary'
            style={{ marginRight: '40px' }}
            htmlType='submit'
            loading={saveLoading}
          >
            保存数据源
          </Button>
          <Button
            type='primary'
            onClick={lookIsUsability}
            loading={connectState}
          >
            {' '}
            连接测试
          </Button>
        </div>
      </Form>
    );
  }
);
