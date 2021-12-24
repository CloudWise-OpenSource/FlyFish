/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import CreateUserModal from './CreateUserModal';
import ResetPasswordModal from './ResetPasswordModal';

import { Component } from 'react';
import { Button, Select, Input, Row, Col } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { EnumUserStatusType } from 'constants/app/user';
import { getUserPageListAction, doDelUser, delUserAction } from '../../action/user';

/**
 * 用户类型对应的枚举信息
 */
const EnumUserStatusTypeToInfoMap = (() => {
    let typeToInfoMap = {};
    Object.values(EnumUserStatusType).forEach(item => typeToInfoMap[item.value] = item);
    return typeToInfoMap;
})();

@T.decorator.contextTypes('store')
export default class UserList extends Component {
    constructor(props) {
        super(props);
        this.search = {};
    }
    componentDidMount() {
        this.getUserList();
    }

    // 获取用户列表
    getUserList(page = 1, type = EnumUserStatusType.all.value, search = {}) {
        this.search = Object.assign({}, this.search, search || {});
        this.context.store.dispatch(getUserPageListAction(page, type, search));
    }

    /**
     * 添加或修改用户
     * @param user_id
     */
    addOrUpdateUser(user_id = false){
        T.helper.renderModal(<CreateUserModal user_id={user_id} getUserList={() => this.getUserList()}/>)
    }

     /**
     * 删除用户
     * @param {Array}user_ids
     */
      delUser(user_id) {
        // user_ids = !Array.isArray(user_ids) ? [user_ids] : user_ids;
        T.prompt.confirm(() => {
            return doDelUser(user_id).then(() => {
                this.context.store.dispatch(delUserAction(user_id));
                T.prompt.success('删除成功');
                 //重新刷下页面
                 this.handerRefresh()
            }, (resp) => {
                T.prompt.error(resp.msg); 
            });
        }, { title: '确定删除？' });
    }
    handerRefresh () {
        const { userList } = this.props.userListReducer;
        const { currentPage, data } = userList;
        console.log(data)
        const page = data.length === 1 && currentPage > 1 ? currentPage-1 : currentPage
        this.getUserList(page, this.search.type, this.search)
    }


    render() {
        const { loading, userList } = this.props.userListReducer;
        const { count, pageSize, currentPage, data } = userList;
        const { isAdmin } = T.auth.getLoginInfo() || {}
        const columns = [
            {
                title: '用户名',
                dataIndex: 'user_name',
            },
            {
                title: '邮箱',
                dataIndex: 'user_email',
            },
            {
                title: '手机号',
                dataIndex: 'user_phone',
            },
            {
                title: '状态',
                dataIndex: 'user_status',
                render: (text) => <span>{EnumUserStatusTypeToInfoMap[text].label}</span>
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text) => T.helper.dateFormat(text)
            },
            {
                title: '操作',
                render: (text, record) => [
                    <Button key={1} type="primary" icon="eye-o" onClick={() => T.helper.renderModal(<ResetPasswordModal user_id={record.user_id} />)}>重置密码</Button>,
                    <Button key={2} type="primary" icon="edit"  onClick={() => this.addOrUpdateUser(record.user_id)} style={{ marginLeft: 5 }}>修改</Button>,
                    isAdmin ? <Button key={3} type="danger" icon="delete" onClick={() => this.delUser(record.user_id)} style={{ marginLeft: 5 }}>删除</Button> : null
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="用户" rightRender={<Button type="primary" icon="plus" onClick={() => this.addOrUpdateUser()}>添加用户</Button> } />

                <MainContent>
                    <Filter doSearch={(search) => this.getUserList(1, search.type, search)} />

                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getUserList(page)
                        }}
                        loading={loading}
                        rowKey={(record) => record.user_id}
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
            user_status: EnumUserStatusType.all.value,
            user_email: null,
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        const cloneState = T.lodash.clone(this.state);
        if (T.lodash.isEmpty(cloneState.user_email)) delete cloneState.user_email;

        doSearch(cloneState);
    }

    render() {
        return (
            <Row gutter={10} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={1}><span>状态：</span></Col>
                <Col span={3}>
                    <Select style={{ width: '100%' }} value={this.state.user_status.toString()} onChange={(user_status) => this.setState({ user_status }, () => this.doSearch())}>
                        {
                            Object.values(EnumUserStatusType).map(item => <Select.Option key={item.value} value={item.value.toString()}>{item.label}</Select.Option>)
                        }
                    </Select>
                </Col>
                <Col span={1} ><span>邮箱：</span></Col>
                <Col span={3}>
                    <Input
                        value={this.state.user_email}
                        onChange={(e) => this.setState({ user_email: e.target.value.trim() })}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
                <Col span={2}><Button type="primary" onClick={() => this.doSearch()}>搜索</Button></Col>
            </Row>
        );
    }
}
