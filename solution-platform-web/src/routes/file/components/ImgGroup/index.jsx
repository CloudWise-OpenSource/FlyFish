/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { Button, Input, Row, Col, Divider, Icon } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';
import Create from './create';

import { getImgGroupListAction, addImgGroupAction, delImgGroupAction, updateImgGroupAction } from '../../action/imgGroup';

@T.decorator.contextTypes('store')
export default class ImgGroupIndex extends PureComponent {
    constructor() {
        super();
        this.state = {
            allImgGroupLoading: false,
            modalVisible: false,
            saving: false,
            isCreate: true,
            id: null,    // 更新的分组的id
            oldName: '',   // 更新的分组的name
        };
    }

    componentDidMount() {
        const { dispatch } = this.context.store;
        dispatch(getImgGroupListAction());
    }

    // 获取图片分组列表
    getImgGroupList(page = 1, is_all = false, name) {
        this.context.store.dispatch(getImgGroupListAction(page, is_all, name));
    }

    render() {
        const { loading, imgGroupList } = this.props.imgReducer;
        const { dispatch } = this.context.store;
        const { modalVisible, isCreate, saving, allImgGroupLoading, id, oldName } = this.state;
        const { count, pageSize, currentPage, data } = imgGroupList;

        const columns = [
            {
                title: '分组名称',
                dataIndex: 'name',
            },
            {
                title: '分组标识符',
                dataIndex: 'flag',
            },
            {
                title: '操作',
                dataIndex: 'todos',
                render: (text, record) => (
                    <span>
                        <a onClick={() => {
                            T.prompt.confirm(() => {
                                dispatch(delImgGroupAction(record.id));
                            }, { title: '确定删除？' });
                        }}>删除</a>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            this.setState({ modalVisible: true, isCreate: false, id: record.id, oldName: record.name });
                        }}>更新</a>
                    </span>
                ),
            },
        ];

        return (
            <div>
                <MainHeader title="图片分组管理" rightRender={<Button type="primary" onClick={() => {
                    this.setState({ modalVisible: true, isCreate: true, oldName: '' });
                }}>创建分组</Button>}
                />

                <MainContent>
                    <BoxContent loading={allImgGroupLoading}>
                        <Filter doSearch={(search) => this.getImgGroupList(1, false, search.keyword)} />

                        <Table
                            dataSource={data}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: count,
                                onChange: (page) => this.getImgGroupList(page)
                            }}
                            loading={loading}
                            rowKey={(record) => record.operate_log_id}
                        />
                    </BoxContent>
                </MainContent>
                <Create isCreate={isCreate} oldName={oldName} visible={modalVisible} saving={saving} onCancel={() => {
                    this.setState({ modalVisible: false });
                }} onCreate={(name, flag) => {
                    if (isCreate) {
                        dispatch(addImgGroupAction(name, flag, () => {
                            this.setState({ modalVisible: false });
                        }));
                    } else {
                        dispatch(updateImgGroupAction(id, name, () => {
                            this.setState({ modalVisible: false });
                        }));
                    }
                }}
                />
            </div>
        );
    }
}

@T.decorator.propTypes({
    doSearch: PropTypes.func.isRequired
})
class Filter extends PureComponent {
    constructor() {
        super();
        this.state = {
            keyword: null,
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        doSearch(this.state);
    }

    render() {
        return (
            <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={2} ><span>关键字：</span></Col>
                <Col span={4}>
                    <Input
                        value={this.state.keyword}
                        onChange={(e) => this.setState({ keyword: e.target.value.trim() })}
                        onBlur={() => this.doSearch()}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
                <Col span={2}><Button type="primary" onClick={() => this.doSearch()}>确定</Button></Col>
            </Row>
        );
    }
}
