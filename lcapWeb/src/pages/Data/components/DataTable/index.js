/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from 'react';
import {
  Input,
  Select,
  Popconfirm,
  Checkbox,
  Icon,
  Row,
  Table,
  InputNumber,
  message,
  Collapse,
  Tooltip,
} from '@chaoswise/ui';
import { observer, toJS } from '@chaoswise/cw-mobx';

const { Option } = Select;
const Panel = Collapse.Panel;
import styles from './index.less';
import _ from 'lodash';

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
    newTable,
    columnsTitle,
    title,
    setActiveContent,
    canChangeValue,
  }) => {
    const [inputBodyType, setInputBodyType] = useState(''); // 输入框存在flag
    const [bodyInputTitle, setBodyInputTitle] = useState(''); // 请求体输入框内容
    const deleteInput = useRef();
    let parseTableData = toJS(tableData);
    //请求体
    const changeDetail = (key, value, selectType) => {
      let oldArr = _.cloneDeep([...parseTableData]);
      let index = oldArr.findIndex((item) => item.key == key);
      if (index !== -1) {
        if (selectType) {
          oldArr[index]['type'] = value;
        } else {
          oldArr[index]['required'] = value || false;
        }
      }
      setActiveContent(oldArr);
    };
    const changeValue = (recode) => {
      if (bodyInputTitle) {
        let oldArr = _.cloneDeep([...parseTableData]);
        let index = oldArr.findIndex((item) => item.key === recode.key);
        let endItem = oldArr[index];
        endItem.default = bodyInputTitle;
        setBodyInputTitle('');
        if (endItem.name) {
          setInputBodyType(false);
          endItem.state = false;
          endItem.key = Math.random();
          if (oldArr[oldArr.length - 1].state) {
            setActiveContent([...oldArr]);
          } else {
            setActiveContent(oldArr);
          }
        } else {
          setActiveContent([...oldArr]);
        }
      } else {
        let oldArr = _.cloneDeep([...parseTableData]);
        let index = oldArr.findIndex((item) => item.key === recode.key);
        let endItem = oldArr[index];
        endItem.state = false;
        setActiveContent(oldArr);
      }
    };
    const changeOneValue = (recode) => {
      let oldArr = _.cloneDeep([...parseTableData]);
      let index = oldArr.findIndex((item) => item.key === recode.key);
      let endItem = oldArr[index];
      if (bodyInputTitle) {
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
        setActiveContent(oldArr);
        setInputBodyType(null);
      }
    };
    const changeOneName = (recode) => {
      let oldArr = _.cloneDeep([...parseTableData]);
      let index = oldArr.findIndex((item) => item.key === recode.key);
      let endItem = oldArr[index];
      if (bodyInputTitle) {
        endItem.name = bodyInputTitle;
        setBodyInputTitle('');
        if (endItem.default && endItem.name) {
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
        setActiveContent(oldArr);
        setInputBodyType(null);
      }
    };
    const getRowClass = (row, rowIndex) => {
      if (rowIndex === parseTableData.length - 1) {
        return 'my-cover';
      }
    };
    const expandedRowRender = (record) => {
      if (!record.state) {
        return (
          <>
            <Select
              defaultValue='String'
              value={record.type || 'String'}
              style={{ width: 120, marginRight: '40px' }}
              onChange={(e) => {
                changeDetail(record.key, e, true);
              }}
            >
              <Option value='String'>文本</Option>
              <Option value='Int'>整数</Option>
              <Option value='Double'>浮点数</Option>
              <Option value='Boolean'>布尔值</Option>
            </Select>
            <Checkbox
              defaultChecked={record.required}
              onChange={(e) => {
                changeDetail(record.key, e.target.checked);
              }}
            >
              必填
            </Checkbox>
          </>
        );
      }
    };
    const deleteOne = (key) => {
      setActiveContent(parseTableData.filter((item) => item.key !== key));
    };
    const NewColumns = [
      {
        title: columnsTitle[0],
        dataIndex: 'name',
        key: 'name',
        width: '40%',
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
        width: '40%',
        key: 'default',
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
                    {text != null && text !== ''
                      ? String(text)
                      : `添加${columnsTitle[1]}`}
                  </a>
                )}
                {inputBodyType && inputBodyType === recode.key && (
                  <Input
                    placeholder={`请输入${columnsTitle[1]}`}
                    style={{ height: 26, width: '100%' }}
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
      { title: '', dataIndex: '', key: 'expand' },
      {
        title: '',
        key: 'action',
        render: (text, record) => {
          if (!record.state) {
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
    const columns = [
      {
        title: columnsTitle[0],
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        render: (text, recode) => {
          return <span>{text}</span>;
        },
      },
      {
        title: columnsTitle[1],
        dataIndex: 'default',
        width: '30%',
        key: 'default',
        render: (text, recode) => {
          if (recode.state) {
            return (
              <>
                {!inputBodyType && (
                  <a
                    style={{ color: text ? '#40a9ff' : 'gray' }}
                    onClick={() => {
                      setInputBodyType(true);
                    }}
                  >
                    {text != null && text !== ''
                      ? String(text)
                      : `添加${columnsTitle[1]}`}
                  </a>
                )}
                {inputBodyType && (
                  <React.Fragment>
                    {recode.type.toLowerCase() === 'string' && (
                      <Input
                        placeholder={`请输入${columnsTitle[1]}`}
                        style={{ height: 26, width: 130 }}
                        onChange={(e) => {
                          setBodyInputTitle(e.target.value.trim());
                        }}
                        defaultValue={text || ''}
                        onPressEnter={() => {
                          changeValue(recode);
                        }}
                        onBlur={() => {
                          changeValue(recode);
                        }}
                      />
                    )}
                    {recode.type.toLowerCase() === 'boolean' && (
                      <Select
                        defaultValue={text != null ? text : true}
                        style={{ height: 26, width: 130 }}
                        onChange={(e) => {
                          setBodyInputTitle(e);
                        }}
                        onBlur={() => {
                          changeValue(recode);
                        }}
                      >
                        <Option value={true}>true</Option>
                        <Option value={false}>false</Option>
                      </Select>
                    )}
                    {(recode.type.toLowerCase() === 'int' ||
                      recode.type.toLowerCase() === 'double') && (
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
                          recode.type.toLowerCase() === 'int'
                            ? LIMIT_INT_NUMBER
                            : (val) => val
                        }
                        parser={
                          recode.type.toLowerCase() === 'int'
                            ? LIMIT_INT_NUMBER
                            : (val) => val
                        }
                        onPressEnter={() => {
                          changeValue(recode);
                        }}
                        onBlur={() => {
                          changeValue(recode);
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
                    setInputBodyType(true);
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
        key: 'type',
        render: (text, record) => {
          return (
            <Select
              disabled
              defaultValue={record.type}
              value={record.type || 'String'}
              style={{ width: 80, marginRight: '40px' }}
              onChange={(e) => {
                changeDetail(record.key, e, true);
              }}
            >
              <Option value='String'>文本</Option>
              <Option value='Int'>整数</Option>
              <Option value='Double'>浮点数</Option>
              <Option value='Boolean'>布尔值</Option>
            </Select>
          );
        },
      },
      {
        title: '',
        key: 'action',
        fixed: 'right',
        render: (text, record) => {
          if (!record.state && !record.required) {
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
                    style={{ fontSize: '16px', cursor: 'pointer' }}
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
      <div style={{ marginBottom: '20px' }}>
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
              columns={newTable ? NewColumns : columns}
              dataSource={parseTableData}
              pagination={false}
              rowKey='key'
              expandedRowRender={newTable == 1 && expandedRowRender}
              expandIconColumnIndex={2}
              expandIconAsCell={false}
              rowClassName={getRowClass}
            />
          </Panel>
        </Collapse>
      </div>
    );
  }
);
export default ProjectDetail;
