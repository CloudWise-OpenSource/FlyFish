import React, { useState, useEffect } from 'react';
import { Input, Form, Button, SearchBar, Tooltip, Collapse, message, Progress, Popconfirm, Pagination } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import store from "../../model";
import reqStore from '@/pages/App/ApplyDevelop/model';
import Card from '@/components/TestCard';
import { Icon, Select } from 'antd';
const { Option } = Select;
const { Panel } = Collapse;
import { successCode } from "@/config/global";
import axios from 'axios';
import ApplyModal from '@/components/AddProjectModal';
import ApplyModalLib from '@/components/AddProjectModal';

import globalStore from '@/stores/globalStore';

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
    function EditProjectModal({
        templateapplicationTotal, templateapplicationCurPage, templateapplicationPageSize,
        templateapplicationList, industryList, curPage, pageSize, ProgressId, total, applicationList, activeProject, type, isAddModalVisible, isisLibModallVisible }) {

        const { userInfo } = globalStore;
        let [checkFlag, setCheckFlag] = useState(null);
        let [projectName, setProjectName] = useState('');
        const [downLoadArr, setDownLoadArr] = useState([]);
        const {
            setProjectId, setSearchParams, openIsLibModal, closeIsLibModal, setTemplateActiveProject, activeTemplate, getIndustrysList, getApplicationList, getTemplateApplicationList, setActiveProject, setType, openAddProjectModal, closeAppProjectModal
        } = store;
        // 应用的请求store
        const {
            getProjectList, getTagsList
        } = reqStore;
        const {
            projectList, tagList, addApplicationOne, changeApplicationOne, copyApplicationOne, deleteApplicationOne
        } = reqStore;
        const intl = useIntl();
        const searchContent = [
            {
                components: (
                    <Select
                        id="trades"
                        key="trades"
                        mode="multiple"
                        allowClear
                        name='行业'
                        style={{ width: "170px" }}
                        getPopupContainer={(triggerNode) =>
                            triggerNode.parentElement || document.body
                        }
                        placeholder={
                            intl.formatMessage({
                                id: "common.pleaseSelect",
                                defaultValue: "请选择",
                            }) + "行业"
                        }
                    >
                        {
                            industryList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
                        }
                    </Select>
                ),
            },
            {
                components: (
                    <Input
                        id="name"
                        key="name"
                        name='应用名称'
                        style={{ width: "170px" }}
                        placeholder={intl.formatMessage({
                            id: "pages.applyDevelop.searchInputAppName",
                            defaultValue: "输入应用名称进行查询",
                        })}
                    />
                ),
            },
            {
                components: (
                    <Select mode="multiple" id="tags"
                        key="tags"
                        getPopupContainer={(triggerNode) =>
                            triggerNode.parentElement || document.body
                        }
                        name='应用标签' style={{ width: 170 }}
                        placeholder={intl.formatMessage({
                            id: "pages.applyDevelop.searchInputApplyLabel",
                            defaultValue: "选择应用标签进行查询",
                        })}
                    >
                        {
                            tagList.length > 0 ? tagList.map(item => {
                                return <Option key={item.name} value={item.id}>{item.name}</Option>;
                            }) : null
                        }
                    </Select>
                ),
            },
        ];
        const handleChange = (value) => {
            setType(value);
            getApplicationList({ curPage: 0 });
            getTemplateApplicationList();
        };
        const handleApplicationChange = (value) => {
            setSearchParams(value);
            getTemplateApplicationList();
        };
        const exportCode = async (id, name) => {
            let obj = {
                id,
                value: 0
            };
            setDownLoadArr(downLoadArr => {
                downLoadArr.push(obj);
                return downLoadArr.slice(0);
            });
            axios.get(`${window.LCAP_CONFIG.apiDomain}/applications/export/${id}`, {
                responseType: 'blob',
                timeout: 0,
                onDownloadProgress: (evt) => {
                    setDownLoadArr(downLoadArr => {
                        return downLoadArr.map(item => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    value: parseInt(
                                        (evt.loaded / evt.total) * 100
                                    )
                                };
                            } else {
                                return item;
                            }
                        });
                    });
                },
            },
            ).then((res) => {
                const $link = document.createElement("a");
                const url = window.URL.createObjectURL(res.data);
                $link.href = url;
                const disposition = res.headers['content-disposition'];
                $link.download = decodeURI(disposition.replace('attachment;filename=', ''));
                document.body.appendChild($link);
                $link.click();
                document.body.removeChild($link); // 下载完成移除元素
            }).catch((e) => {
                console.log('e:', e);
                message.error(`${name}导出失败，请重新导出`);
            }).finally(() => {
                setDownLoadArr(list => {
                    return list.filter(item => item.value < 100);
                });

            });
        };
        // 请求列表数据
        useEffect(() => {
            setProjectId(ProgressId);
            getTagsList();
            getProjectList();
            getIndustrysList();
            getApplicationList();
            getTemplateApplicationList();
            setProjectName(JSON.parse(sessionStorage.getItem('activeProject')).name);

        }, []);
        return (
            <div className={styles.appList}>
                <div className={styles.title}>
                    <span >应用类型选择：</span>
                    <Select
                        onChange={handleChange}
                        id="name"
                        key="name"
                        defaultValue={type || '2D'}
                        style={{ width: "200px" }}
                        select
                        className={styles.select}
                        placeholder={intl.formatMessage({
                            id: "pages.applyDevelop.searchInputPlaceholder",
                            defaultValue: "选择应用类型进行查询",
                        })}
                    >
                        <Option value="2D" >2D大屏应用</Option>
                        <Option value="3D">3D大屏应用</Option>
                    </Select>
                </div>
                <Collapse defaultActiveKey={['1', '2']} ghost={true} bordered={false} >
                    <Panel header={
                        <>
                            <span>{projectName}</span>
                            <span className={styles.title}>共</span>
                            <span>{total}个应用</span>
                        </>
                    } key="1"
                        extra={<Button onClick={(e) => {
                            e.stopPropagation();
                            setCheckFlag(0);
                            openAddProjectModal({ projectId: ProgressId });
                        }} type="primary" >添加应用</Button>
                        }>
                        <div id="scrollableDiv" style={{ height: '470px', overflow: 'auto' }} >
                            <Card
                                actions={(item) => {
                                    return (
                                        <>
                                            <Tooltip key="edit" title="编辑">
                                                <a title="编辑" target="_blank" onClick={() => {
                                                    setCheckFlag(1), openAddProjectModal();
                                                }}><Icon type="edit" style={{ color: '#333' }} /></a>
                                            </Tooltip>
                                            <Tooltip key="delete" title="删除">
                                                <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                                                    deleteApplicationOne(item.id, (res) => {
                                                        if (res.code === successCode) {
                                                            message.success(
                                                                intl.formatMessage({
                                                                    id: "common.deleteSuccess",
                                                                    defaultValue: "删除成功！",
                                                                })
                                                            );
                                                            getApplicationList();
                                                        } else {
                                                            message.error(
                                                                res.msg || intl.formatMessage({
                                                                    id: "common.deleteError",
                                                                    defaultValue: "删除失败，请稍后重试！",
                                                                })
                                                            );
                                                        }
                                                    });
                                                }}>
                                                    <a title="删除"><Icon type="delete" style={{ color: '#333' }} /></a>
                                                </Popconfirm>
                                            </Tooltip>
                                            <Tooltip key="export" title="导出">
                                                <a title="导出" target="_blank" >
                                                    {
                                                        downLoadArr.map(item => item.id).includes(item.id) ? <Icon type="loading" /> : <Icon onClick={() => {
                                                            exportCode(item.id, item.name);
                                                        }} type="export" style={{ color: '#333' }} />
                                                    }
                                                </a>
                                            </Tooltip>
                                            <Tooltip key="copy" title="复制">
                                                <a title="复制" onClick={() => {
                                                    setCheckFlag(2);
                                                    openAddProjectModal();
                                                }}><Icon type="copy" style={{ color: '#333' }} /></a>
                                            </Tooltip>
                                            <a
                                                title="开发应用"
                                                target="_blank"
                                                href={`${window.LCAP_CONFIG.screenEditAddress}?id=${item.id}&token=${userInfo.yapiAuthorization}`}
                                                rel="noreferrer"
                                            >
                                                <Button value="small" type="primary">
                                                    开发
                        </Button>
                                            </a>
                                            <a
                                                title="预览应用"
                                                target="_blank"
                                                href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                                                rel="noreferrer"
                                            >
                                                <Button value="small" >
                                                    预览
                        </Button>
                                            </a>
                                        </>
                                    );
                                }}
                                downLoadArr={downLoadArr}
                                value={applicationList}
                                setActiveCard={setActiveProject}
                                state={0} showStateTag={true}
                            ></Card>
                            <Pagination
                                hideOnSinglePage={true}
                                total={total}
                                current={curPage + 1}
                                pageSize={pageSize}
                                onChange={(current) => {
                                    getApplicationList({ curPage: current - 1 });
                                }}
                            />
                        </div>


                    </Panel>
                    <Panel header='从应用模板库中选择' key="2">
                        <SearchBar
                            onSearch={handleApplicationChange}
                            searchContent={searchContent} showSearchCount={6}
                        />
                        <Card
                            value={templateapplicationList}
                            isLib={true}
                            setActiveCard={setTemplateActiveProject}
                            state={3}
                            projectID={ProgressId}
                            actions={(item) => {
                                return (
                                    <>
                                        <a
                                            title="预览应用"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <Button value="small" type="primary"
                                                onClick={() => { openIsLibModal(); }}
                                            >
                                                使用模板创建应用
                      </Button>
                                        </a>
                                        <a
                                            title="预览应用"
                                            target="_blank"
                                            href={`${window.LCAP_CONFIG.screenViewAddress}?id=${item.id}`}
                                            rel="noreferrer"
                                        >
                                            <Button value="small" >
                                                预览模板应用
                      </Button>
                                        </a>
                                    </>
                                );
                            }}
                        ></Card>
                        <Pagination
                            hideOnSinglePage={true}
                            total={templateapplicationTotal}
                            current={templateapplicationCurPage + 1}
                            pageSize={templateapplicationPageSize}
                            onChange={(current) => {
                                getTemplateApplicationList({ curPage: current - 1 });
                            }}
                        />
                    </Panel>
                </Collapse>
                {
                    isAddModalVisible && (<ApplyModal
                        onCancel={closeAppProjectModal}
                        type={type}
                        projectId={ProgressId}
                        project={activeProject}
                        addOrChangeFlag={checkFlag}
                        projectList={projectList}
                        tagList={tagList}
                        onSave={(application) => {
                            addApplicationOne(application, (res) => {
                                if (res.code === successCode) {
                                    message.success(
                                        intl.formatMessage({
                                            id: "common.addSuccess",
                                            defaultValue: "新增成功！",
                                        })
                                    );
                                    closeAppProjectModal();
                                    getTagsList();
                                    getApplicationList();
                                } else {
                                    message.error(
                                        res.msg || intl.formatMessage({
                                            id: "common.addError",
                                            defaultValue: "新增失败，请稍后重试！",
                                        })
                                    );
                                }
                            });
                        }}
                        onChange={(id, application) => {
                            changeApplicationOne(id, application, (res) => {
                                if (res.code === successCode) {
                                    message.success(
                                        intl.formatMessage({
                                            id: "common.changeSuccess",
                                            defaultValue: "编辑成功！",
                                        })
                                    );
                                    closeAppProjectModal();
                                    getTagsList();
                                    getApplicationList();
                                } else {
                                    message.error(
                                        res.msg || intl.formatMessage({
                                            id: "common.changeError",
                                            defaultValue: "编辑失败，请稍后重试！",
                                        })
                                    );
                                }
                            });
                        }}
                        onCopy={(id, item) => {
                            copyApplicationOne(id, item, (res => {
                                if (res.code === successCode) {
                                    message.success(
                                        intl.formatMessage({
                                            id: "common.copySuccess",
                                            defaultValue: "复制成功！",
                                        })
                                    );
                                    closeAppProjectModal();
                                    getTagsList();
                                    getApplicationList();
                                } else {
                                    message.error(
                                        res.msg || intl.formatMessage({
                                            id: "common.copyError",
                                            defaultValue: "复制失败，请稍后重试！",
                                        })
                                    );
                                }
                            }));
                        }}
                    />)
                }
                {/* 模板的编辑 */}
                {
                    isisLibModallVisible && (<ApplyModalLib
                        onCancel={closeIsLibModal}
                        type={type}
                        project={activeTemplate}
                        addOrChangeFlag={3}
                        projectList={projectList}
                        tagList={tagList}
                        onCopy={(id, item) => {
                            copyApplicationOne(id, item, (res => {
                                if (res.code === successCode) {
                                    message.success(
                                        intl.formatMessage({
                                            id: "common.useSuccess",
                                            defaultValue: "创建成功!",
                                        })
                                    );
                                    closeIsLibModal();
                                    getTagsList();
                                    getApplicationList();
                                } else {
                                    message.error(
                                        res.msg || intl.formatMessage({
                                            id: "common.useError",
                                            defaultValue: "创建失败，请稍后重试！",
                                        })
                                    );
                                }
                            }));
                        }}
                    />)
                }

            </div>

        );
    }
);
