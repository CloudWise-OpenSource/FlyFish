/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';
import CreateGroupModal from './CreateGroupModal';
import ManageMemberModal from './ManageMemberModal';

import { PureComponent } from 'react';
import { Button, Input, Row, Col } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { getGroupPageListAction, doDelGroup, delGroupAction } from '../../action/group';


@T.decorator.contextTypes('store')
export default class GroupList extends PureComponent {

    componentDidMount() {
        this.getGroupList();
    }

    // 获取分组列表
    getGroupList(search = {}) {
        this.context.store.dispatch(getGroupPageListAction(search));
    }

    /**
     * 添加或修改分组
     * @param groupTree
     * @param root_group_id
     * @param parent_group_id
     * @param group_id
     */
    addOrUpdateGroup(groupTree, root_group_id, parent_group_id, group_id = false) {
        T.helper.renderModal(<CreateGroupModal
            groupTree={groupTree}
            root_group_id={root_group_id}
            parent_group_id={parent_group_id}
            group_id={group_id}
            getGroupList={() => this.getGroupList()}
        />);
    }

    /**
     * 删除分组
     * @param {Number} group_id
     */
    delGroup(group_id) {

        T.prompt.confirm(() => {
            return doDelGroup(group_id).then(() => {
                this.context.store.dispatch(delGroupAction(group_id));
                T.prompt.success('删除成功');
            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        }, { title: '确定删除？' });
    }

    render() {
        const { loading, groupList } = this.props.groupListReducer;
        const root_group_id = groupList[0] ? groupList[0].group_id : null;
        const dataSource = groupList[0] ? groupList[0].children : [];

        const columns = [
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
                render: (text, record) => [
                    <Button key={1} type="primary" icon="eye-o" onClick={() => T.helper.renderModal(<ManageMemberModal group_id={record.group_id} />)}>成员</Button>,
                    <Button key={2} type="primary" icon="edit" onClick={() => this.addOrUpdateGroup(groupList, root_group_id, record.parent_group_id, record.group_id)} style={{ marginLeft: 5 }}>修改</Button>,
                    <Button key={3} type="danger" icon="delete" onClick={() => this.delGroup(record.group_id)} style={{ marginLeft: 5 }}>删除</Button>
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="分组列表" rightRender={
                    <Button type="primary" icon="plus" onClick={() => this.addOrUpdateGroup(groupList, root_group_id, root_group_id)}>添加分组</Button>}
                />

                <MainContent>
                    {/* <Filter doSearch={(search) => this.getGroupList(search)} /> */}

                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                        rowKey={(record) => record.group_id}
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
            group_name: null,
        };
    }

    doSearch = () => {
        const { doSearch } = this.props;
        const cloneState = T.lodash.clone(this.state);
        if (T.lodash.isEmpty(cloneState.group_name)) delete cloneState.group_name;

        doSearch(cloneState);
    }

    render() {
        return (
            <Row gutter={0} type="flex" align="middle" style={{ marginBottom: 5 }}>
                <Col span={1}><span>名称：</span></Col>
                <Col span={4}>
                    <Input
                        value={this.state.group_name}
                        onChange={(e) => this.setState({ group_name: e.target.value.trim() })}
                        onBlur={() => this.doSearch()}
                        onKeyDown={(e) => e.keyCode === 13 && this.doSearch()}
                    />
                </Col>
            </Row>
        );
    }
}
