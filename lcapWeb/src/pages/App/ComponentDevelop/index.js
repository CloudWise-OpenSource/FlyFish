/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-29 16:32:12
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Select,
  Input,
  Icon,
  CWTable,
  Button,
  Modal,
  message,
  Upload,
  DemoShow,
  Space,
  Popconfirm,
  Spin,
  Popover,
  Menu,
  Dropdown,
  Tooltip,
  Progress,
  Tag,
  CWSelect,
  Pagination,
  Divider,
} from '@chaoswise/ui';
import { observer, toJS } from '@chaoswise/cw-mobx';
import store from './model/index';

import { successCode } from '@/config/global';
import styles from './assets/style.less';
import { FormattedMessage, useIntl } from 'react-intl';
import HandleMenu from './components/handleMenu';
import AddComponent from './components/addComponent';
import EditComponent from './components/editComponent';
import Detail from './components/detail';
import _ from 'lodash';
import axios from 'axios';
import globalStore from '@/stores/globalStore';
import {
  deleteComponentService,
  downloadComponentService,
  uploadLibraryService,
} from './services';
import moment from 'moment';
import * as CONSTANT from './constant';
import API from '../../../services/api/component';
import CodeDevelop from './components/codeDevelop';
import AddFromSource from './components/addFromSource';

import ComponentCover from '@/components/ComponentCover';
import CloneComponent from './components/cloneComponent';

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { Dragger } = Upload;

