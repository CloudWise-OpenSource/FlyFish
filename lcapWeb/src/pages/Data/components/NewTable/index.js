/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import {
  Input,
  Select,
  Popconfirm,
  Checkbox,
  Icon,
  Table,
  Tooltip,
  Collapse,
  InputNumber,
} from '@chaoswise/ui';
import { observer, toJS } from '@chaoswise/cw-mobx';

const { Option } = Select;
const Panel = Collapse.Panel;
import styles from './index.less';
import _ from 'lodash';

const DATA_ITEM_TYPE_MAPPING = {
  String: {
    id: 'String',
    label: '文本',
  },
  Int: {
    id: 'Int',
    label: '整数',
  },
  Double: {
    id: 'Double',
    label: '浮点数',
  },
  Boolean: {
    id: 'Boolean',
    label: '布尔值',
  },
};

const DATA_ITEM_TYPES = [
  DATA_ITEM_TYPE_MAPPING.String,
  DATA_ITEM_TYPE_MAPPING.Int,
  DATA_ITEM_TYPE_MAPPING.Double,
  DATA_ITEM_TYPE_MAPPING.Boolean,
];

const LIMIT_INT_NUMBER = (value) => {
  if (typeof value === 'string') {
    return !isNaN(Number(value)) ? parseInt(Number(value), 10) : '';
  } else if (typeof value === 'number') {
    return !isNaN(value) ? parseInt(Number(value), 10) : '';
  } else {
    return '';
  }
};

