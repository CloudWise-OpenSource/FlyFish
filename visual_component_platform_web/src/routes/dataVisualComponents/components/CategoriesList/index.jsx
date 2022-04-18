/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import CategoriesModalCreate from './CategoriesModalCreate';

import { Component } from 'react';
import { Button, Select, Input, Row, Col } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { getCategoriesPageListAction, doDelCategories, delCategoriesAction } from '../../action/categories';

@T.decorator.contextTypes('store')
export default class CategoriesList extends Component {
    constructor(props) {
        super(props);
        this.search = {};
    }

    componentDidMount() {
        this.getCategoriesList();
    }

    // 获取数据存储列表
    getCategoriesList(page = 1, type = 0, search = {}) {
        this.search = Object.assign({}, this.search, search || {});
        this.context.store.dispatch(getCategoriesPageListAction(page, type, this.search));
    }

    /**
     * 删除数据存储
     * @param {Array | number}categories_ids
     */
    delCategories(categories_ids) {
        categories_ids = !Array.isArray(categories_ids) ? [categories_ids] : categories_ids;

        T.prompt.confirm(() => {

            return doDelCategories(categories_ids).then(() => {
                this.context.store.dispatch(delCategoriesAction(categories_ids));
                T.prompt.success('删除成功');
                this.handerRefresh()
            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        }, { title: '确定删除？' });
    }
    handerRefresh () {
        const { categoriesList } = this.props.categoriesListReducer;
        const { currentPage, data } = categoriesList;
        const page = data.length === 1 && currentPage > 1 ? currentPage-1 : currentPage
        this.getCategoriesList(page, this.search.type, this.search)
    }

    render() {
        const { loading, categoriesList } = this.props.categoriesListReducer;
        const { count, pageSize, currentPage, data } = categoriesList;
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '类型',
                dataIndex: 'type',
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
                        onClick={() => T.helper.renderModal(<CategoriesModalCreate categories_id={record.categories_id} getCategoriesListCb={this.getCategoriesList.bind(this)} />)}
                    >修改</Button>
                    ,
                    <Button key={2} type="danger" icon="delete" onClick={() => {
                        this.delCategories(record.categories_id);
                    }} style={{ marginLeft: 5 }}>删除</Button>
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="组件分类" rightRender={
                    <Button
                        type="primary"
                        icon="plus"
						onClick={() => T.helper.renderModal(<CategoriesModalCreate categories_id={false} getCategoriesListCb={this.getCategoriesList.bind(this)} />)}
                    >添加分类</Button>
                } />

                <MainContent>
                    <Filter doSearch={(search) => {
                        this.search = search;
                        this.getCategoriesList(1, search.type, search);
                    }} />

                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getCategoriesList(page)
                        }}
                        loading={loading}
                        rowKey={(record) => record.categories_id}
                    />
                </MainContent>
            </div>
        );
    }
}

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
