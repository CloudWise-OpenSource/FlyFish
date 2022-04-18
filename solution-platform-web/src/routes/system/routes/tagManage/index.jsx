import React, { Fragment, Component } from 'react';
import { Table, Alert, Button, Row, Col, Pagination, Tag, Divider, Modal, Spin, message, Icon, Tooltip, Input } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';
import AddTagModal from '../../components/AddTagModal';

import classnames from 'classnames';

import styles from './index.scss';

import { getTagList, addTag, editTag, deleteTag } from '../../webAPI/componentTag';

import { EnumDefaultTagId } from 'constants/app/system/tagManage';
const mainTagTip = '默认标签不可删除！';
const tipTitle = '提示信息';
const tipMessage =
    '针对大屏和组件进行分类管理, 注意标签的删除并不会影响目前现有大屏的行为！';
const defaultPaginationSetting = {
    total: 0,
    current: 0,
    pageSize: 10,
};
class TagManage extends Component {
    state = {
        addTagModalVisible: false, // 是否展示新增弹窗
        loading: false, // 是否在加载数据
        selectedRowKeys: [], // 当前选中行
        edit: false, // 是否为编辑模式
        operating: false, // 是否操作中
        currentEditTag: {}, // 当前编辑标签
        tagList: [], // 当前标签列表
        page: defaultPaginationSetting, // 翻页器配置
        searchTagWord: '', // 搜索关键字
    };

    componentDidMount() {
        this.fetchTagList();
    }

    dataColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            width: 80,
        },
        {
            title: '标签名称',
            dataIndex: 'name',
            width: 300,
            ellipsis: true,
            key: 'name',
            render: (text, { id }) => {
                const isDefault = id === EnumDefaultTagId;
                return (
                    <Fragment>
                        <Tag color={isDefault ? 'blue' : 'green'}>{text}</Tag>
                        {
                            isDefault
                                ?
                                // 解释一下: Icon鼠标事件异常导致tooltip表现异常，套一层span解决
                                <Tooltip text title={mainTagTip}>
                                    <span><Icon type="question-circle" /></span>
                                </Tooltip>
                                :
                                null
                        }
                    </Fragment>
                );
            }
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: 'id',
            width: 220,
            render: (id, record) => {
                const { operating } = this.state;
                const onEdit = () => {
                    this.setState({
                        currentEditTag: record
                    });
                    this.changeAddTagModalVisible();
                };
                const isDefault = id === EnumDefaultTagId;
                return (
                    <Fragment>
                        <Button
                            ghost
                            type="primary"
                            onClick={onEdit}
                            loading={operating}
                            disabled={isDefault}
                        >
                            编辑
                        </Button>
                        <Divider type="vertical" />
                        <Button
                            ghost
                            type="danger"
                            onClick={() => this.deleteTag(id)}
                            loading={operating}
                            disabled={isDefault}
                        >
                            删除
                        </Button>
                    </Fragment>
                );
            },
        },
    ];

    /**
     * @description 获取标签列表
     * @param {number} page 请求页码
     */
    fetchTagList = (page) => {
        this.toggleLoadDataLoading();
        const { page: cachePage, searchTagWord } = this.state;
        getTagList({ page: page || cachePage.current || cachePage.current + 1, search: searchTagWord, status: 1 }).then(({ code, data }) => {
            if (code) return;
            const { count = 0, currentPage = 1, pageSize = 10, data: list = [] } = data;
            this.setState({
                page: {
                    total: count,
                    current: currentPage,
                    pageSize
                },
                tagList: list.map((v, index) => ({ ...v, index: (currentPage - 1) * 10 + 1 + index }))
            });
        }).finally(() => {
            this.toggleLoadDataLoading();
        });
    }

    /**
     * @description 变更当前选择项
     * @param {array} selectedRowKeys 当前选中table行
     */
    tableSelectionChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    }

    /**
     * @description 更改新增标签弹窗状态
     */
    changeAddTagModalVisible = () => {
        this.setState({
            addTagModalVisible: !this.state.addTagModalVisible,
        });
    };

    /**
     * @description 删除标签
     * @param {number|array} idOrList 当前删除id或id list
     */
    deleteTag = (idOrList) => {
        const { operating, selectedRowKeys, tagList, page } = this.state;
        Modal.confirm({
            title: '提示',
            content: '您是否确认删除当前选中标签?',
            okText: '确认删除',
            cancelText: '我再想想',
            okButtonProps: { loading: operating },
            cancelButtonProps: { loading: operating },
            onOk: () => {
                this.toggleOperateStatus();
                const idList = [[idOrList]].flat(Infinity);
                const payload = {
                    id: idList
                };
                deleteTag(payload).then(({ code }) => {
                    if (code) return;
                    message.success('删除成功！');
                    // 更新一下当前的selectedKeys
                    this.tableSelectionChange(selectedRowKeys.filter(v => !idList.includes(v)));
                    let requestPage = page.current;
                    // 删除的时候判断一下是不是将这页清空了
                    if (tagList.length === idList.length && page.current > 1) {
                        // 这里处理一下当前页码
                        requestPage -= 1;
                    }
                    this.fetchTagList(requestPage);
                }).finally(() => {
                    this.toggleOperateStatus();
                }).catch(e => {
                    message.error('删除失败!');
                });
            }
        });
    }

    /**
     * @description 新建或编辑标签
     * @param {object} values 新建或编辑标签内容
     */
    addOrEditTag = (values) => {
        const { currentEditTag } = this.state;
        this.toggleOperateStatus();
        let handler = addTag;
        let edit = false;
        if (currentEditTag.id) {
            handler = editTag;
            values = {
                ...currentEditTag,
                ...values
            };
            edit = true;
        }
        handler(values).then(({ code }) => {
            if (code) return;
            this.fetchTagList();
            message.success(`${edit ? '编辑' : '新建'}成功`);
            this.changeAddTagModalVisible();
        }).finally(() => {
            this.toggleOperateStatus();
        }).catch(e => {
            message.error(`${edit ? '编辑' : '新建'}失败`);
        });
    }

    /**
     * @description 更改操作状态
     */
    toggleOperateStatus = () => {
        this.setState({
            operating: !this.state.operating
        });
    }

    /**
     * @description 更改拉取数据状态
     */
    toggleLoadDataLoading = () => {
        this.setState({
            loading: !this.state.loading
        });
    }

    /**
     * @description 取消或关闭弹窗
     */
    onCancel = () => {
        this.setState({ currentEditTag: {} });
        this.changeAddTagModalVisible();
    }

    /**
     * @description 计算当前表格滚动区域高度
     * @returns {object}
     */
    computedTableScrollY = () => {
        const { clientHeight = 0 } = document.body;
        return {
            y: (clientHeight / 10) * 6.5 - 71,
        };
    };

    /**
     * @description 搜索标签
     */
    handleSearch = (value) => {
        this.setState({
            searchTagWord: value
        }, () => {
            this.fetchTagList(1);
        });
    }

    render() {
        const { loading, selectedRowKeys, addTagModalVisible, edit, operating, currentEditTag, tagList, page } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys) => this.tableSelectionChange(selectedRowKeys),
            getCheckboxProps: ({ id }) => ({ disabled: id === EnumDefaultTagId }),
        };

        return (
            <Spin spinning={operating} tip="正在执行操作中...">
                <MainHeader title="标签管理" />
                <MainContent className={styles.wrapper}>
                    <Alert
                        className={styles.gap}
                        showIcon
                        message={tipTitle}
                        description={tipMessage}
                        type="info"
                    />
                    <Row type="flex" justify="space-between" className={styles.gap}>
                        <Col span={16}>
                            <Input.Search
                                enterButton="搜索标签"
                                placeholder="请输入标签关键字或完整标签名"
                                onSearch={this.handleSearch}
                            />
                        </Col>
                        <Col span={5}>
                            <Row type="flex" justify="space-between">
                                <Col>
                                    <Button
                                        ghost
                                        type="primary"
                                        onClick={this.changeAddTagModalVisible}
                                        icon="plus"
                                        loading={operating}
                                    >
                                        新建标签
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        ghost
                                        type="danger"
                                        onClick={() => this.deleteTag(selectedRowKeys)}
                                        icon="delete"
                                        disabled={!selectedRowKeys.length}
                                        loading={operating}
                                    >
                                        批量删除
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Table
                        columns={this.dataColumns}
                        rowSelection={rowSelection}
                        loading={loading}
                        rowKey="id"
                        className={classnames(styles.table, styles.gap)}
                        dataSource={tagList}
                        scroll={this.computedTableScrollY()}
                        pagination={false}
                    />
                    <Pagination
                        simple
                        defaultCurrent={1}
                        onChange={this.fetchTagList}
                        {...page}
                    />
                    <AddTagModal
                        visible={addTagModalVisible}
                        edit={edit}
                        initialValue={currentEditTag}
                        onSubmit={this.addOrEditTag}
                        onCancel={this.onCancel}
                        loading={operating}
                    />
                </MainContent>
            </Spin>
        );
    }
}

export default TagManage;
