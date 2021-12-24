/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import OrgModalCreate from './OrgModalCreate';

import { Component } from 'react';
import { Button, Input, Row, Col } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { getOrgPageListAction, doDelOrg, delOrgAction } from '../../action/organize';


@T.decorator.contextTypes('store','router')
export default class OrgList extends Component {

    constructor(props) {
        super(props);
        this.search = {};
    }

    componentDidMount() {
        this.getOrgList();
    }

    // 获取组织列表
    getOrgList(page = 1, search = {}) {
        this.search = Object.assign({}, this.search, search || {});
        this.context.store.dispatch(getOrgPageListAction(page, this.search));
    }

    /**
     * 删除组织
     * @param {Array | number}org_ids
     */
    delOrg(org_ids) {
        org_ids = !Array.isArray(org_ids) ? [org_ids] : org_ids;

        T.prompt.confirm(() => {

            return doDelOrg(org_ids).then(() => {
                this.context.store.dispatch(delOrgAction(org_ids));
                T.prompt.success('删除成功');
            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        }, { title: '确定删除？' });
    }


    render() {
        const { loading, orgList } = this.props.orgListReducer;
        const { count, pageSize, currentPage, data } = orgList;
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '组织标识',
                dataIndex: 'org_mark',
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text) => T.helper.dateFormat(text)
            },
            {
                title: '操作',
                render: (text, record) => [
                    <Button
                        key={1}
                        type="primary"
                        icon="edit"
                        onClick={() => T.helper.renderModal(<OrgModalCreate org_id={record.org_id} getOrgListCb={this.getOrgList.bind(this)} />)}
                    >修改</Button>
                    // ,
                    // <Button key={2} type="danger" icon="delete" onClick={() => {
                    //     this.delOrg(record.org_id);
                    // }} style={{ marginLeft: 5 }}>删除</Button>
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="组织列表" rightRender={
                    <Button
                        type="primary"
                        icon="plus"
						onClick={() => T.helper.renderModal(<OrgModalCreate org_id={false} getOrgListCb={this.getOrgList.bind(this)} />)}
                    >添加组织</Button>
                } />

                <MainContent>
                    <Filter doSearch={(search) => {
                        this.search = search;
                        this.getOrgList(1, search);
                    }} />

                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getOrgList(page)
                        }}
                        loading={loading}
                        rowKey={(record) => record.org_id}
                    />
                </MainContent>
            </div>
        );
    }
}

/**
 * 筛选组件
 */
@T.decorator.propTypes({
    doSearch: PropTypes.func.isRequired
})
class Filter extends Component {
    constructor() {
        super();
        this.state = {
            name: null,
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        const cloneState = T.lodash.clone(this.state);
        if (T.lodash.isEmpty(cloneState.name)) delete cloneState.name;

        doSearch(cloneState);
    }

    render() {
        return (
            <Row gutter={10} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={1}><span>名称：</span></Col>
                <Col span={3}>
                    <Input
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value.trim() })}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
                <Col span={2}><Button type="primary" onClick={() => this.doSearch()}>搜索</Button></Col>
            </Row>
        );
    }
}

