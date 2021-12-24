/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import CreateRoleModal from './CreateRoleModal';
import ManageMemberModal from './ManageMemberModal';

import { PureComponent } from 'react';
import { Button, Input, Row, Col } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { getRolePageListAction, doDelRole, delRoleAction } from '../../action/role';
import { EnumRoleType } from 'constants/app/rbac/role';


@T.decorator.contextTypes('store')
export default class RoleList extends PureComponent {
    constructor(props) {
        super(props);
        this.search = {};
    }

    componentDidMount() {
        this.getRoleList();
    }

    // 获取角色列表
    getRoleList(page = 1, search = {}) {
        this.search = Object.assign({}, this.search, search || {});
        this.context.store.dispatch(getRolePageListAction(page, search));
    }

    /**
     * 添加或修改角色
     * @param role_id
     */
    addOrUpdateRole(role_id = false) {
        T.helper.renderModal(<CreateRoleModal role_id={role_id} getRoleList={() => this.getRoleList()} />);
    }

    /**
     * 删除角色
     * @param {Array}role_ids
     */
    delRole(role_ids) {
        role_ids = !Array.isArray(role_ids) ? [role_ids] : role_ids;

        T.prompt.confirm(() => {
            return doDelRole(role_ids).then(() => {
                this.context.store.dispatch(delRoleAction(role_ids));
                T.prompt.success('删除成功');
                this.handerRefresh()
            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        }, { title: '确定删除？' });
    }

    handerRefresh () {
        const { roleList } = this.props.roleListReducer;
        const { currentPage, data } = roleList;
        const page = data.length === 1 && currentPage > 1 ? currentPage-1 : currentPage
        this.getRoleList(page, this.search)
    }

    render() {
        const { loading, roleList } = this.props.roleListReducer;
        const { count, pageSize, currentPage, data } = roleList;

        const columns = [
            {
                title: '角色名',
                dataIndex: 'role_name',
            },
            {
                title: '描述',
                dataIndex: 'description',
            },
            {
                title: '操作',
                render: (text, record) => [
                    <Button key={1} type="primary" icon="user" onClick={() => T.helper.renderModal(<ManageMemberModal role_id={record.role_id} />)}>成员</Button>,
                    record.role_type == EnumRoleType.admin.value ? null : <Button key={2} type="primary" icon="edit" onClick={() => this.addOrUpdateRole(record.role_id)} style={{ marginLeft: 5 }}>修改</Button>,
                    record.role_type == EnumRoleType.admin.value ? null : <Button key={3} type="danger" icon="delete" onClick={() => this.delRole([record.role_id])} style={{ marginLeft: 5 }}>删除</Button>
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="角色列表" rightRender={<Button type="primary" icon="plus" onClick={() => this.addOrUpdateRole()}>添加角色</Button>} />

                <MainContent>
                    <Filter doSearch={(search) => this.getRoleList(1, search)} />

                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getRoleList(page)
                        }}
                        loading={loading}
                        rowKey={(record) => record.role_id}
                    />
                </MainContent>
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
            role_name: null,
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        const cloneState = T.lodash.clone(this.state);
        if (T.lodash.isEmpty(cloneState.role_name)) delete cloneState.role_name;

        doSearch(cloneState);
    }

    render() {
        return (
            <Row gutter={0} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={1}><span>名称：</span></Col>
                <Col span={4}>
                    <Input
                        value={this.state.role_name}
                        onChange={(e) => this.setState({ role_name: e.target.value.trim() })}
                        onBlur={() => this.doSearch()}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
            </Row>
        );
    }
}
