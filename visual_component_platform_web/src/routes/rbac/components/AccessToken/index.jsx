/**
 * Created by chencheng on 17-8-31.
 */
import T from 'utils/T';
import Table from 'templates/ToolComponents/Table';

import { Component } from 'react';
import { Button, Popconfirm } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';

import { EnumAccessTokenStatusType } from 'constants/app/accessToken';
import {
    getAccessTokenPageListAction,
    doAddAccessToken,
    doDelAccessToken,
    delAccessTokenAction,
    doUpdateAccessTokenStatus
} from '../../action/accessToken';

/**
 * AccessToken类型对应的枚举信息
 */
const EnumAccessTokenStatusTypeToInfoMap = (() => {
    let typeToInfoMap = {};
    Object.values(EnumAccessTokenStatusType).forEach(item => typeToInfoMap[item.value] = item);
    return typeToInfoMap;
})();

@T.decorator.contextTypes('store')
export default class AccessToken extends Component {

    componentDidMount() {
        this.getAccessTokenList();
    }

    // 获取AccessToken列表
    getAccessTokenList(page = 1, search = {}) {
        this.context.store.dispatch(getAccessTokenPageListAction(page, search));
    }

    // 添加AccessToken
    addAccessToken(){
        T.prompt.confirm(
            () => doAddAccessToken().then(() => this.getAccessTokenList(), (resp) => T.prompt.error(resp.msg)),
            {title: "确定添加AccessToken吗？"}
        )
    }

    render() {
        const { loading, accessTokenList } = this.props.accessTokenListReducer;
        const { count, pageSize, currentPage, data } = accessTokenList;

        const columns = [
            {
                title: 'Access Key ID',
                dataIndex: 'access_key_id',
            },
            {
                title: 'Access Key Secret',
                dataIndex: 'access_key_secret',
            },
            {
                title: '类型',
                dataIndex: 'status',
                render: (text) => <span>{EnumAccessTokenStatusTypeToInfoMap[text].label}</span>
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                render: (text) => T.helper.dateFormat(text)
            },
            {
                title: '操作',
                render: (text, record) => [

                    <Popconfirm
                        key={1}
                        title={`确定${EnumAccessTokenStatusType.normal.value == record.status ? "禁用" : "启用"}?`}
                        onConfirm={() => {
                            doUpdateAccessTokenStatus(
                                record.access_key_id,
                                EnumAccessTokenStatusType.normal.value == record.status ? EnumAccessTokenStatusType.disabled.value : EnumAccessTokenStatusType.normal.value
                            ).then(() => {
                                this.getAccessTokenList();
                            }, (resp) => T.prompt.error(resp.msg))
                        }}
                        okText="确定"
                        cancelText="取消"
                    >
                        {
                            EnumAccessTokenStatusType.normal.value == record.status ?
                            <Button type="primary" icon="eye-o">禁用</Button> :
                            <Button type="primary" icon="eye-o">启用</Button>
                        }
                    </Popconfirm>,
                    <Popconfirm
                        key={2}
                        title="确定删除?"
                        onConfirm={() => {
                            doDelAccessToken([record.access_key_id]).then(() => {
                                this.context.store.dispatch(delAccessTokenAction([record.access_key_id]))
                            }, (resp) => T.prompt.error(resp.msg))
                        }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="danger" icon="edit" style={{marginLeft: 5}}>删除</Button>
                    </Popconfirm>

                ]
            }
        ];

        return (
            <div>
                <MainHeader title="AccessToken" rightRender={<Button type="primary" icon="plus" onClick={() => this.addAccessToken()}>添加AccessToken</Button> } />

                <MainContent>
                    <Table
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getAccessTokenList(page)
                        }}
                        loading={loading}
                        rowKey={(record) => record.access_key_id}
                    />
                </MainContent>
            </div>
        );
    }
}
