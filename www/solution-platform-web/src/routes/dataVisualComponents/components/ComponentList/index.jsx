/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter';
import BoxContent from 'templates/ToolComponents/BoxContent';
import Table from 'templates/ToolComponents/Table';
import ComponentModalCreate from './ComponentModalCreate';
import ComponentModalCopy from './ComponentModalCopy';
import ComponentModalImport from './ComponentModalImport';

import { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Row, Col } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { EnumAllType } from 'constants/app/EnumCommon';
import { getComponentPageListAction, doDelComponent, delComponentAction, doPutawayComponent, doDownloadComponentCode } from '../../action/component';

let SEARCH_PARAMS_STATE_CACHE = {};
let LOAD_COMPONENT_LIST_PAGENUM_CACHE = 1;
let LOAD_COMPONENT_LIST_PAGESIZE_CACHE = 15;
@T.decorator.contextTypes('store', 'router')
export default class ComponentList extends PureComponent {
    constructor(props) {
        super(props);
        this.search = SEARCH_PARAMS_STATE_CACHE || {};
    }

    state = {
        loading: false,
    }

    componentDidMount() {
        this.getComponentList(LOAD_COMPONENT_LIST_PAGENUM_CACHE, LOAD_COMPONENT_LIST_PAGESIZE_CACHE, this.search || {});
    }

    componentWillUnmount() {
        const { componentList } = this.props.componentListReducer;
        const { currentPage, pageSize } = componentList || {};
        SEARCH_PARAMS_STATE_CACHE = Object.assign({}, this.search || {});
        LOAD_COMPONENT_LIST_PAGENUM_CACHE = currentPage;
        LOAD_COMPONENT_LIST_PAGESIZE_CACHE = pageSize;
    }

    // 获取组件列表
    getComponentList(page = 1, pageSize = 15, search = {}) {
        this.search = Object.assign({}, this.search, search || {});
        this.context.store.dispatch(getComponentPageListAction(page, pageSize, this.search));
    }

    /**
     * 删除组件
     * @param {Array | number}component_ids
     */
    delComponent(component_ids) {
        component_ids = !Array.isArray(component_ids) ? [component_ids] : component_ids;
        T.prompt.confirm(() => {

            return doDelComponent(component_ids).then(() => {
                this.context.store.dispatch(delComponentAction(component_ids));
                T.prompt.success('删除成功');
                // 重新刷下页面
                const { componentList } = this.props.componentListReducer;
                const { pageSize, currentPage, data } = componentList;
                const page = data.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                this.getComponentList(page, pageSize, this.search);

            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        }, { title: '确定删除？' });
    }
    filterOrganize(search) {
        this.search = search;
        const { componentList } = this.props.componentListReducer;
        const { pageSize } = componentList;
        this.getComponentList(1, pageSize, search);
    }

    render() {
        const { loading, componentList } = this.props.componentListReducer;
        const { count, pageSize, currentPage, data } = componentList;

        const { user, isAdmin } = T.auth.getLoginInfo() || {};
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
            },
            {
                title: '组件标识',
                dataIndex: 'component_mark',
            },
            {
                title: '最后修改人',
                dataIndex: 'update_user_name',
            },
            {
                title: '创建人',
                dataIndex: 'create_user_name',
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
                        style={{ marginRight: 5, marginBottom: 5 }}
                        onClick={() => T.helper.renderModal(<ComponentModalCreate component_id={record.component_id} getComponentListCb={this.getComponentList.bind(this)} />)}
                    >修改</Button>,
                    <Link key={2} to={{ pathname: EnumRouter.v_component_create, search: '?component_id=' + record.component_id }}>
                        <Button
                            icon="code-o"
                            type="primary"
                            style={{ marginRight: 5, marginBottom: 5 }}
                        >开发组件</Button>
                    </Link>,
                    <Button
                        key={3}
                        type="primary"
                        icon="copy"
                        style={{ marginRight: 5, marginBottom: 5 }}
                        onClick={() => T.helper.renderModal(<ComponentModalCopy component_id={record.component_id} />)}
                    >复制</Button>,
                    <DownloadButton key={4} component_id={record.component_id} default_value={record.default_value} />,
                    <ImportCodeButton key={6} component_id={record.component_id} create_user_id={record.create_user_id} componentName={record.name} />, <DownloadCodeButton key={5} component_id={record.component_id} />,
                    <Button key={7}
                        type="danger"
                        icon="delete"
                        onClick={() => { this.delComponent(record.component_id) }}
                        style={{ marginRight: 5 }}
                        disabled={(!isAdmin && record.create_user_id && record.create_user_id !== user.user_id)}
                        >删除</Button>
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="组件列表" rightRender={
                    <Fragment>
                        <Button
                            type="primary"
                            icon="plus"
                            style={{ marginRight: 20 }}
                            onClick={() => T.helper.renderModal(<ComponentModalCreate component_id={false} getComponentListCb={this.getComponentList.bind(this)} />)}
                        >添加组件</Button>
                    </Fragment>
                }
                />

                <MainContent>
                    <BoxContent loading={this.state.loading}>
                        <Filter defaultSearch={this.search} doSearch={(search) => this.filterOrganize(search)} />

                        <Table
                            dataSource={data}
                            columns={columns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                pageSizeOptions: ['15', '30', '50', '100'],
                                total: count,
                                onChange: (page, pageSize) => {
                                    this.getComponentList(page, pageSize, this.search);
                                },
                                onShowSizeChange: (page, pageSize) => {
                                    this.getComponentList(1, pageSize, this.search);
                                },
                            }}
                            loading={loading}
                            rowKey={(record) => record.component_id}
                        />
                    </BoxContent>
                </MainContent>
            </div>
        );
    }
}

