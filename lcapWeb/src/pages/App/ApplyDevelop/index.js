/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Button, message, SearchBar, Icon, Pagination, Progress, Popconfirm, Tooltip } from "@chaoswise/ui";
import {
    observer
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import AppProjectModal from "@/components/AddProjectModal";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import { Select } from 'antd';
import { APP_DEVELOP_STATUS } from '@/config/global';
import axios from 'axios';
const { Option } = Select;
import DeleteApplyListModal from './components/DeleteApplyListModal';
import globalStore from '@/stores/globalStore';
const ApplyDevelop = observer((props) => {
    const { userInfo } = globalStore;
    let [checkFlag, setCheckFlag] = useState(null);
    const intl = useIntl(); const {
        getApplicationList, setPageSize,
        setSearchParams, setActiveCard,
        setCurPage, addApplicationOne, deleteApplicationOne, getApplicationListDelete, clearApplication,
        getTagsList, getProjectList, changeApplicationOne,
        openAddProjectModal, closeDeleteApplyListModal, copyApplicationOne,
        closeAppProjectModal, openDeleteApplyListModal, setType, addNewTag
    } = store;
    const { total, key, curPage, totalDelete, deleteCurPage, tagList, pageSize, activeCard, applicationListDelete, projectList, applicationList1, isDeleteApplyListModalVisible, applicationList, isAddModalVisible, activeProject } =
        store;
    const [downLoadArr, setDownLoadArr] = useState([]);
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
    const searchContent = [
        {
            components: (
                <Select
                    id="projectId"
                    key="projectId"
                    showSearch
                    allowClear
                    getPopupContainer={(triggerNode) =>
                        triggerNode.parentElement || document.body
                    }
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    style={{ width: "200px" }}
                    name='项目名称'
                    placeholder={intl.formatMessage({
                        id: "pages.applyDevelop.searchSelectProgressName",
                        defaultValue: "选择项目名称进行查询",
                    })}
                >
                    {
                        projectList.map(item => {
                            return <Option key={item.id} value={item.id} title={item.name}>{item.name}</Option>;
                        })
                    }
                </Select>
            ),
        },
        {
            components: (

                <Select
                    id="developStatus"
                    key="developStatus"
                    allowClear
                    name='开发状态'

                    style={{ width: "100px" }}
                    placeholder={intl.formatMessage({
                        id: "pages.applyDevelop.searchInputDevelopmentState",
                        defaultValue: "选择开发状态进行查询",
                    })}
                >
                    {
                        APP_DEVELOP_STATUS.map(item => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                        })
                    }
                </Select>
            ),
        },
        {
            components: (
                <Input
                    id="name"
                    key="name"
                    allowClear
                    name='应用名称'
                    suffix={<Icon type="search" />
                    }
                    placeholder={intl.formatMessage({
                        id: "pages.applyDevelop.searchInputAppName",
                        defaultValue: "输入应用名称进行查询",
                    })}
                />
            ),
        },
        {
            components: (
                <Select id="tags"
                    key="tags"
                    allowClear
                    maxTagCount={4}
                    onChange={(arr) => {
                        if (arr.length > 10) {
                            arr.pop();
                            message.error('最多只能选择十条标签！');
                        }

                    }}
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    name='应用标签' style={{ width: 200 }}
                    mode="multiple"
                    placeholder={intl.formatMessage({
                        id: "pages.applyDevelop.searchInputApplyLabel",
                        defaultValue: "选择应用标签进行查询",
                    })}
                >
                    {
                        tagList.map(item => {
                            return <Option key={item.id} value={item.id}>{item.name}</Option>;
                        })
                    }
                </Select>
            ),
        },
    ];
    const searchTypeContent = [
        {
            components: (
                <Select
                    id="type"
                    key="type"
                    name='应用类型选择'
                    style={{ width: "200px" }}
                    placeholder={intl.formatMessage({
                        id: "pages.applyDevelop.searchInputPlaceholder",
                        defaultValue: "选择应用类型进行查询",
                    })}
                >
                    <Option value="2D" >2D大屏应用</Option>
                    <Option value="3D">3D大屏应用</Option>
                </Select>
            ),
            formAttribute: { initialValue: key || '2D' }
        },

    ];
    // 请求列表数据
    useEffect(() => {
        if (props.location.state) {
            let paramsType = props.location.state.type;
            if (paramsType) {
                setType(paramsType);
                clearApplication();
            }
        }

        setSearchParams();
        getProjectList();
        getApplicationList();
        getTagsList();

    }, []);
    const onSearchType = (params) => {
        if (params['type']) {
            setType(params.type);
        }
        getApplicationList({
            curPage: 0
        });
    };
    const onSearch = (params) => {
        for (const i in params) {
            if (!params[i] || params[i].length === 0) {
                delete params[i];
            }
        }
        setSearchParams(params);
        getApplicationList({
            curPage: 0,
        });
    };
    const extra = () => {
        return [
            <Button
                type="primary"
                key="create_project"
                onClick={() => {
                    openAddProjectModal({ tags: [] });
                    setCheckFlag(0);
                    setActiveCard();

                }}
            >
                <FormattedMessage
                    id="pages.applyDevelop.create"
                    defaultValue="添加应用"
                />
            </Button>,
            <Button
                key="reset_project"
                onClick={() => {
                    getApplicationListDelete({ status: 'invalid' });
                    openDeleteApplyListModal();
                }}
            >
                <FormattedMessage
                    id="pages.applyDevelop.reset"
                    defaultValue="还原应用"
                />
            </Button>,
        ];
    };
    return (
        <div className={styles.container}>
            <SearchBar
                onSearch={onSearchType}
                searchContent={searchTypeContent} showSearchCount={6} extra={extra}
            />
            <SearchBar
                onSearch={onSearch}
                className={styles.search}
                searchContent={searchContent} showSearchCount={6}
            />
            {
                <div style={{ minHeight: 'calc(100vh - 292px)' }}>
                    <TsetCard value={applicationList}
                        downLoadArr={downLoadArr}
                        setActiveCard={setActiveCard}
                        state={0} showStateTag={true}
                        actions={(item) => {
                            return (
                                <>
                                    <Tooltip key="edit" title="编辑">
                                        <a
                                            title="编辑"
                                            target="_blank"
                                            onClick={() => {
                                                setCheckFlag(1), openAddProjectModal();
                                            }}
                                        >
                                            <Icon type="edit" style={{ color: "#333" }} />
                                        </a>
                                    </Tooltip>
                                    <Tooltip key="delete" title="删除">
                                        <Popconfirm
                                            title="确认删除？"
                                            okText="确认"
                                            cancelText="取消"
                                            onConfirm={() => {
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
                                                            res.msg ||
                                                            intl.formatMessage({
                                                                id: "common.deleteError",
                                                                defaultValue: "删除失败，请稍后重试！",
                                                            })
                                                        );
                                                    }
                                                });
                                            }}
                                        >
                                            <a title="删除">
                                                <Icon type="delete" style={{ color: "#333" }} />
                                            </a>
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
                                        <a
                                            title="复制"
                                            onClick={() => {
                                                setCheckFlag(2);
                                                openAddProjectModal();
                                            }}
                                        >
                                            <Icon type="copy" style={{ color: "#333" }} />
                                        </a>
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
                    >
                    </TsetCard>
                </div>
            }
            <Pagination
                hideOnSinglePage={true}
                total={total}
                showSizeChanger={true}
                showTotal={(total) => {
                    return `共${total}条记录`;
                }}
                pageSizeOptions={['15', '45', '75', '150']}
                current={curPage + 1}
                pageSize={pageSize}
                onChange={(current) => {
                    setCurPage(current - 1);
                    getApplicationList();
                }}
                onShowSizeChange={
                    (page, pageSize) => {
                        setCurPage(0);
                        setPageSize(pageSize);
                        getApplicationList();
                    }
                }
            />
            {isAddModalVisible && (
                <AppProjectModal
                    addOrChangeFlag={checkFlag}
                    project={activeCard}
                    tagList={tagList}
                    type={key}
                    addNewTag={addNewTag}
                    projectList={projectList}
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
                                getApplicationList({
                                    curPage: 0,
                                });
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
                    onCancel={closeAppProjectModal}
                />
            )}
            {
                isDeleteApplyListModalVisible && (
                    <DeleteApplyListModal
                        total={totalDelete}
                        curPage={deleteCurPage}
                        project
                        onChange={(id, params) => {
                            changeApplicationOne(id, params, (res) => {
                                if (res.code === successCode) {
                                    message.success(
                                        intl.formatMessage({
                                            id: "common.reductionSuccess",
                                            defaultValue: "还原成功！",
                                        })
                                    );
                                    getApplicationListDelete({ status: 'invalid' });
                                    getApplicationList({
                                        curPage: 0,
                                    });
                                } else {
                                    message.error(
                                        res.msg || intl.formatMessage({
                                            id: "common.reductionError",
                                            defaultValue: "还原失败，请稍后重试！",
                                        })
                                    );
                                }
                            });
                        }}
                        deleteApplyList={applicationListDelete.list}
                        getDeleteApplyList={getApplicationListDelete}
                        onCancel={closeDeleteApplyListModal}
                    />
                )
            }

        </div>
    );
});
export default ApplyDevelop;