const ComponentDevelop = observer((props) => {
  const { userInfo } = globalStore;
  const iuser = (userInfo && userInfo.iuser) || {};
  const fromLcap = -1;
  const columns = [
    {
      title: '组件类型',
      dataIndex: 'subCategory',
      width: 100,
      key: 'subCategory',
      render: (text) => {
        let txt = '';
        treeData.map((item) => {
          item.children
            ? item.children.map((v) => {
                if (v.id === text) {
                  txt = v.name;
                }
              })
            : null;
          return item;
        });
        return (
          <Tooltip title={txt}>
            <span className={styles.comType}>{txt}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '组件名称',
      dataIndex: 'name',
      width: 150,
      key: 'name',
      render: (text, record) => {
        return (
          <Tooltip title={text}>
            <a
              className={styles.nameLink}
              onClick={() => {
                setViewId(record.id);
                setDetailShow(true);
              }}
            >
              {text}
            </a>
          </Tooltip>
        );
      },
    },
    {
      title: '所属项目',
      dataIndex: 'projects',
      width: 200,
      key: 'projects',
      render: (text, record) => {
        return text.map((v, k) => {
          return (
            <span key={k}>{v.name + (k === text.length - 1 ? '' : ',')}</span>
          );
        });
      },
    },
    {
      title: '组件快照',
      dataIndex: 'cover',
      width: 120,
      key: 'cover',
      render: (text, record = {}) => {
        return text ? (
          <ComponentCover
            link={text}
            width={100}
            onClick={() => {
              setpreviewImgUrl(window.FLYFISH_CONFIG.snapshotAddress + text);
              setImgModalVisible(true);
            }}
          ></ComponentCover>
        ) : (
          ''
        );
      },
    },
    {
      title: '组件标签',
      dataIndex: 'tags',
      width: 200,
      key: 'tags',
      render: (text, record) => {
        return text.map((v, k) => {
          return (
            <span key={k}>{v.name + (k === text.length - 1 ? '' : ',')}</span>
          );
        });
      },
    },
    {
      title: '组件状态',
      dataIndex: 'developStatus',
      width: 120,
      key: 'developStatus',
      render: (text) => {
        return (
          <span>
            {text === 'online' ? (
              <Tag color='green'>
                {CONSTANT.componentDevelopStatus_map_ch[text]}
              </Tag>
            ) : (
              <Tag color='red'>
                {CONSTANT.componentDevelopStatus_map_ch[text]}
              </Tag>
            )}
          </span>
        );
      },
    },
    {
      title: '版本',
      dataIndex: 'version',
      width: 120,
      key: 'version',
    },
    {
      title: '组件类别',
      dataIndex: 'type',
      width: 150,
      key: 'type',
      render: (text) => {
        return <span>{CONSTANT.componentType_map_ch[text]}</span>;
      },
    },
    {
      title: '最近更新时间',
      dataIndex: 'updateTime',
      width: 200,
      key: 'updateTime',
      render: (text) => {
        return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss');
      },
    },
    {
      title: '描述',
      dataIndex: 'desc',
      width: 100,
      key: 'desc',
      render: (text, record) => {
        return (
          <>
            {text && text.length > 7 ? (
              <Popover
                placement='left'
                content={<div className={styles.descPopWrap}>{text}</div>}
              >
                <div className={styles.descWrap}>{text}</div>
              </Popover>
            ) : (
              <div className={styles.descWrap}>{text}</div>
            )}
          </>
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      width: 100,
      key: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      width: 110,
      fixed: 'right',
      render: (text, record) => {
        const isLcap = record.accountId === fromLcap;
        const isSplit = window.FLYFISH_CONFIG.isSplitComponentModule;
        return (
          <>
            <Popover
              content={
                <div className={styles.btnWraper}>
                  <div
                    className={isLcap || isSplit ? styles.btnDisabled : ''}
                    onClick={() => {
                      if (isLcap || isSplit) {
                        return;
                      }
                      setDevelopingData(record);
                      setDetailShow(false);
                      setShowRecord(false);
                      props.history.push({
                        pathname: `/app/code-develop/${record.id}`,
                        state: { name: record.name },
                      });
                    }}
                  >
                    开发组件
                  </div>
                  <div
                    className={isLcap || isSplit ? styles.btnDisabled : ''}
                    onClick={() => {
                      if (isLcap || isSplit) {
                        return;
                      }
                      setCloneRecord({ ...record });
                      setCopyModalvisible(true);
                    }}
                  >
                    复制组件
                  </div>
                  <div
                    className={isLcap || isSplit ? styles.btnDisabled : ''}
                    onClick={() => {
                      if (isLcap || isSplit) {
                        return;
                      }
                      setUploadId(record.id);
                      setUploadProgress(0);
                      setImportModalvisible(true);
                    }}
                  >
                    导入源码
                  </div>
                  <div
                    className={isLcap || isSplit ? styles.btnDisabled : ''}
                    onClick={() => {
                      if (isLcap || isSplit) {
                        return;
                      }
                      setListData({
                        ...listData,
                        list: listData.list.map((item) => {
                          if (item.id === record.id) {
                            item.exportStatus = true;
                          }
                          return item;
                        }),
                      });
                      setListData({
                        ...listData,
                        list: listData.list.map((item) => {
                          if (item.id === record.id) {
                            item.exportProgress = 0;
                          }
                          return item;
                        }),
                      });
                      exportCode(record.id, (event) => {
                        setListData({
                          ...listData,
                          list: listData.list.map((item) => {
                            if (item.id === record.id) {
                              item.exportProgress = parseInt(
                                (event.loaded / event.total) * 100
                              );
                            }
                            return item;
                          }),
                        });
                      }).then((res) => {
                        const $link = document.createElement('a');

                        // let blob = new Blob([res.data],{type:'application/octet-stream'});
                        // let blob = new Blob([res.data]);
                        const url = window.URL.createObjectURL(res.data);
                        $link.href = url;

                        const disposition =
                          res.headers['content-disposition'] || '组件.zip';
                        $link.download = decodeURI(
                          disposition.replace('attachment;filename=', '')
                        );

                        document.body.appendChild($link);
                        $link.click();
                        document.body.removeChild($link); // 下载完成移除元素
                        window.URL.revokeObjectURL($link.href); // 释放掉blob对象

                        setListData({
                          ...listData,
                          list: listData.list.map((item) => {
                            if (item.id === record.id) {
                              item.exportStatus = false;
                            }
                            return item;
                          }),
                        });
                        message.success('导出成功!');
                      });
                    }}
                  >
                    {record.exportStatus ? (
                      <>
                        <Spin
                          spinning={true}
                          size='small'
                          style={{ marginRight: 5 }}
                        />
                        导出中
                      </>
                    ) : (
                      '导出源码'
                    )}
                  </div>
                  {iuser.isAdmin ? (
                    isLcap ? (
                      <div style={{ color: '#ccc' }}>
                        {record.isLib ? '从组件库移除' : '上传组件库'}
                      </div>
                    ) : (
                      <Popconfirm
                        disabled={
                          record.developStatus == CONSTANT.DEVELOPSTATUS_DOING
                        }
                        title={
                          record.isLib
                            ? '确定从组件库移除？'
                            : '确定上传组件至组件库?上传后该组件可公开被查看及使用。'
                        }
                        onConfirm={() => {
                          uploadToLibrary(record);
                        }}
                        okText='是'
                        cancelText='否'
                      >
                        <div
                          style={{
                            color:
                              record.developStatus ==
                              CONSTANT.DEVELOPSTATUS_DOING
                                ? '#ccc'
                                : 'rgb(68, 156, 242)',
                          }}
                        >
                          {record.isLib ? '从组件库移除' : '上传组件库'}
                        </div>
                      </Popconfirm>
                    )
                  ) : null}
                  {record.type === CONSTANT.TYPE_PROJECT ? (
                    <div
                      className={isLcap ? styles.btnDisabled : ''}
                      onClick={() => {
                        if (isLcap) {
                          return;
                        }
                        setEditData(record);
                        setEditModalvisible(true);
                      }}
                    >
                      编辑信息
                    </div>
                  ) : iuser.isAdmin ? (
                    <div
                      className={isLcap ? styles.btnDisabled : ''}
                      onClick={() => {
                        if (isLcap) {
                          return;
                        }
                        setEditData(record);
                        setEditModalvisible(true);
                      }}
                    >
                      编辑信息
                    </div>
                  ) : null}
                  {isLcap ? (
                    <div className={styles.btnDisabled}>删除</div>
                  ) : (
                    <Popconfirm
                      title='确定要删除吗？'
                      cancelText='否'
                      okText='是'
                      onConfirm={() => {
                        deleteComponet(record.id);
                      }}
                    >
                      <div>删除</div>
                    </Popconfirm>
                  )}
                </div>
              }
              placement='right'
            >
              <span
                style={{ color: 'rgba(24, 144, 255,1)', cursor: 'pointer' }}
              >
                操作选项
              </span>
            </Popover>
            {record.exportStatus ? (
              <Popover
                content={record.exportProgress + '%'}
                style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
              >
                <Progress
                  type='circle'
                  style={{ marginLeft: 5, position: 'absolute' }}
                  percent={record.exportProgress}
                  strokeWidth={15}
                  width={12}
                  showInfo={false}
                />
              </Popover>
            ) : null}
          </>
        );
      },
    },
  ];
  const intl = useIntl();
  const {
    setDetailShow,
    setShowRecord,
    setAddModalvisible,
    setEditModalvisible,
    setImportModalvisible,
    getTreeData,
    getListData,
    setListData,
    setSelectedData,
    setSearchName,
    setSearchKey,
    setSearchStatus,
    setSearchProject,
    setSearchType,
    setViewId,
    setEditData,
    getProjectsData,
    getTagsData,
    setDevelopingData,
    setCurPage,
    setPageSize,
    getTreeDataFirst,
    setAddFromSourcevisible,
    setUserCurPage,
    getUserList,
    setCreator,
    setCreatorId,
  } = store;
  const {
    addModalvisible,
    editModalvisible,
    importModalvisible,
    treeData,
    listData,
    selectedData,
    searchName,
    creator,
    creatorId,
    searchKey,
    searchStatus,
    searchType,
    searchProject,
    projectsData,
    developing,
    curPage,
    pageSize,
    addFromSourcevisible,
    userCurPage,
    userList,
    userTotal,
  } = store;

  const [addCateName, setAddCateName] = useState('');
  const [copyModalvisible, setCopyModalvisible] = useState(false);
  const [cloneRecord, setCloneRecord] = useState('');
  const [uploadId, setUploadId] = useState('');

  const [collapsed, setCollapsed] = useState(false);
  const [imgModalVisible, setImgModalVisible] = useState(false);
  const [previewImgUrl, setpreviewImgUrl] = useState('');

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileInfo, setUploadFileInfo] = useState();

  const userPageSize = 5;
  // 请求列表数据
  useEffect(() => {
    getUserList();
    getProjectsData();
    getTagsData();
    getTreeDataFirst();
  }, []);
  useEffect(() => {
    if (selectedData) {
      getListData();
    }
  }, [selectedData]);
  const deleteComponet = async (id) => {
    const res = await deleteComponentService(id);
    if (res && res.code == 0) {
      message.success('删除成功');
      getListData();
    } else {
      message.error(res.msg || '删除失败！');
    }
  };
  const exportCode = (id, onProgress) => {
    return axios.get(`${API.DOWNLOAD_COMPONENT}/${id}`, {
      responseType: 'blob',
      onDownloadProgress: (event) => {
        onProgress(event);
      },
      timeout: 0,
    });
  };
  const uploadToLibrary = async (record) => {
    const { id, isLib } = record;
    const res = await uploadLibraryService(id, !isLib);
    if (res && res.code === 0) {
      message.success('操作成功');
      getListData();
    } else {
      message.error(res.msg);
    }
  };

  const debounceGetData = useCallback(
    _.debounce(() => {
      getListData();
    }, 500),
    []
  );

  const menu = (
    <Menu>
      <Menu.Item>
        <Button
          className={styles.addComponentBtnStyle}
          onClick={() => {
            setAddModalvisible(true);
          }}
        >
          创建新组件
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          className={styles.addComponentBtnStyle}
          onClick={() => {
            setAddFromSourcevisible(true);
          }}
        >
          从源码导入
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {developing ? (
        <CodeDevelop />
      ) : (
        <Layout
          style={{ height: '100%' }}
          className={
            styles.layoutWrap + (collapsed ? ' ' + styles.collapsedClass : '')
          }
        >
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={220}
            // style={{width:collapsed?'0px !important':200}}
          >
            <div className={styles.collbar}>
              <Icon
                className='trigger'
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
              />
            </div>
            <div
              className={styles.leftWrap}
              style={{ display: collapsed ? 'none' : 'flex' }}
            >
              <div className={styles.treeWrap}>
                <HandleMenu />
              </div>
            </div>
          </Sider>
          <Content>
            <div className={styles.rightWraper}>
              <div className={styles.handleWrap}>
                <div>
                  <span>项目名称：</span>
                  <Select
                    showSearch
                    allowClear
                    placeholder='请选择'
                    // style={{ width: 'calc(100% - 70px)' }}
                    style={{ width: 150 }}
                    value={searchProject}
                    onChange={(val) => {
                      setSearchProject(val);
                      setCurPage(1);
                      getListData();
                    }}
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {projectsData.map((item) => {
                      return (
                        <Option value={item.id} key={item.id} title={item.name}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
                <div>
                  <span>开发状态：</span>
                  <Select
                    placeholder='请选择'
                    // style={{ width: 'calc(100% - 70px)' }}
                    style={{ width: 150 }}
                    value={searchStatus}
                    onChange={(val) => {
                      setSearchStatus(val);
                      setCurPage(1);
                      getListData();
                    }}
                  >
                    <Option value='all'>全部</Option>
                    <Option value='doing'>开发中</Option>
                    <Option value='online'>已上线</Option>
                  </Select>
                </div>
                <div>
                  <span>组件类别：</span>
                  <Select
                    placeholder='请选择'
                    // style={{ width: 'calc(100% - 70px)' }}
                    style={{ width: 150 }}
                    value={searchType}
                    onChange={(val) => {
                      setSearchType(val);
                      setCurPage(1);
                      getListData();
                    }}
                  >
                    <Option value='all'>全部</Option>
                    <Option value='common'>基础组件</Option>
                    <Option value='project'>项目组件</Option>
                  </Select>
                </div>
                <div>
                  <span>组件名称：</span>
                  <Input
                    placeholder='请输入组件名称或id'
                    // style={{width:'calc(100% - 70px)'}}
                    style={{ width: 150 }}
                    value={searchName}
                    onChange={(e) => {
                      setSearchName(e.target.value);
                      // setSearchKey('');
                      setCurPage(1);
                      debounceGetData();
                    }}
                  ></Input>
                </div>
                <div>
                  <span>创建人：</span>
                  <CWSelect
                    placeholder='请输入'
                    style={{ width: 150 }}
                    showSearch
                    value={creatorId}
                    filterOption={false}
                    allowClear
                    dropdownRender={(menu) => (
                      <div>
                        {menu}
                        <Divider style={{ margin: '0' }} />
                        <div className={styles.creatorPagi}>
                          <span>共{userTotal}条</span>
                          <div className={styles.creatorPagiRight}>
                            <div
                              style={{ color: '#ccc' }}
                              onClick={() => {
                                if (userCurPage == 1) {
                                  return;
                                }
                                setUserCurPage(userCurPage - 1);
                                getUserList({ curPage: userCurPage - 1 });
                              }}
                            >
                              &lt;
                            </div>
                            <div className={styles.pageNumWrap}>
                              {userCurPage}
                            </div>
                            <div
                              style={{ color: '#ccc' }}
                              onClick={() => {
                                const maxpage =
                                  userTotal % userPageSize > 0
                                    ? parseInt(userTotal / userPageSize) + 1
                                    : parseInt(userTotal / userPageSize);
                                if (userCurPage == maxpage) {
                                  return;
                                }
                                setUserCurPage(userCurPage + 1);
                                getUserList({ curPage: userCurPage + 1 });
                              }}
                            >
                              &gt;
                            </div>
                          </div>
                        </div>
                        {/* <Pagination
                          current={userCurPage}
                          total={userTotal}
                          simple
                          size='small'
                        ></Pagination> */}
                      </div>
                    )}
                    onSearch={(val) => {
                      setCreator(val);
                      setUserCurPage(1);
                      getUserList({ username: val, curPage: 1 });
                    }}
                    onChange={(val) => {
                      setUserCurPage(1);
                      if (val === undefined) {
                        //清空时请求所有创建人
                        getUserList({ username: '', curPage: 1 });
                      }
                      setCreatorId(val || '');
                      setCurPage(0);
                      getListData();
                    }}
                  >
                    {userList.map((item) => {
                      return (
                        <CWSelect.Option key={item.userId} value={item.userId}>
                          {item.username}
                        </CWSelect.Option>
                      );
                    })}
                  </CWSelect>
                </div>
                <div>
                  <span></span>
                  <Input
                    // style={{width:'100%'}}
                    style={{ width: 250 }}
                    placeholder='输入描述/标签查找组件'
                    value={searchKey}
                    onChange={(e) => {
                      setSearchKey(e.target.value);
                      setCurPage(1);
                      debounceGetData();
                    }}
                  ></Input>
                </div>
                <div>
                  {window.FLYFISH_CONFIG.isSplitComponentModule ? null : (
                    <Dropdown
                      overlay={menu}
                      trigger={['click']}
                      overlayClassName={styles.addComponentStyle}
                    >
                      <Button type='primary'>添加组件</Button>
                    </Dropdown>
                  )}

                  <span>　</span>
                </div>
              </div>
              <div className={styles.listWraper}>
                <CWTable
                  columns={columns}
                  dataSource={listData ? toJS(listData).list : []}
                  rowKey='id'
                  scroll={{ x: 1660 }}
                  pagination={{
                    showSizeChanger: true,
                    showTotal: (total) => {
                      return `共${total}条记录`;
                    },
                    total: listData ? listData.total : 0,
                    pageSize: pageSize,
                    current: curPage,
                    onShowSizeChange: (page, pageSize) => {
                      setCurPage(1);
                      setPageSize(pageSize);
                      getListData();
                    },
                    onChange: (current, size) => {
                      setCurPage(current);
                      getListData();
                    },
                  }}
                />
              </div>
            </div>
            <Modal
              title='添加组件'
              visible={addModalvisible}
              footer={null}
              width={660}
              onCancel={() => {
                setAddModalvisible(false);
              }}
            >
              <AddComponent />
            </Modal>
            <Modal
              title='从源码导入'
              visible={addFromSourcevisible}
              footer={null}
              width={660}
              onCancel={() => {
                setAddFromSourcevisible(false);
              }}
            >
              <AddFromSource />
            </Modal>
            <Modal
              title='编辑组件'
              visible={editModalvisible}
              destroyOnClose
              footer={null}
              width='50%'
              onCancel={() => {
                setEditModalvisible(false);
              }}
            >
              <EditComponent />
            </Modal>
            <Modal
              title='复制组件'
              visible={copyModalvisible}
              width='50%'
              destroyOnClose
              footer={null}
              onCancel={() => {
                setCopyModalvisible(false);
              }}
            >
              {copyModalvisible && (
                <CloneComponent
                  cloneId={cloneRecord ? cloneRecord.id : null}
                  record={
                    cloneRecord
                      ? {
                          ...cloneRecord,
                          name: cloneRecord.name + '-复制',
                        }
                      : null
                  }
                  onCancel={() => {
                    setCopyModalvisible(false);
                    setCloneRecord(null);
                  }}
                  onSaved={() => {
                    setCloneRecord(null);
                    setCopyModalvisible(false);
                    getListData();
                  }}
                />
              )}
            </Modal>
            <Modal
              title='图片预览'
              visible={imgModalVisible}
              footer={null}
              width='60%'
              height='80%'
              className={styles.imgPreviewBody}
              onCancel={() => {
                setImgModalVisible(false);
              }}
            >
              <img src={previewImgUrl} width='100%' height='100%'></img>
            </Modal>
            <Modal
              title='导入源码'
              visible={importModalvisible}
              width={500}
              closable={false}
              okButtonProps={{
                style: {
                  display: uploadProgress == 100 ? 'inline-block' : 'none',
                },
              }}
              cancelButtonProps={{
                style: {
                  display: uploadProgress == 100 ? 'none' : 'inline-block',
                },
              }}
              onCancel={() => {
                setImportModalvisible(false);
              }}
              onOk={() => {
                setImportModalvisible(false);
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 230,
                }}
              >
                <DemoShow description='仅支持压缩包类文件上传'>
                  <Space
                    direction='vertical'
                    style={{
                      width: '100%',
                    }}
                  >
                    <Dragger
                      accept='.zip'
                      height={170}
                      action={API.UPLOAD_COMPONENT + '/' + uploadId}
                      headers={{ authorization: 'authorization-text' }}
                      method='post'
                      name='file'
                      showUploadList={true}
                      dropSingleFileUpload={true}
                      beforeUpload={() => {
                        setUploadProgress(0);
                      }}
                      onChange={({ file, fileList, event }) => {
                        if (file?.response?.code === 1000) {
                          message.error('源码文件格式错误');
                        }
                        setUploadFileInfo(file);
                        if (event) {
                          setUploadProgress(event.percent);
                        }
                      }}
                    />
                  </Space>
                </DemoShow>
              </div>
            </Modal>
            <Detail />
          </Content>
        </Layout>
      )}
    </>
  );
});
export default ComponentDevelop;