/**
 * 下载
 */
@T.decorator.propTypes({
    component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
})
class DownloadButton extends PureComponent {
    state = {
        loading: false
    }

    doPutaway(component_id, default_value) {
        if (default_value === 0) {
            T.prompt.error('该组件没有添加默认数据，请添加默认数据后再导出');
            return false;
        }
        this.setState({ loading: true }, () => {
            doPutawayComponent(component_id, 'on').then((resp) => {
                this.setState({ loading: false });
            }, (resp) => {
                T.prompt.error(resp.msg);
                this.setState({ loading: false });
            });
        });
    }

    render() {
        const { component_id, default_value } = this.props;

        return (
            <Button
                style={{ marginRight: 5, marginBottom: 5 }}
                type="primary"
                icon="cloud-download"
                loading={this.state.loading}
                onClick={() => this.doPutaway(component_id, default_value)}
            >上架组件</Button>
        );
    }
}

/**
 * 下载组件源代码
 */
@T.decorator.propTypes({
    component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
})
class DownloadCodeButton extends PureComponent {
    state = {
        loading: false
    }

    doDownload(component_id) {
        this.setState({ loading: true }, () => {
            doDownloadComponentCode(component_id).then((resp) => {
                this.setState({ loading: false });
            }, (resp) => {
                T.prompt.error(resp.msg);
                this.setState({ loading: false });
            });
        });
    }

    render() {
        const { component_id } = this.props;

        return (
            <Button
                style={{ marginRight: 5, marginBottom: 5 }}
                type="primary"
                icon="cloud-download"
                loading={this.state.loading}
                onClick={() => this.doDownload(component_id)}
            >导出源码</Button>
        );
    }
}

@T.decorator.propTypes({
    component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
})
class ImportCodeButton extends PureComponent {
    render() {
        const { component_id, create_user_id, componentName } = this.props;
        const { user, isAdmin } = T.auth.getLoginInfo() || {};
        return (
            <Button
                style={{ marginRight: 5, marginBottom: 5 }}
                type="primary"
                icon="cloud-upload"
                disabled={(!isAdmin && create_user_id && create_user_id !== user.user_id)}
                onClick={() => T.helper.renderModal(<ComponentModalImport component_id={component_id} componentName={componentName} />)}
            >导入源码</Button>
        );
    }
}

/**
 * 筛选组件
 */
@T.decorator.propTypes({
    doSearch: PropTypes.func.isRequired,
})
class Filter extends PureComponent {
    constructor(props) {
        super(props);
        this.state = props.defaultSearch || {
            name: null,
            org_id: EnumAllType
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        const cloneState = T.lodash.clone(this.state);
        if (T.lodash.isEmpty(cloneState.name)) delete cloneState.name;
        if (cloneState.org_id == EnumAllType) delete cloneState.org_id;

        doSearch(cloneState);
    }

    render() {
        return (
            <Row gutter={10} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={1}><span>名称：</span></Col>
                <Col span={4}>
                    <Input
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value.trim() })}
                        placeholder="请输入组件名称"
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
                <Col span={2}><Button type="primary" onClick={() => this.doSearch()}>搜索</Button></Col>
            </Row>
        );
    }
}

