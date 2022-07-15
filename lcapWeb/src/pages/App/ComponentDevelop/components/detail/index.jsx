import React, { useEffect } from 'react';
import styles from './style.less';
import {
  Button,
  Input,
  CWTable,
  Icon,
  message,
  Popconfirm,
  Modal,
  Ace,
} from '@chaoswise/ui';
import '@chaoswise/ace/ace-builds/src-noconflict/mode-javascript';
import '@chaoswise/ace/ace-builds/src-noconflict/theme-github';
import '@chaoswise/ace/ace-builds/src-noconflict/theme-monokai';
import '@chaoswise/ace/ace-builds/src-min-noconflict/ext-language_tools';
import { useState } from 'react';
import store from '../../model/index';
import { observer } from '@chaoswise/cw-mobx';
import { getDetailDataService, editComponentService } from '../../services';
import * as CONSTANT from '../../constant';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import ComponentPreview from '@/components/Drawer/components/ComponentPreview';

const Detail = observer(() => {
  const recordColumns = [
    {
      title: '版本号',
      dataIndex: 'no',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      render: (text) => {
        return moment(Number(text)).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];
  const configColumns = [
    {
      title: '属性',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'desc',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Popconfirm
            title='确定要删除吗'
            onConfirm={() => {
              setConfigData((state) => {
                return {
                  ...state,
                  options: state.options.filter((item) => {
                    return record.name !== item.name;
                  }),
                };
              });
            }}
            okText='是'
            cancelText='否'
          >
            <Icon type='delete' style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        );
      },
    },
  ];
  const childConfigColumns = [
    {
      title: '属性',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'desc',
    },
    {
      title: '类型',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Popconfirm
            title='确定要删除吗'
            onConfirm={() => {
              setConfigData((state) => {
                return {
                  ...state,
                  optionsChilds: state.optionsChilds.map((item) => {
                    if (item.name == record.parentName) {
                      item.datas = item.datas.filter((item2) => {
                        return item2.name !== record.name;
                      });
                    }
                    return item;
                  }),
                };
              });
            }}
            okText='是'
            cancelText='否'
          >
            <Icon type='delete' style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        );
      },
    },
  ];
  const eventColumns = [
    {
      title: '事件名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '参数',
      align: 'center',
      dataIndex: 'param',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Popconfirm
            title='确定要删除吗'
            onConfirm={() => {
              setConfigData((state) => {
                return {
                  ...state,
                  events: state.events.filter((item) => {
                    return record.name !== item.name;
                  }),
                };
              });
            }}
            okText='是'
            cancelText='否'
          >
            <Icon type='delete' style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        );
      },
    },
  ];
  const listenerColumns = [
    {
      title: '事件名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '参数',
      align: 'center',
      dataIndex: 'param',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (text, record) => {
        return (
          <Popconfirm
            title='确定要删除吗'
            onConfirm={() => {
              setConfigData((state) => {
                return {
                  ...state,
                  listeners: state.listeners.filter((item) => {
                    return record.name !== item.name;
                  }),
                };
              });
            }}
            okText='是'
            cancelText='否'
          >
            <Icon type='delete' style={{ color: 'red', cursor: 'pointer' }} />
          </Popconfirm>
        );
      },
    },
  ];
  const { detailShow, setDetailShow, viewId } = store;

  const [detailData, setDetailData] = useState([]);
  // const [codeValue, setCodeValue] = useState('');
  // const [annotationValue, setAnnotationValue] = useState('');
  // const [markValue, setMarkValue] = useState('');
  const [marking, setMarking] = useState(false);
  const [childNameValue, setChildNameValue] = useState('');
  const [addingOptionVisible, setAddingOptionVisible] = useState(false);
  const [addingOptionChildVisible, setAddingOptionChildVisible] =
    useState(false);
  const [addingChildName, setAddingChildName] = useState('');
  const [addEventVisible, setAddEventVisible] = useState(false);
  const [addListenerVisible, setAddListenerVisible] = useState(false);
  const [addingEvent, setAddingEvent] = useState({
    name: '',
    param: '',
    desc: '',
  });

  const [addingOption, setAddingOption] = useState({
    name: '',
    desc: '',
    type: '',
    defaultValue: '',
  });

  const [configData, setConfigData] = useState({
    annotationValue: '', //注释
    codeValue: '', //代码示例文本
    options: [
      {
        name: 'name',
        desc: '柱状图',
        type: 'string',
        defaultValue: '-',
      },
    ],
    optionsChilds: [
      {
        name: 'children',
        datas: [
          {
            name: 'name',
            desc: '柱状图',
            type: 'string',
            defaultValue: '-',
            parentName: '',
          },
        ],
      },
      {
        name: 'children',
        datas: [
          {
            name: 'name',
            desc: '柱状图',
            type: 'string',
            defaultValue: '-',
          },
        ],
      },
    ],
    events: [
      {
        name: 'name',
        desc: '柱状图',
        type: 'string',
        defaultValue: '-',
      },
    ],
    listeners: [
      {
        name: 'name',
        desc: '柱状图',
        type: 'string',
        defaultValue: '-',
      },
    ],
    markValue: '', //markdown文本
  });
  useEffect(() => {
    if (detailData && detailData.dataConfig) {
      const { dataConfig } = detailData;
      const data = {
        annotationValue: '', //注释
        codeValue: '', //代码示例文本
        options: [],
        optionsChilds: [],
        events: [],
        listeners: [],
        markValue: '', //markdown文本
        ...dataConfig,
      };
      setConfigData(data);
    }
  }, [detailData]);
  useEffect(() => {
    if (viewId && detailShow) {
      getDetailData();
    }
  }, [viewId, detailShow]);

  const getDetailData = async () => {
    const res = await getDetailDataService({ id: viewId });
    if (res && res.data) {
      setDetailData(res.data);
    }
  };
  const saveInfo = async () => {
    console.log(configData);
    const res = await editComponentService(viewId, { dataConfig: configData });
    if (res && res.code === 0) {
      message.success('保存成功！');
      setDetailShow(false);
    } else {
      message.error(res.msg);
    }
  };
  return (
    <>
      <div
        className={styles.shadow}
        style={{
          display: detailShow ? 'block' : 'none',
          top: window.isInPortal ? 56 : 0,
          height: window.isInPortal ? 'calc(100% - 56px)' : '100%',
        }}
        onClick={() => {
          setDetailShow(false);
        }}
      ></div>
      <div
        className={styles.wrap}
        style={{
          display: detailShow ? 'block' : 'none',
          top: window.isInPortal ? 56 : 0,
          height: window.isInPortal ? 'calc(100% - 56px)' : '100%',
        }}
      >
        <div className={styles.titleWrap}>
          <div>
            <span>组件预览</span>
          </div>
          <div>
            <Button type='primary' onClick={saveInfo}>
              保存
            </Button>
            {/* <Button style={{marginLeft:20}}>更新发布</Button> */}
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.baseInfo}>
            <div>
              <label style={{ fontWeight: 800 }}>组件名称：</label>
              {detailData.name}
            </div>
            <div>
              <label style={{ fontWeight: 800 }}>组件编号：</label>
              {detailData.id}
            </div>
            <div>
              <label style={{ fontWeight: 800 }}>行业：</label>
              {detailData.projects
                ? detailData.projects.map((v, k) => {
                    return (
                      <span key={v.id}>
                        {k === detailData.projects.length - 1
                          ? v.name
                          : v.name + ','}
                      </span>
                    );
                  })
                : ''}
            </div>
            <div>
              <label style={{ fontWeight: 800 }}>标签：</label>
              {detailData.tags
                ? detailData.tags.map((v, k) => {
                    return (
                      <span key={v.id}>
                        {k === detailData.tags.length - 1
                          ? v.name
                          : v.name + ','}
                      </span>
                    );
                  })
                : ''}
            </div>
            <div className={styles.descWrap}>
              <label style={{ fontWeight: 800 }}>描述：</label>
              <div>{detailData.desc}</div>
            </div>
            <div>
              <label style={{ fontWeight: 800 }}>开发状态：</label>
              {CONSTANT.componentDevelopStatus_map_ch[detailData.developStatus]}
            </div>
            <div>
              <label style={{ fontWeight: 800 }}>创建者信息：</label>
              {detailData.creatorInfo ? detailData.creatorInfo.username : ''}
            </div>
          </div>
          <div className={styles.imgWrap}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ marginRight: 50, fontWeight: 800 }}>
                效果演示:
              </span>
              {/* <span style={{ fontWeight: 800 }}>组件标识：{detailData.id}</span> */}
            </div>
            <div style={{ backgroundColor: '#eee', height: 300 }}>
              <ComponentPreview activeComponent={{ id: viewId }} />
            </div>
          </div>
          <div className={styles.reocrdWrap}>
            <div style={{ padding: '0 0 16px 0', fontWeight: 800 }}>
              组件变更记录
            </div>
            <CWTable
              columns={recordColumns}
              dataSource={detailData.versions}
              bordered
              pagination={false}
              footer={null}
              rowKey='no'
            />
          </div>
          <div className={styles.dataWrap}>
            <div style={{ fontWeight: 800, margin: '16px 0' }}>数据格式</div>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 16 }}>注释：</div>
              <Input
                placeholder='输入注释'
                value={configData.annotationValue}
                onChange={(e) => {
                  const txt = e.target.value;
                  setConfigData((state) => {
                    return {
                      ...state,
                      annotationValue: txt,
                    };
                  });
                }}
              ></Input>
            </div>
            <div>
              <div style={{ fontWeight: 800, margin: '16px 0' }}>
                代码示例：
              </div>
              <Ace
                style={{ width: '100%', height: 200 }}
                mode='javascript'
                theme='monokai'
                showPrintMargin={false}
                value={configData.codeValue}
                onChange={(val) => {
                  setConfigData((state) => {
                    return {
                      ...state,
                      codeValue: val,
                    };
                  });
                }}
                name='code'
                editorProps={{ $blockScrolling: true }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 800, padding: '16px 0' }}>配置：</div>
              <CWTable
                size='small'
                columns={configColumns}
                dataSource={configData.options}
                bordered
                pagination={false}
                footer={null}
                rowKey='key'
              />
              <Button
                style={{ margin: '16px 0' }}
                onClick={() => {
                  setAddingOption({
                    name: '',
                    desc: '',
                    type: '',
                    defaultValue: '',
                  });
                  setAddingOptionVisible(true);
                }}
              >
                向下添加行
              </Button>
            </div>
            {configData.optionsChilds.map((v, k) => {
              v.key = k;
              return (
                <div key={k}>
                  <div style={{ fontWeight: 800, padding: '10px 0' }}>
                    {v.name}
                    <Popconfirm
                      title='确定要删除吗'
                      onConfirm={() => {
                        setConfigData((state) => {
                          return {
                            ...state,
                            optionsChilds: state.optionsChilds.filter(
                              (item) => {
                                return item.name !== v.name;
                              }
                            ),
                          };
                        });
                      }}
                      okText='是'
                      cancelText='否'
                    >
                      <Icon
                        type='delete'
                        style={{ marginLeft: 20, color: 'red' }}
                      />
                    </Popconfirm>
                  </div>
                  <CWTable
                    size='small'
                    columns={childConfigColumns}
                    dataSource={v.datas}
                    bordered
                    pagination={false}
                    footer={null}
                    rowKey='key'
                  />
                  <Button
                    style={{ marginTop: 5 }}
                    onClick={() => {
                      setAddingOption({
                        name: '',
                        desc: '',
                        type: '',
                        defaultValue: '',
                      });
                      setAddingChildName(v.name);
                      setAddingOptionChildVisible(true);
                    }}
                  >
                    向下添加行
                  </Button>
                </div>
              );
            })}
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Input
                  placeholder='请输入要添加的子属性名称'
                  style={{ width: 300, margin: '0px 16px 0 0' }}
                  value={childNameValue}
                  onChange={(e) => {
                    setChildNameValue(e.target.value);
                  }}
                ></Input>
                <Button
                  type='primary'
                  // style={{ margin: '5px 0 0' }}
                  onClick={() => {
                    const name = childNameValue;
                    const idx = configData.optionsChilds.findIndex((item) => {
                      return item.name === name;
                    });
                    if (idx > -1) {
                      message.error('添加失败，子属性名称重复！');
                    } else {
                      setConfigData((state) => {
                        return {
                          ...state,
                          optionsChilds: state.optionsChilds.concat([
                            {
                              name: name,
                              datas: [],
                            },
                          ]),
                        };
                      });
                      setChildNameValue('');
                    }
                  }}
                >
                  添加子属性描述
                </Button>
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 800, padding: '16px 0' }}>事件：</div>
              <CWTable
                size='small'
                columns={eventColumns}
                dataSource={configData.events}
                bordered
                pagination={false}
                footer={null}
                rowKey='key'
              />
              <Button
                style={{ margin: '16px 0' }}
                onClick={() => {
                  setAddingEvent({
                    name: '',
                    param: '',
                    desc: '',
                  });
                  setAddEventVisible(true);
                }}
              >
                向下添加行
              </Button>
            </div>
            <div>
              <div style={{ fontWeight: 800, marginBottom: 16 }}>监听：</div>
              <CWTable
                size='small'
                columns={listenerColumns}
                dataSource={configData.listeners}
                bordered
                pagination={false}
                footer={null}
                rowKey='key'
              />
              <Button
                style={{ margin: '16px 0' }}
                onClick={() => {
                  setAddingEvent({
                    name: '',
                    param: '',
                    desc: '',
                  });
                  setAddListenerVisible(true);
                }}
              >
                向下添加行
              </Button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontWeight: 800,
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>更多信息：</span>
                <Button
                  type='primary'
                  onClick={() => {
                    setMarking(!marking);
                  }}
                >
                  {marking ? '完成' : '进入编辑'}
                </Button>
              </div>
              <Ace
                style={{
                  width: '100%',
                  height: 200,
                  display: marking ? 'block' : 'none',
                }}
                mode='javascript'
                theme='github'
                showPrintMargin={false}
                value={configData.markValue}
                onChange={(val) => {
                  setConfigData((state) => {
                    return {
                      ...state,
                      markValue: val,
                    };
                  });
                }}
                name='markText'
                editorProps={{ $blockScrolling: true }}
              />
              <div
                style={{
                  padding: 20,
                  border: '1px solid #eee',
                  backgroundColor: '#eee',
                  display: marking ? 'none' : 'block',
                }}
              >
                <ReactMarkdown children={configData.markValue}></ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={addingOptionVisible}
        onCancel={() => {
          setAddingOptionVisible(false);
        }}
        onOk={() => {
          const idx = configData.options.findIndex((item) => {
            return item.name == addingOption.name;
          });
          if (idx > -1) {
            message.error('属性名称已存在！');
          } else {
            setConfigData((state) => {
              return {
                ...state,
                options: state.options.concat([addingOption]),
              };
            });
            setAddingOptionVisible(false);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>属性：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.name}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  name: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>描述：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.desc}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  desc: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>类型：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.type}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  type: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label style={{ marginLeft: -15 }}>默认值：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.defaultValue}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  defaultValue: e.target.value,
                });
              }}
            ></Input>
          </div>
        </div>
      </Modal>
      <Modal
        visible={addingOptionChildVisible}
        onCancel={() => {
          setAddingOptionChildVisible(false);
        }}
        onOk={() => {
          const childConfig = configData.optionsChilds.find((item) => {
            return item.name === addingChildName;
          });
          const idx = childConfig.datas.findIndex((item) => {
            return item.name === addingOption.name;
          });
          if (idx > -1) {
            message.error('属性名称已存在！');
          } else {
            setConfigData((state) => {
              return {
                ...state,
                optionsChilds: state.optionsChilds.map((item) => {
                  if (item.name === addingChildName) {
                    item.datas = item.datas.concat([
                      { ...addingOption, parentName: addingChildName },
                    ]);
                  }
                  return item;
                }),
              };
            });
            setAddingOptionChildVisible(false);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>属性：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.name}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  name: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>描述：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.desc}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  desc: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>类型：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.type}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  type: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label style={{ marginLeft: -15 }}>默认值：</label>
            <Input
              style={{ width: 300 }}
              value={addingOption.defaultValue}
              onChange={(e) => {
                setAddingOption({
                  ...addingOption,
                  defaultValue: e.target.value,
                });
              }}
            ></Input>
          </div>
        </div>
      </Modal>
      <Modal
        visible={addEventVisible}
        onCancel={() => {
          setAddEventVisible(false);
        }}
        onOk={() => {
          const idx = configData.events.findIndex((item) => {
            return item.name == addingEvent.name;
          });
          if (idx > -1) {
            message.error('事件名称已存在！');
          } else {
            setConfigData((state) => {
              return {
                ...state,
                events: state.events.concat([addingEvent]),
              };
            });
            setAddEventVisible(false);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label style={{ marginLeft: -30 }}>事件名称：</label>
            <Input
              style={{ width: 300 }}
              value={addingEvent.name}
              onChange={(e) => {
                setAddingEvent({
                  ...addingEvent,
                  name: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>参数：</label>
            <Input
              style={{ width: 300 }}
              value={addingEvent.param}
              onChange={(e) => {
                setAddingEvent({
                  ...addingEvent,
                  param: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>描述：</label>
            <Input
              style={{ width: 300 }}
              value={addingEvent.desc}
              onChange={(e) => {
                setAddingEvent({
                  ...addingEvent,
                  desc: e.target.value,
                });
              }}
            ></Input>
          </div>
        </div>
      </Modal>
      <Modal
        visible={addListenerVisible}
        onCancel={() => {
          setAddListenerVisible(false);
        }}
        onOk={() => {
          const idx = configData.listeners.findIndex((item) => {
            return item.name == addingEvent.name;
          });
          if (idx > -1) {
            message.error('事件名称已存在！');
          } else {
            setConfigData((state) => {
              return {
                ...state,
                listeners: state.listeners.concat([addingEvent]),
              };
            });
            setAddListenerVisible(false);
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label style={{ marginLeft: -30 }}>事件名称：</label>
            <Input
              style={{ width: 300 }}
              value={addingEvent.name}
              onChange={(e) => {
                setAddingEvent({
                  ...addingEvent,
                  name: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>参数：</label>
            <Input
              style={{ width: 300 }}
              value={addingEvent.param}
              onChange={(e) => {
                setAddingEvent({
                  ...addingEvent,
                  param: e.target.value,
                });
              }}
            ></Input>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: 10 }}>
            <label>描述：</label>
            <Input
              style={{ width: 300 }}
              value={addingEvent.desc}
              onChange={(e) => {
                setAddingEvent({
                  ...addingEvent,
                  desc: e.target.value,
                });
              }}
            ></Input>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default Detail;
