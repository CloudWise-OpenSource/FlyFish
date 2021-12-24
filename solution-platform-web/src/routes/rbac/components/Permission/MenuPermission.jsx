/**
 * Created by chencheng on 17-8-31.
 */
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import SetMenuPermissionModal from './SetMenuPermissionModal';

import { PureComponent } from 'react';
import { Button, Row, Col, Select } from 'antd';

import { EnumPermissionSubjectType } from 'constants/app/rbac/permission';
import { EnumRoleType } from 'constants/app/rbac/role';
import { doGetPermissionTargetList } from '../../action/permission';

/**
 * 获取权限主体id
 * @param subject_type
 * @param item
 * @return {*}
 */
const getSubjectId = (subject_type, item) => {
    switch (subject_type) {
        case EnumPermissionSubjectType.user.value:
            return item.user_id;
        case EnumPermissionSubjectType.role.value:
            return item.role_id;
        case EnumPermissionSubjectType.group.value:
            return item.group_id;
    }
};

const getTargetTypeToColumnsMap = (subject_type) => {

    const getOperateRender = (text, record) => (
        <Button
            type="primary"
            icon="edit"
            onClick={() => T.helper.renderModal(<SetMenuPermissionModal subject_type={subject_type} subject_id={getSubjectId(subject_type, record)} />)}
        >修改权限</Button>
    );

    const EnumColumns = {
        [EnumPermissionSubjectType.user.value]: [
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
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text) => T.helper.dateFormat(text)
            },
            {
                title: '操作',
                render: getOperateRender
            }
        ],
        [EnumPermissionSubjectType.role.value]: [
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
                render: getOperateRender
            }
        ],
        [EnumPermissionSubjectType.group.value]: [
            {
                title: '分组名',
                dataIndex: 'group_name',
            },
            {
                title: '描述',
                dataIndex: 'description',
            },
            {
                title: '操作',
                render: getOperateRender
            }
        ],
    };

    return EnumColumns[subject_type];
};

/**
 * 列表数据
 * @type {{count: number, pageSize: number, currentPage: number, data: Array}}
 */
const EnumStateList =  {
    count: 0,
    pageSize: 1,
    currentPage: 1,
    data: []
};

export default class MenuPermission extends PureComponent {

    state = {
        subject_type: EnumPermissionSubjectType.role.value,      // 目标类型
        loading: false,
        userList: [],     // 列表数据
        roleList: [],
        groupList: [],
    };

    componentDidMount() {
        this.getTargetList();
    }

    /**
     * 获取权限目标主体列表
     */
    getTargetList() {
        const { subject_type } = this.state;

        this.setState({ loading: true }, () => {
            doGetPermissionTargetList(subject_type).then((resp) => {
                this.setState({
                    loading: false,
                    userList: subject_type == EnumPermissionSubjectType.user.value ? resp.data : [],
                    roleList: subject_type == EnumPermissionSubjectType.role.value ? resp.data : [],
                    groupList: subject_type == EnumPermissionSubjectType.group.value ? resp.data : [],

                });
            }, (resp) => {
                T.prompt.error(resp.msg);
                this.setState({ loading: false });
            });
        });

    }

    render() {
        const { subject_type, loading, userList, roleList, groupList } = this.state;
        const columns = getTargetTypeToColumnsMap(subject_type);

        let dataSource = [];
        if (subject_type == EnumPermissionSubjectType.role.value) {
            roleList.forEach(item => {
                // 过滤管理员
                if (item.role_type != EnumRoleType.admin.value) {
                    dataSource.push(item);
                }
            });
        }

        return (
            <div>
                <Row gutter={0} type="flex" align="middle" style={{ marginBottom: 5 }}>
                    <Col span={1}><span>对象类型：</span></Col>
                    <Col span={4}>
                        <Select
                            onChange={(subject_type) => this.setState({ subject_type, list: EnumStateList }, () => this.getTargetList())}
                            value={subject_type}
                            style={{ width: '100%' }}
                        >
                            {Object.values(EnumPermissionSubjectType).map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                        </Select>
                    </Col>
                </Row>
                {
                    (() => {
                        switch (subject_type) {
                            case EnumPermissionSubjectType.user.value:
                                return (
                                    <Table
                                        columns={columns}
                                        dataSource={userList}
                                        loading={loading}
                                        rowKey={(record) => record.user_id}
                                    />
                                );
                            case EnumPermissionSubjectType.role.value:
                                return (
                                    <Table
                                        columns={columns}
                                        dataSource={dataSource}
                                        loading={loading}
                                        rowKey={(record) => record.role_id}
                                    />
                                );

                            case EnumPermissionSubjectType.group.value:
                                return (
                                    <Table
                                        columns={columns}
                                        dataSource={groupList[0] ? groupList[0].children : []}
                                        loading={loading}
                                        rowKey={(record) => record.group_id}
                                    />
                                );

                        }
                    })()
                }
            </div>
        );
    }
}
