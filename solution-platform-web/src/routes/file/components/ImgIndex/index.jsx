/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { Button, Input, Select, Row, Col, Divider } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';
import UploadImg from './uploadImg';

import { getImgListAction, addImgAction, delImgAction, updateImgAction } from '../../action/img';
import { EnumAllType } from 'constants/app/EnumCommon';

@T.decorator.contextTypes('store')
export default class ImgIndex extends PureComponent {
    constructor() {
        super();
        this.state = {
            allImgLoading: false,
            modalVisible: false,
            saving: false,
            isUpload: false,
            oldName: '',
            oldDesc: '',
            oldExtendDesc: '',
            id: null
        };
    }
    componentDidMount() {
        this.context.store.dispatch(getImgListAction());
    }

    // 获取操作日志列表
    getImgList(page = 1, is_all = false, name) {
        this.context.store.dispatch(getImgListAction(page, is_all, name));
    }

    render() {
        const { loading, imgList, imgGroupList_ } = this.props.imgReducer;
        const { modalVisible, isUpload, saving, oldName, oldDesc, oldExtendDesc, id } = this.state;
        const { count, pageSize, currentPage, data } = imgList;
        const { dispatch } = this.context.store;

        const columns = [
            {
                title: '图片名称',
                dataIndex: 'name',
            },
            {
                title: '图片备注',
                dataIndex: 'desc',
            },
            {
                title: '分组名称',
                dataIndex: 'groupName',
            },
            {
                title: '生成url地址',
                dataIndex: 'url',
            },
            {
                title: '操作',
                dataIndex: 'todos',
                render: (text, record) => (
                    <span>
                        <a onClick={() => {
                            T.prompt.confirm(() => {
                                dispatch(delImgAction(record.id));
                            }, { title: '确定删除？' });
                        }}>删除</a>
                        <Divider type="vertical" />
                        <a onClick={() => {
                            this.setState({ modalVisible: true, isUpload: false, id: record.id, oldName: record.name, oldDesc: record.desc, oldExtendDesc: record.extendDesc });
                        }}>更新</a>
                    </span>
                ),
            },
        ];

        return (
            <div>
                <MainHeader title="图片管理" rightRender={<Button type="primary" onClick={() => {
                    this.setState({ modalVisible: true, isUpload: true, id: null, oldDesc: '', oldExtendDesc: '', oldName: '' });
                }}>上传图片</Button>}
                />

                <MainContent>
                    <BoxContent loading={this.state.allImgLoading}>
                        <Filter doSearch={(search) => this.getImgList(1, false, search.keyword)} />

                        <Table
                            dataSource={data}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: count,
                                onChange: (page) => { this.getImgList(page) }
                            }}
                            loading={loading}
                            rowKey={(record) => record.operate_log_id}
                        />
                    </BoxContent>
                </MainContent>
                <UploadImg imgGroupList={imgGroupList_} oldName={oldName} oldDesc={oldDesc} oldExtendDesc={oldExtendDesc} isUpload={isUpload} visible={modalVisible} saving={saving} onCancel={() => {
                    this.setState({ modalVisible: false });
                }} onCreate={(file, name, desc, extendDesc, group_id) => {
                    if (isUpload) {
                        dispatch(addImgAction(file, name, desc, extendDesc, group_id, () => {
                            this.setState({ modalVisible: false });
                        }));
                    } else {
                        dispatch(updateImgAction(id, file, name, desc, extendDesc, group_id, () => {
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
