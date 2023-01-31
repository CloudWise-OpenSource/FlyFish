import React, { useEffect, useState, useRef } from 'react';
import {
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Collapse,
  Icon,
  Form,
} from '@chaoswise/ui';
import { useIntl } from 'react-intl';
const Panel = Collapse.Panel;
const { Option } = Select;
import _ from 'lodash';
import styles from './index.less';
import { successCode } from '@/config/global';
import { useHistory } from 'react-router-dom';
import DataTable from '../../../components/NewTable';
import enums from '@/utils/enums.js';
import jsoneditor from 'jsoneditor';
import { toJS } from '@chaoswise/cw-mobx';
import { JSONEditor } from '@json-editor/json-editor';
export default Form.create({ name: 'FORM_IN_PROJECT_MODAL' })(
  function EditProjectModal({
    form,
    activeData = {},
    changeData,
    saveData,
    type,
    dataUsability,
  }) {
    const [editor, setEditor] = useState(null); // edit实例
    const [projectData, setProjectData] = useState(activeData); // 初始数据
    const history = useHistory();

    const [connectState, setConnectState] = useState(false); // 链接状态
    const [saveLoading, setSaveLoading] = useState(false); //loading
    let editorOptions = {
      schema: {
        type: 'string',
        format: 'json',
      },
    };
    let editorOptionsText = {
      schema: {
        type: 'string',
        format: 'textarea',
      },
    };

    const intl = useIntl();
    const { getFieldDecorator } = form;
    const editContainer = useRef(); //jsonedit实例
    const [url, setUrl] = useState(''); //url地址
    const [checkMenu, setCheckMenu] = useState(false); // 输入框存在flag
    const [reqHeaderArr, setReqHeaderArr] = useState([
      { state: true, key: Math.random() },
    ]); //header请求头数组
    const [reqBodyArr, setReqBodyArr] = useState([
      { state: true, key: Math.random() },
    ]); //header请求体数组
    function getQueryString(url) {
      if (url) {
        if (url.split(':')[0] == 'localhost') {
          message.error('url不支持localhost形式，请修改！');
          return;
        } else {
          url = url.substr(url.indexOf('?') + 1);
        }
      }
      var result = {},
        queryString = url || location.search.substring(1),
        re = /([^&=]+)=([^&]*)/g,
        m;
      while ((m = re.exec(queryString))) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      }
      let arr = [];
      for (const i in result) {
        arr.push({ name: i, default: result[i], key: Math.random() });
      }
      return arr;
    }
    useEffect(() => {
      // 编辑页挂载
      if (activeData && activeData.schemaType) {
        try {
          let content = JSON.parse(toJS(activeData.connectData));
          let { params = [], header = [], url = '' } = content;
          setUrl(url);
          setProjectData({
            ...activeData,
            ...JSON.parse(toJS(activeData.connectData)),
          });
          let headerArr = [
            ...params,
            { state: true, key: Math.random(), noExpend: true },
          ];
          let bodyArr = [
            ...header,
            { state: true, key: Math.random(), noExpend: true },
          ];
          if (content.requestBody && content.requestBody.type == 'json') {
            setCheckMenu(false);
            let editFirst = new JSONEditor(
              editContainer.current,
              editorOptions
            );
            setEditor(editFirst);
            editFirst.on('ready', () => {
              editFirst.setValue(content.requestBody?.value);
            });
          } else {
            setCheckMenu(true);
            let editFirst = new JSONEditor(
              editContainer.current,
              editorOptionsText
            );
            setEditor(editFirst);
            editFirst.on('ready', () => {
              editFirst.setValue(content.requestBody?.value);
            });
          }
          setReqHeaderArr(headerArr);
          setReqBodyArr(bodyArr);
        } catch (error) {
          console.log(error);
        }
      } else {
        let editFirst = null;
        editFirst = new JSONEditor(editContainer.current, {
          schema: {
            type: 'string',
            format: 'json',
            options: {
              ace: {
                placeholder: JSON.stringify(
                  {
                    title: '名称',
                    type: 'object',
                    required: ['name'],
                    properties: {
                      name: {
                        type: 'string',
                        description: '这是一条描述信息',
                        minLength: 4,
                        default: 'Jeremy',
                      },
                    },
                  },
                  null,
                  2
                ),
              },
            },
          },
        });
        setEditor(editFirst);
      }
    }, []);
    //  请求前处理请求体/请求体数组数据
    const changSendHearderOrBodyArr = () => {
      let headerArr = reqBodyArr.map((item) => {
        return {
          ...item,
          required: item.required || false,
          type: item.type || 'String',
        };
      });
      let paramsArr = reqHeaderArr.map((item) => {
        return {
          ...item,
          required: item.required || false,
          type: item.type || 'String',
        };
      });
      return {
        headerArr: headerArr.filter((item) => item.name),
        paramsArr: paramsArr.filter((item) => item.name),
      };
    };
    //拆分url变成表格数据
    const splitUrl = () => {
      if (url && getQueryString(url)) {
        setReqHeaderArr([
          ...getQueryString(url),
          {
            name: '',
            default: '',
            state: true,
            key: Math.random(),
            noExpend: true,
            required: false,
            type: 'String',
          },
        ]);
      }
    };
    //修改组件的数据同步修改url
    const combinationUrl = (arr) => {
      let string = url.split('?')[0] + '?';
      let endString = '';
      arr.map((item, index) => {
        if (item.name || item.default) {
          if (index != 0) {
            let str = '&' + item.name + '=' + item.default;
            endString += str;
          } else {
            let str = item.name + '=' + item.default;
            endString += str;
          }
        }
      });
      let newUrl = string + endString;
      setUrl(newUrl);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      form.validateFields(async (err, values) => {
        if (!err) {
          if (!url) {
            message.error('请输入url');
            return;
          }
          if (activeData && activeData.schemaType) {
            let sendData = {};
            if (editor.getValue() && !checkMenu) {
              try {
                let result = JSON.parse(editor.getValue());
                if (result.type == 'object' || result.type == 'array') {
                  if (result.type == 'object' && !result.properties) {
                    message.error('请输入正确的JsonSchema格式！');
                    return;
                  }
                  if (result.type == 'array' && !result.items) {
                    message.error('请输入正确的JsonSchema格式！');
                    return;
                  }
                } else {
                  message.error('请输入正确的JsonSchema格式！');
                  return;
                }
              } catch (error) {
                message.error('请输入正确的JsonSchema格式！');
                return;
              }
            }
            let headerBoayArr = changSendHearderOrBodyArr();

            const saveHeaderArr = headerBoayArr.headerArr.map((item) => {
              return { ...item, state: false };
            });

            let isHeadersValid = true;
            let headersErrorMessage = [];
            for (let i = 0; i < saveHeaderArr.length; i++) {
              const reqHeader = saveHeaderArr[i];
              if (
                reqHeader.required &&
                (reqHeader.default == null || reqHeader.default === '')
              ) {
                isHeadersValid = false;
                headersErrorMessage.push(reqHeader.name);
              }
            }
            if (!isHeadersValid) {
              return message.error(
                `请求头${headersErrorMessage.join(',')}为必填项，请填写值！`
              );
            }

            const saveParamArr = headerBoayArr.paramsArr.map((item) => {
              return { ...item, state: false };
            });

            let isParamsValid = true;
            let paramsErrorMessage = [];
            for (let i = 0; i < saveParamArr.length; i++) {
              const reqParam = saveParamArr[i];
              if (
                reqParam.required &&
                (reqParam.default == null || reqParam.default === '')
              ) {
                isParamsValid = false;
                paramsErrorMessage.push(reqParam.name);
              }
            }
            if (!isParamsValid) {
              return message.error(
                `请求参数${paramsErrorMessage.join(
                  ','
                )}为必填项，请填写参考值！`
              );
            }
            sendData = {
              datasourceId: activeData.datasourceId,
              datasourceName: values.datasourceName,
              schemaType: enums['HTTP'],
              connectData: JSON.stringify({
                datasourceName: values.datasourceName,
                url,
                schemaName: values.schemaName,
                method: values.method,
                header: saveHeaderArr,
                params: saveParamArr,
                requestBody: {
                  type: checkMenu ? 'text' : 'json',
                  value: editor.getValue(),
                },
              }),
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
                  res.msg || '数据源编辑失败,请检查参数再进行保存！'
                );
              }
            }).catch((res) => {
              setSaveLoading(false);
            });
          } else {
            if (editor.getValue() && !checkMenu) {
              try {
                let result = JSON.parse(editor.getValue());
                if (result.type == 'object' || result.type == 'array') {
                  if (result.type == 'object' && !result.properties) {
                    message.error('请输入正确的JsonSchema格式！');
                    return;
                  }
                  if (result.type == 'array' && !result.items) {
                    message.error('请输入正确的JsonSchema格式！');
                    return;
                  }
                } else {
                  message.error('请输入正确的JsonSchema格式！');
                  return;
                }
              } catch (error) {
                message.error('请输入正确的JsonSchema格式！');
                return;
              }
            }
            let headerBoayArr = changSendHearderOrBodyArr();

            const saveHeaderArr = headerBoayArr.headerArr.map((item) => {
              return { ...item, state: false };
            });

            let isHeadersValid = true;
            let headersErrorMessage = [];
            for (let i = 0; i < saveHeaderArr.length; i++) {
              const reqHeader = saveHeaderArr[i];
              if (
                reqHeader.required &&
                (reqHeader.default == null || reqHeader.default === '')
              ) {
                isHeadersValid = false;
                headersErrorMessage.push(reqHeader.name);
              }
            }
            if (!isHeadersValid) {
              return message.error(
                `请求头${headersErrorMessage.join(',')}为必填项，请填写值！`
              );
            }

            const saveParamArr = headerBoayArr.paramsArr.map((item) => {
              return { ...item, state: false };
            });

            let isParamsValid = true;
            let paramsErrorMessage = [];
            for (let i = 0; i < saveParamArr.length; i++) {
              const reqParam = saveParamArr[i];
              if (
                reqParam.required &&
                (reqParam.default == null || reqParam.default === '')
              ) {
                isParamsValid = false;
                paramsErrorMessage.push(reqParam.name);
              }
            }
            if (!isParamsValid) {
              return message.error(
                `请求参数${paramsErrorMessage.join(
                  ','
                )}为必填项，请填写参考值！`
              );
            }

            let sendData = {};
            sendData = {
              schemaType: enums['HTTP'],
              connectData: JSON.stringify({
                datasourceName: values.datasourceName,
                url,
                schemaName: values.schemaName,
                method: values.method,
                header: saveHeaderArr,
                params: saveParamArr,
                requestBody: {
                  type: checkMenu ? 'text' : 'json',
                  value: editor.getValue(),
                },
              }),
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
    return (
      <Form
        style={{ width: '80%' }}
        layout='vertical'
        labelAlign='left'
        initialvalues={projectData || {}}
      >
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
        <Form.Item label='数据库名称' name={'schemaName'}>
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
              placeholder={
                intl.formatMessage({
                  id: 'common.pleaseInput',
                  defaultValue: '请输入',
                }) + '数据库名称'
              }
            />
          )}
        </Form.Item>
        <Form.Item label='请求' required>
          <Row gutter={20}>
            <Col span={7}>
              <Form.Item name={'datasourceName'}>
                {getFieldDecorator('method', {
                  initialValue: projectData?.method || 'get',
                  rules: [{ required: true, message: '请选择请求方式' }],
                })(
                  <Select>
                    <Option value='get'>GET</Option>
                    <Option value='post'>POST</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={17}>
              <Input
                style={{ width: '100%' }}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  splitUrl();
                }}
                onBlur={splitUrl}
              />
            </Col>
          </Row>
          <DataTable
            title='Header请求头'
            columnsTitle={['Header名', 'Header值']}
            canChangeValue={true}
            tableData={reqBodyArr}
            setActiveContent={setReqBodyArr}
            newTable={1}
          ></DataTable>
          <DataTable
            title='请求参数'
            columnsTitle={['请求参数', '参数值']}
            canChangeValue={true}
            tableData={reqHeaderArr}
            setActiveContent={setReqHeaderArr}
            newTable={1}
            changeMethod={combinationUrl}
          ></DataTable>
          <Collapse defaultActiveKey={['1']} bordered={false}>
            <Panel header='请求体' key='1' style={{ border: 'none' }}>
              <Row gutter={20}>
                <div className={styles.menu}>
                  <div
                    className={
                      styles.menuItem +
                      (!checkMenu ? ' ' + styles.activeItem : '')
                    }
                    onClick={() => {
                      let value;
                      if (editor) {
                        value = editor.getValue();
                      }

                      setCheckMenu(false);
                      editor.destroy();
                      let editFirst = null;
                      if (value) {
                        editFirst = new JSONEditor(
                          editContainer.current,
                          editorOptions
                        );
                        setEditor(editFirst);
                        editFirst.on('ready', () => {
                          editFirst.setValue(value);
                        });
                      } else {
                        editFirst = new JSONEditor(editContainer.current, {
                          schema: {
                            type: 'string',
                            format: 'json',
                            options: {
                              ace: {
                                placeholder: JSON.stringify(
                                  {
                                    title: '名称',
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                      name: {
                                        type: 'string',
                                        description: '这是一条描述信息',
                                        minLength: 4,
                                        default: 'Jeremy',
                                      },
                                    },
                                  },
                                  null,
                                  2
                                ),
                              },
                            },
                          },
                        });
                      }
                      setEditor(editFirst);
                    }}
                  >
                    JsonSchema
                  </div>
                  <div
                    className={
                      styles.menuItem +
                      (checkMenu ? ' ' + styles.activeItem : '')
                    }
                    onClick={() => {
                      let value;
                      if (editor) {
                        value = editor.getValue();
                      }
                      setCheckMenu(true);
                      editor.destroy();
                      let editFirst = null;
                      if (value) {
                        editFirst = new JSONEditor(
                          editContainer.current,
                          editorOptionsText
                        );
                        setEditor(editFirst);
                        editFirst.on('ready', () => {
                          editFirst.setValue(value);
                        });
                      } else {
                        editFirst = new JSONEditor(
                          editContainer.current,
                          editorOptionsText
                        );
                        setEditor(editFirst);
                      }
                    }}
                  >
                    文本
                  </div>
                </div>
              </Row>
              <Row gutter={20}>
                {<div ref={editContainer} id='editor'></div>}
              </Row>
            </Panel>
          </Collapse>
        </Form.Item>
        <div
          style={{ display: 'flex', alignItems: 'center', marginTop: '-24px' }}
        >
          <Button
            type='primary'
            style={{ marginRight: '40px' }}
            loading={saveLoading}
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            保存数据源
          </Button>
        </div>
      </Form>
    );
  }
);
