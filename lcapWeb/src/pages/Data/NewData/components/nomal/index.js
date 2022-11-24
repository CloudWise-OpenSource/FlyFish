import React, { useEffect, useState } from 'react';
import { Input, Select, Button, message, Form } from '@chaoswise/ui';
import { useIntl } from 'react-intl';
import enums from '@/utils/enums.js';
import { useHistory } from 'react-router-dom';
const { Option } = Select;

import { successCode } from '@/config/global';
import { toJS } from '@chaoswise/cw-mobx';

const schemaTypeEnums = {
  MySQL: 'mysql',
  Postgres: 'postgresql',
  达梦: 'dm',
  MariaDB: 'mariadb',
  SqlServer: 'sqlserver',
  Oracle: 'oracle',
  Clickhouse: 'clickhouse',
  HTTP: 'HTTP',
};

const placeholderEnums = {
  MySQL: 'jdbc:mysql://10.2.2.254:18103/cw_douc?createDatabaseIfNotExist=true',
  MariaDB: 'jdbc:mariadb://10.2.2.254.148:3306/mariadbff',
  Clickhouse: 'jdbc:clickhouse://10.2.2.254.148:8123/default',
  达梦: 'jdbc:dm://10.2.2.254.148:5238/cw',
};

export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(function EditProjectModal({
  form,
  activeData = {},
  changeData,
  saveData,
  type,
  dataUsability,
  ref1,
}) {
  console.log('activeData编辑', activeData);
  console.log('type', type);
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
          schemaType: schemaTypeEnums[type],
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
        }).catch(() => {
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
            schemaType: schemaTypeEnums[type],
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
          }).catch(() => {
            setSaveLoading(false);
          });
        } else {
          let sendData = {};
          sendData = {
            schemaType: schemaTypeEnums[type],
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
          }).catch(() => {
            setSaveLoading(false);
          });
        }
      }
    });
  };
  //服务自动拆分数据库
  const serversChange = (e) => {
    let value = e.target.value;
    if (type === 'SqlServer') {
      if (value && value.split('?').length > 0) {
        let endValue = value.split('?')[0].split(':').pop();
        if (endValue && endValue.split(';DatabaseName=').length > 1) {
          let last = endValue.split(';DatabaseName=').pop();
          form.setFieldsValue({
            schemaName: last,
          });
        }
      }
    } else {
      if (value && value.split('?').length > 0) {
        let endValue = value.split('?')[0].split(':').pop();
        if (endValue && endValue.split('/').length > 1) {
          let last = endValue.split('/').pop();
          form.setFieldsValue({
            schemaName: last,
          });
        }
      }
    }
  };
  return (
    <Form
      style={{ width: '80%' }}
      onSubmit={handleSubmit}
      labelAlign="left"
      layout="vertical"
      initialvalues={projectData || {}}
    >
      {
        <>
          <Form.Item label="数据源名称" name={'datasourceName'}>
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
                  pattern: /^[\u4e00-\u9fa5\da-zA-Z\-_]+$/,
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
          {!['File', 'MySQL', 'Postgres', 'postgresql', 'MariaDB', 'SqlServer', '达梦', 'Oracle', 'Clickhouse'].includes(
            enums[type] || type
          ) && (
            <Form.Item label="连接地址" name="servers">
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
              })(<Input placeholder="10.2.2.254:18103" />)}
            </Form.Item>
          )}
          {['MySQL', 'MariaDB', '达梦', 'Clickhouse'].includes(enums[type] || type) && (
            <Form.Item label="连接地址" name={'servers'}>
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
                  placeholder={
                    placeholderEnums[enums[type] || type] ||
                    'jdbc:mysql://10.2.2.254:18103/cw_douc?createDatabaseIfNotExist=true11'
                  }
                />
              )}
            </Form.Item>
          )}
          {['Postgres', 'postgresql'].includes(enums[type] || type) && (
            <Form.Item label="连接地址" name="servers">
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
                  placeholder="jdbc:postgres://10.2.2.254:18103/cw_douc?createDatabaseIfNotExist=true"
                />
              )}
            </Form.Item>
          )}
          {['SqlServer', 'Oracle'].includes(enums[type] || type) && (
            <Form.Item label="连接地址" name="servers">
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
                  placeholder={
                    type === enums.sqlserver
                      ? 'jdbc:sqlserver://10.2.2.254:1433;DatabaseName=wrySelectCourse3'
                      : 'jdbc:oracle:thin:@10.2.2.254:1521/DatabaseName'
                  }
                />
              )}
            </Form.Item>
          )}
          {(enums[type] || type) !== enums.http && (
            <Form.Item label="数据库名称">
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
                    pattern: /^(?!\d+$)[^?!,.]*?$/,
                    message: '数据库名称不能是纯数字!',
                  },
                ],
              })(
                <Input
                  disabled={['postgresql', 'Postgres', 'MySQL', 'MariaDB', 'SqlServer', '达梦', 'Oracle', 'Clickhouse'].includes(
                    enums[type] || type
                  )}
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
          {['Postgres', 'SqlServer', 'Oracle'].includes(enums[type] || type || 'postgresql') && (
            <Form.Item label="Schema名称">
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
          {(enums[type] || type) === 'Redis' && (
            <Form.Item label="数据库编号">
              {getFieldDecorator('database', {
                initialValue: projectData?.database || '',
              })(
                <Input
                  placeholder={
                    intl.formatMessage({
                      id: 'common.pleaseInput',
                      defaultValue: '请输入',
                    }) + '数据库编号'
                  }
                />
              )}
            </Form.Item>
          )}
          {['MongoDB'].includes(enums[type] || type) && (
            <>
              <Form.Item label="鉴权库">
                {getFieldDecorator('authDatabase', {
                  initialValue: projectData?.authDatabase || '',
                })(
                  <Input
                    placeholder={
                      intl.formatMessage({
                        id: 'common.pleaseInput',
                        defaultValue: '请输入',
                      }) + '鉴权库'
                    }
                  />
                )}
              </Form.Item>
              <Form.Item label="鉴权机制">
                {getFieldDecorator('authMechanism', {
                  initialValue: projectData?.authMechanism,
                })(
                  <Select placeholder="请选择鉴权机制">
                    <Option value="MONGODB-X509">MONGODB-X509</Option>
                    <Option value="SCRAM-SHA-1">SCRAM-SHA-1</Option>
                    <Option value="SCRAM-SHA-256">SCRAM-SHA-256</Option>
                  </Select>
                )}
              </Form.Item>
            </>
          )}
          {['MySQL', 'postgresql', 'Postgres', 'MongoDB', 'MariaDB', 'SqlServer', '达梦', 'Oracle', 'Clickhouse'].includes(
            enums[type] || type
          ) && (
            <Form.Item label="用户名">
              {getFieldDecorator('username', {
                initialValue: projectData?.username || '',
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
          {['MySQL', 'postgresql', 'Postgres', 'Redis', 'MongoDB', 'MariaDB', 'SqlServer', '达梦', 'Oracle', 'Clickhouse'].includes(
            enums[type] || type
          ) && (
            <Form.Item label="密码">
              {getFieldDecorator('password', {
                initialValue: projectData?.password || '',
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
        <Button type="primary" style={{ marginRight: '40px' }} htmlType="submit" loading={saveLoading}>
          保存数据源
        </Button>
        {type !== 'File' && (
          <Button type="primary" onClick={lookIsUsability} loading={connectState}>
            连接测试
          </Button>
        )}
      </div>
    </Form>
  );
});
