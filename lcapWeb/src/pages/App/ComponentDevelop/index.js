/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: Rise.Hao
 * @LastEditTime: 2022-04-02 20:47:44
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Layout, Icon, Select, Input, Table, Popover, Button, Modal, Row, Col, message, Popconfirm, Upload, Spin, Progress } from 'antd';
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";

import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import HandleMenu from "./components/handleMenu";
import AddComponent from "./components/addComponent";
import EditComponent from "./components/editComponent";
import Detail from "./components/detail";
import _ from "lodash";
import axios from 'axios';


import {
    updateTreeDataService,
    copyComponentService,
    deleteComponentService,
    downloadComponentService,
    uploadLibraryService
} from './services';
import moment from 'moment';
import * as CONSTANT from './constant';
import API from '../../../services/api/component';
import CodeDevelop from "./components/codeDevelop";

const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { Dragger } = Upload;

const ComponentDevelop = observer((props) => {
    const columns = [
        {
            title: '组件类型',
            dataIndex: 'subCategory',
            width: 100,
            key: 'subCategory',
            render: (text) => {
                let txt = '';
                treeData.map(item => {
                    item.children ? item.children.map(v => {
                        if (v.id === text) {
                            txt = v.name;
                        }
                    }) : null;
                    return item;
                });
                return <span>{txt}</span>;
            }
        },
        {
            title: '组件名称',
            dataIndex: 'name',
            width: 150,
            key: 'name',
            render: (text, record) => {
                return <a className={styles.nameLink} onClick={() => {
                    setViewId(record.id);
                    setDetailShow(true);
                }}>{text}</a>;
            }
        },
        {
            title: '所属项目',
            dataIndex: 'projects',
            width: 200,
            key: 'projects',
            render: (text, record) => {
                return text.map((v, k) => {
                    return <span key={k}>
                        {v.name + (k === (text.length - 1) ? '' : ',')}
                    </span>;
                });
            }
        },
        {
            title: '组件快照',
            dataIndex: 'cover',
            width: 120,
            key: 'cover',
            render: (text) => {
                return <img src={window.LCAP_CONFIG.snapshotAddress + text} width={100} height={40}
                    style={{ cursor: 'pointer', border: '1px solid #eee' }}
                    onClick={() => {
                        setpreviewImgUrl(window.LCAP_CONFIG.snapshotAddress + text);
                        setImgModalVisible(true);
                    }}
                ></img>;
            }
        },
        {
            title: '组件标签',
            dataIndex: 'tags',
            width: 200,
            key: 'tags',
            render: (text, record) => {
                return text.map((v, k) => {
                    return <span key={k}>
                        {v.name + (k === (text.length - 1) ? '' : ',')}
                    </span>;
                });
            }
        },
        {
            title: '组件状态',
            dataIndex: 'developStatus',
            width: 120,
            key: 'developStatus',
            render: (text) => {
                return <span>{CONSTANT.componentDevelopStatus_map_ch[text]}</span>;
            }
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
            }
        },
        {
            title: '最近更新时间',
            dataIndex: 'updateTime',
            width: 200,
            key: 'updateTime',
            render: (text) => {
                return moment(Number(text)).format('YYYY.MM.DD HH:mm:ss');
            }
        },
        {
            title: '描述',
            dataIndex: 'desc',
            width: 100,
            key: 'desc',
            render: (text, record) => {
                return <Popover
                    placement='left'
                    content={<div
                        className={styles.descPopWrap}
                    >
                        {text}
                    </div>}
                >
                    <div className={styles.descWrap}>{text}</div>
                </Popover>;
            }
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
            render: (text, record) => (
                <>
                    <Popover
                        content={
                            <div className={styles.btnWraper}>
                                <div
                                    onClick={() => {
                                        setDevelopingData(record);
                                        // setDeveloping(true);
                                        setDetailShow(false);
                                        setShowRecord(false);
                                        props.history.push({ pathname: `/app/${record.id}/code-develop`, state: { name: record.name } });
                                    }}
                                >开发组件</div>
                                <div
                                    onClick={() => {
                                        setCopyId(record.id);
                                        setCopyModalvisible(true);
                                    }}
                                >复制组件</div>
                                <div
                                    onClick={() => {
                                        setUploadId(record.id);
                                        setUploadProgress(0);
                                        setImportModalvisible(true);
                                    }}
                                >导入源码</div>
                                <div
                                    onClick={() => {
                                        if (record.exportStatus) {
                                            return;
                                        }
                                        setListData({
                                            ...listData,
                                            list: listData.list.map(item => {
                                                if (item.id === record.id) {
                                                    item.exportStatus = true;
                                                }
                                                return item;
                                            })
                                        });
                                        setListData({
                                            ...listData,
                                            list: listData.list.map(item => {
                                                if (item.id === record.id) {
                                                    item.exportProgress = 0;
                                                }
                                                return item;
                                            })
                                        });
                                        exportCode(record.id, (event) => {
                                            setListData({
                                                ...listData,
                                                list: listData.list.map(item => {
                                                    if (item.id === record.id) {
                                                        item.exportProgress = parseInt((event.loaded / event.total) * 100);
                                                    }
                                                    return item;
                                                })
                                            });
                                        }).then(() => {
                                            setListData({
                                                ...listData,
                                                list: listData.list.map(item => {
                                                    if (item.id === record.id) {
                                                        item.exportStatus = false;
                                                    }
                                                    return item;
                                                })
                                            });
                                            message.success('导出成功!');
                                        }, () => {
                                            message.error('导出失败!');
                                        });
                                    }}
                                >
                                    {record.exportStatus ? <><Spin spinning={true} size='small' style={{ marginRight: 5 }} />导出中</> : '导出源码'}
                                </div>
                                {
                                    userInfo.isAdmin ?
                                        <Popconfirm
                                            disabled={record.developStatus == CONSTANT.DEVELOPSTATUS_DOING}
                                            title={record.isLib ? '确定从组件库移除？' : "确定上传组件至组件库?上传后该组件可公开被查看及使用。"}
                                            onConfirm={() => {
                                                uploadToLibrary(record);
                                            }}
                                            okText="是"
                                            cancelText="否"
                                        >
                                            <div
                                                style={{ color: record.developStatus == CONSTANT.DEVELOPSTATUS_DOING ? '#ccc' : 'rgb(68, 156, 242)' }}
                                            >{record.isLib ? '从组件库移除' : '上传组件库'}</div>
                                        </Popconfirm>
                                        : null
                                }
                                {
                                    record.type === CONSTANT.TYPE_PROJECT ?
                                        <div
                                            onClick={() => {
                                                setEditData(record);
                                                setEditModalvisible(true);
                                            }}
                                        >编辑信息</div> :
                                        (userInfo.isAdmin ?
                                            <div
                                                onClick={() => {
                                                    setEditData(record);
                                                    setEditModalvisible(true);
                                                }}
                                            >编辑信息</div> : null)
                                }
                                <Popconfirm
                                    title='确定要删除吗？'
                                    cancelText='否'
                                    okText='是'
                                    onConfirm={() => { deleteComponet(record.id); }}
                                >
                                    <div>删除</div>
                                </Popconfirm>
                            </div>
                        }
                        placement="right"
                    >
                        <span style={{ color: '#449CF2', cursor: 'pointer' }}>
                            操作选项
            </span>
                    </Popover>
                    {
                        record.exportStatus ?
                            <Popover content={record.exportProgress + '%'} style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                                <Spin spinning={true} size='small' style={{ marginLeft: 5 }} />
                            </Popover>
                            : null
                    }
                </>
            ),
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
        getUserInfo,
        setSearchName,
        setSearchKey,
        setSearchStatus,
        setSearchProject,
        setSearchType,
        setViewId,
        setEditData,
        getProjectsData,
        getTagsData,
        setDeveloping,
        setDevelopingData,
        setCurPage,
        setPageSize,
        getTreeDataFirst
    } = store;
    const {
        addModalvisible, editModalvisible, importModalvisible, treeData,
        listData, selectedData, searchName, searchKey, searchStatus, searchType, searchProject, projectsData,
        userInfo, developing, curPage, pageSize
    } = store;

    const [addCateName, setAddCateName] = useState('');
    const [copyModalvisible, setCopyModalvisible] = useState(false);
    const [copyId, setCopyId] = useState('');
    const [copyName, setCopyName] = useState('');
    const [uploadId, setUploadId] = useState('');

    const [collapsed, setCollapsed] = useState(false);
    const [imgModalVisible, setImgModalVisible] = useState(false);
    const [previewImgUrl, setpreviewImgUrl] = useState('');

    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFileInfo, setUploadFileInfo] = useState();

    // 请求列表数据
    useEffect(() => {
        getUserInfo();
        getProjectsData();
        getTagsData();
        getTreeDataFirst();
    }, []);
    useEffect(() => {
        getListData();
    }, [selectedData]);
    const copyComponent = async (id, name) => {
        if (name) {
            const res = await copyComponentService(id, name);
            if (res && res.code == 0) {
                message.success('复制成功');
                setCopyModalvisible(false);
                getListData();
            } else {
                message.error(res.msg || '复制失败！');
            }
        } else {
            message.error('组件名称不能为空!');
        }
    };
    const deleteComponet = async (id) => {
        const res = await deleteComponentService(id);
        if (res && res.code == 0) {
            message.success('删除成功');
            getListData();
        } else {
            message.error(res.msg || '删除失败！');
        }
    };
    const exportCode = async (id, onProgress) => {
        const res = await downloadComponentService(id, onProgress);
        // if (res) {
        //   console.log(res);
        //   const $link = document.createElement("a");
        //   let blob = new Blob([res],{type:'application/zip'});
        //   $link.href = window.URL.createObjectURL(blob);
        //   $link.download = 'component.zip';
        //   document.body.appendChild($link);
        //   $link.click();
        //   document.body.removeChild($link); // 下载完成移除元素
        //   window.URL.revokeObjectURL($link.href); // 释放掉blob对象
        // }

        // window.open('/api/components/export-source-code/'+id);

        // const $link = document.createElement("a");
        // $link.href = '/api/components/export-source-code/'+id;

        // document.body.appendChild($link);
        // $link.click();
        // document.body.removeChild($link); // 下载完成移除元素
        // window.URL.revokeObjectURL($link.href); // 释放掉blob对象

        axios.get(`${window.LCAP_CONFIG.apiDomain}/components/export-source-code/${id}`, {
            responseType: 'blob',
            timeout: 0
        },
        ).then((res) => {
            const $link = document.createElement("a");

            // let blob = new Blob([res.data],{type:'application/octet-stream'});
            // let blob = new Blob([res.data]);
            const url = window.URL.createObjectURL(res.data);
            $link.href = url;

            const disposition = res.headers['content-disposition'];
            $link.download = decodeURI(disposition.replace('attachment;filename=', ''));

            document.body.appendChild($link);
            $link.click();
            document.body.removeChild($link); // 下载完成移除元素
            window.URL.revokeObjectURL($link.href); // 释放掉blob对象
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

    return <>
        {developing ? <CodeDevelop /> :
            <Layout style={{ height: '100%' }} className={styles.layoutWrap + (collapsed ? (' ' + styles.collapsedClass) : '')}>
                <Sider trigger={null} collapsible collapsed={collapsed}
                    width={220}
                // style={{width:collapsed?'0px !important':200}}
                >
                    <div className={styles.collbar}>
                        <Icon
                            className="trigger"
                            type={collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={() => { setCollapsed(!collapsed); }}
                        />
                    </div>
                    <div className={styles.leftWrap} style={{ display: collapsed ? 'none' : 'flex' }}>
                        <div className={styles.treeWrap}>
                            <HandleMenu />
                        </div>
                    </div>
                </Sider>
                <Content>
                    <div className={styles.rightWraper}>

                        <div className={styles.handleWrap}>
                            <div>
                                <span>组件名称：</span>
                                <Input placeholder='请输入'
                                    // style={{width:'calc(100% - 70px)'}}
                                    style={{ width: 150 }}
                                    value={searchName}
                                    onChange={(e) => {
                                        setSearchName(e.target.value);
                                        // setSearchKey('');
                                        setCurPage(0);
                                        getListData();
                                    }}
                                ></Input>
                            </div>
                            <div>
                                <span>　</span>
                                <Input
                                    // style={{width:'100%'}}
                                    style={{ width: 250 }}
                                    placeholder='输入描述/标签/创建人查找组件'
                                    value={searchKey}
                                    onChange={(e) => {
                                        setSearchKey(e.target.value);
                                        setCurPage(0);
                                        getListData();
                                    }}
                                ></Input>
                            </div>
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
                                        setCurPage(0);
                                        getListData();
                                    }}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        projectsData.map(item => {
                                            return <Option value={item.id} key={item.id} title={item.name}>{item.name}</Option>;
                                        })
                                    }
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
                                        setCurPage(0);
                                        getListData();
                                    }}
                                >
                                    <Option value='all'>全部</Option>
                                    <Option value="doing">开发中</Option>
                                    <Option value="online">已上线</Option>
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
                                        setCurPage(0);
                                        getListData();
                                    }}
                                >
                                    <Option value='all'>全部</Option>
                                    <Option value="common">基础组件</Option>
                                    <Option value="project">项目组件</Option>
                                </Select>
                            </div>
                            <div>
                                <Button
                                    type='primary'
                                    style={{ borderRadius: '3px' }}
                                    onClick={() => {
                                        setAddModalvisible(true);
                                    }}
                                >添加组件</Button>
                                <span>　</span>
                            </div>
                        </div>
                        <div className={styles.listWraper}>
                            <Table
                                columns={columns}
                                dataSource={listData ? toJS(listData).list : []}
                                rowKey="id"
                                scroll={{ x: 1660 }}
                                pagination={{
                                    showSizeChanger: true,
                                    showTotal: (total) => {
                                        return `共${total}条记录`;
                                    },
                                    total: listData ? listData.total : 0,
                                    pageSize: pageSize,
                                    current: curPage + 1,
                                    onShowSizeChange: (page, pageSize) => {
                                        setCurPage(0);
                                        setPageSize(pageSize);
                                        getListData();
                                    },
                                    onChange: (current, size) => {
                                        setCurPage(current - 1);
                                        getListData();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <Modal
                        title="添加组件"
                        visible={addModalvisible}
                        footer={null}
                        width='50%'
                        onCancel={() => { setAddModalvisible(false); }}
                    >
                        <AddComponent />
                    </Modal>
                    <Modal
                        title="编辑组件"
                        visible={editModalvisible}
                        destroyOnClose
                        footer={null}
                        width='50%'
                        onCancel={() => { setEditModalvisible(false); }}
                    >
                        <EditComponent />
                    </Modal>
                    <Modal
                        title="复制组件"
                        visible={copyModalvisible}
                        // footer={null}
                        width='30%'
                        onCancel={() => { setCopyModalvisible(false); }}
                        onOk={() => {
                            copyComponent(copyId, copyName);
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <label>组件名称：</label>
                            <Input value={copyName}
                                style={{ width: 300 }}
                                onChange={(e) => {
                                    setCopyName(e.target.value);
                                }}
                            ></Input>
                        </div>
                    </Modal>
                    <Modal
                        title="图片预览"
                        visible={imgModalVisible}
                        footer={null}
                        width='60%'
                        height='80%'
                        className={styles.imgPreviewBody}
                        onCancel={() => { setImgModalVisible(false); }}
                    >
                        <img src={previewImgUrl} width='100%' height='100%'></img>
                    </Modal>
                    <Modal
                        title="导入源码"
                        visible={importModalvisible}
                        width={500}
                        closable={false}
                        okButtonProps={{ style: { display: uploadProgress == 100 ? 'inline-block' : 'none' } }}
                        cancelButtonProps={{ style: { display: uploadProgress == 100 ? 'none' : 'inline-block' } }}
                        onCancel={() => {
                            setImportModalvisible(false);
                        }}
                        onOk={() => {
                            setImportModalvisible(false);
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', height: 230 }}>
                            <Dragger
                                accept=".zip"
                                height={170}
                                action={API.UPLOAD_COMPONENT + '/' + uploadId}
                                headers={{ authorization: 'authorization-text' }}
                                method="post"
                                name="file"
                                showUploadList={false}
                                beforeUpload={() => {
                                    setUploadProgress(0);
                                }}
                                onChange={({ file, fileList, event }) => {
                                    if (file?.response?.code === 1000) { message.error('源码文件格式错误'); }
                                    setUploadFileInfo(file);
                                    if (event) {
                                        setUploadProgress(event.percent);
                                    }
                                }}
                            >
                                {
                                    uploadProgress == 0 ?
                                        <>
                                            <div className={styles.uploadIcon}>
                                                <Icon type="folder" />
                                            </div>
                                            <p className={styles.uploadText}>单击或拖动文件到此区域</p>
                                        </> :
                                        (uploadProgress == 100 ?
                                            <div>
                                                <div className={styles.uploadResultWrap}>
                                                    <div className={styles.uploadFileIcon}></div>
                                                    <div>{uploadFileInfo.name}</div>
                                                </div>
                                                <div>
                                                    <span>重新上传</span>
                                                </div>
                                            </div> :
                                            <div className={styles.progressWrap}>
                                                <div>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <Spin spinning={true} size="small" style={{ marginRight: 10 }}></Spin>
                                                        上传中...
                                                    </div>
                                                    <Progress percent={uploadProgress} strokeColor="#52C41A" showInfo={false} strokeWidth={3} />
                                                </div>
                                            </div>
                                        )
                                }
                            </Dragger>
                            <span style={{ margin: '20px 0px', color: '#ccc' }}>仅支持压缩包类文件上传</span>
                        </div>
                    </Modal>
                    <Detail />
                </Content>
            </Layout>
        }
    </>;
});
export default ComponentDevelop;