const ProjectDetail = observer(
  ({
    tableData = [],
    changeMethod,
    columnsTitle,
    title,
    setActiveContent,
    canChangeValue,
  }) => {
    const [inputBodyType, setInputBodyType] = useState(''); // 输入框存在flag
    const [bodyInputTitle, setBodyInputTitle] = useState(''); // 请求体输入框内容
    let parseTableData = toJS(tableData);
    //请求体
    const changeDetail = (key, value, selectType) => {
      let oldArr = _.cloneDeep([...parseTableData]);
      let index = oldArr.findIndex((item) => item.key == key);
      if (index !== -1) {
        if (selectType) {
          oldArr[index]['type'] = value;
          if (
            value === DATA_ITEM_TYPE_MAPPING.Int.id ||
            value === DATA_ITEM_TYPE_MAPPING.Double.id
          ) {
            oldArr[index]['default'] = 0;
            setBodyInputTitle(0);
          } else if (value === DATA_ITEM_TYPE_MAPPING.Boolean.id) {
            oldArr[index]['default'] = true;
            setBodyInputTitle(true);
          } else {
            oldArr[index]['default'] = '';
            setBodyInputTitle('');
          }
        } else {
          oldArr[index]['required'] = value || false;
        }
      }
      setActiveContent(oldArr);
    };
    const deleteOne = (key) => {
      let filterArr = parseTableData.filter((item) => item.key !== key);
      setActiveContent(filterArr);
      changeMethod(filterArr);
    };
    const changeOneValue = (recode) => {
      let oldArr = _.cloneDeep([...parseTableData]);
      let index = oldArr.findIndex((item) => item.key === recode.key);
      let endItem = oldArr[index];
      if (bodyInputTitle != null) {
        endItem.default = bodyInputTitle;
        setBodyInputTitle('');
        if (endItem.name) {
          setInputBodyType(null);
          endItem.state = false;
          endItem.key = Math.random();
          if (oldArr[oldArr.length - 1].state) {
            setActiveContent(oldArr);
          } else {
            setActiveContent([
              ...oldArr,
              {
                key: Math.random(),
                name: '',
                state: true,
              },
            ]);
          }
        } else {
          setActiveContent([...oldArr]);
        }
      } else {
        if (index == oldArr.length - 1) {
          endItem.default = bodyInputTitle;
        }
        setActiveContent(oldArr);
        setInputBodyType(null);
      }
      changeMethod && changeMethod(oldArr);
    };
    const changeOneName = (recode) => {
      let oldArr = _.cloneDeep([...parseTableData]);
      let index = oldArr.findIndex((item) => item.key === recode.key);
      let endItem = oldArr[index];
      if (bodyInputTitle) {
        endItem.name = bodyInputTitle;
        setBodyInputTitle('');
        if (!endItem.type) {
          endItem.type = DATA_ITEM_TYPE_MAPPING.String.id;
        }
        if (endItem.name) {
          setInputBodyType(null);
          endItem.state = false;
          endItem.key = Math.random();
          if (oldArr[oldArr.length - 1].state) {
            setActiveContent(oldArr);
          } else {
            setActiveContent([
              ...oldArr,
              {
                key: Math.random(),
                name: '',
                state: true,
              },
            ]);
          }
        } else {
          setActiveContent([...oldArr]);
        }
      } else {
        if (index == oldArr.length - 1) {
          endItem.name = bodyInputTitle;
        }
        setActiveContent(oldArr);
        setInputBodyType(null);
      }
      changeMethod && changeMethod(oldArr);
    };
    const NewColumns = [
      {
        title: columnsTitle[0],
        dataIndex: 'name',
        key: 'name',
        render: (text, recode) => {
          if (recode.state) {
            return (
              <>
                {inputBodyType != recode.key && (
                  <a
                    style={{ color: text ? '#40a9ff' : 'gray' }}
                    onClick={() => {
                      setInputBodyType(recode.key);
                    }}
                  >
                    {text || `添加${columnsTitle[0]}`}
                  </a>
                )}
                {inputBodyType && inputBodyType === recode.key && (
                  <Input
                    placeholder={`请输入${columnsTitle[0]}`}
                    style={{ height: 26, width: 130 }}
                    onChange={(e) => {
                      setBodyInputTitle(e.target.value.trim());
                    }}
                    defaultValue={text || ''}
                    onPressEnter={() => {
                      changeOneName(recode);
                    }}
                    onBlur={() => {
                      changeOneName(recode);
                    }}
                  />
                )}
              </>
            );
          } else {
            return (
              <a
                onClick={() => {
                  if (canChangeValue) {
                    let oldArr = _.cloneDeep([...parseTableData]);
                    let index = oldArr.findIndex(
                      (item) => item.key === recode.key
                    );
                    oldArr[index].state = true;
                    setActiveContent(oldArr);
                    setInputBodyType(recode.key);
                  }
                }}
              >
                {text}
              </a>
            );
          }
        },
      },
      {
        title: columnsTitle[1],
        dataIndex: 'default',
        key: 'default',
        render: (text, recode) => {
          if (recode.state) {
            return (
              <>
                {recode.key !== inputBodyType && (
                  <a
                    style={{ color: text ? '#40a9ff' : 'gray' }}
                    onClick={() => {
                      setInputBodyType(recode.key);
                    }}
                  >
                    {text != null && text !== ''
                      ? String(text)
                      : `添加${columnsTitle[1]}`}
                  </a>
                )}
                {inputBodyType && inputBodyType === recode.key && (
                  <React.Fragment>
                    {recode.type === DATA_ITEM_TYPE_MAPPING.String.id && (
                      <Input
                        placeholder={`请输入${columnsTitle[1]}`}
                        style={{ height: 26, width: 130 }}
                        onChange={(e) => {
                          setBodyInputTitle(e.target.value.trim());
                        }}
                        defaultValue={text || ''}
                        onPressEnter={() => {
                          changeOneValue(recode);
                        }}
                        onBlur={() => {
                          changeOneValue(recode);
                        }}
                      />
                    )}
                    {recode.type === DATA_ITEM_TYPE_MAPPING.Boolean.id && (
                      <Select
                        defaultValue={text != null ? text : true}
                        style={{ height: 26, width: 130 }}
                        onChange={(e) => {
                          setBodyInputTitle(e);
                        }}
                        onBlur={() => {
                          changeOneValue(recode);
                        }}
                      >
                        <Option value={true}>true</Option>
                        <Option value={false}>false</Option>
                      </Select>
                    )}
                    {(recode.type === DATA_ITEM_TYPE_MAPPING.Int.id ||
                      recode.type === DATA_ITEM_TYPE_MAPPING.Double.id) && (
                      <InputNumber
                        placeholder={`请输入${columnsTitle[1]}`}
                        style={{ height: 26, width: 130 }}
                        onChange={(val) => {
                          setBodyInputTitle(val);
                        }}
                        defaultValue={
                          Number.isNaN(Number(text)) ? '' : Number(text)
                        }
                        formatter={
                          recode.type === DATA_ITEM_TYPE_MAPPING.Int.id
                            ? LIMIT_INT_NUMBER
                            : (val) => val
                        }
                        parser={
                          recode.type === DATA_ITEM_TYPE_MAPPING.Int.id
                            ? LIMIT_INT_NUMBER
                            : (val) => val
                        }
                        onPressEnter={() => {
                          changeOneValue(recode);
                        }}
                        onBlur={() => {
                          changeOneValue(recode);
                        }}
                      />
                    )}
                  </React.Fragment>
                )}
              </>
            );
          } else {
            return (
              <a
                onClick={() => {
                  if (canChangeValue) {
                    let oldArr = _.cloneDeep([...parseTableData]);
                    let index = oldArr.findIndex(
                      (item) => item.key === recode.key
                    );
                    oldArr[index].state = true;
                    setActiveContent(oldArr);
                    setInputBodyType(recode.key);
                  }
                }}
              >
                {text != null && text !== ''
                  ? String(text)
                  : `添加${columnsTitle[1]}`}
              </a>
            );
          }
        },
      },
      {
        title: '参数类型',
        key: 'action1',
        render: (text, record) => {
          if (record.name || record.value) {
            return (
              <Select
                defaultValue={DATA_ITEM_TYPE_MAPPING.String.id}
                value={record.type || DATA_ITEM_TYPE_MAPPING.String.id}
                style={{ width: 80, marginRight: '40px' }}
                onChange={(e) => {
                  changeDetail(record.key, e, true);
                }}
              >
                {DATA_ITEM_TYPES.map((type) => {
                  return (
                    <Option key={`data-type-${type.id}`} value={type.id}>
                      {type.label}
                    </Option>
                  );
                })}
              </Select>
            );
          }
        },
      },
      {
        title: '是否必填',
        key: 'action2',
        render: (text, record) => {
          if (record.name || record.value) {
            return (
              <Checkbox
                defaultChecked={record.required}
                onChange={(e) => {
                  changeDetail(record.key, e.target.checked);
                }}
              >
                必填
              </Checkbox>
            );
          }
        },
      },
      {
        title: '',
        key: 'action',

        render: (text, record, index) => {
          if (index !== parseTableData.length - 1) {
            return (
              <Popconfirm
                title='确定要删除吗？'
                onConfirm={() => {
                  deleteOne(record.key, true);
                }}
                okText='确认'
                cancelText='取消'
              >
                <Tooltip title='删除'>
                  <Icon
                    style={{
                      fontSize: '16px',
                      cursor: 'pointer',
                      color: 'gray',
                      marginTop: '5px',
                    }}
                    type='minus-circle'
                  />
                </Tooltip>
              </Popconfirm>
            );
          }
        },
      },
    ];
    return (
      <div style={{ marginBottom: '40px' }}>
        <Collapse
          defaultActiveKey={
            parseTableData && parseTableData.length > 0 ? ['1'] : null
          }
          bordered={false}
          className='site-collapse-custom-collapse'
        >
          <Panel header={title} key='1' style={{ border: 'none' }}>
            <Table
              tableLayout='fixed'
              style={{ marginTop: '20px' }}
              columns={NewColumns}
              dataSource={parseTableData}
              pagination={false}
              rowKey='key'
            />
          </Panel>
        </Collapse>
      </div>
    );
  }
);
export default ProjectDetail;
