/**
 * Created by chencheng on 17-8-31.
 */
import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter'; 
import BoxContent from 'templates/ToolComponents/BoxContent';
import Table from 'templates/ToolComponents/Table';

import { PureComponent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { MainHeader, MainContent } from 'templates/MainLayout';
import { doGetComponentChangePageListAction } from '../../action/componentChange';

@T.decorator.contextTypes('store','router')
export default class ComponentChangeList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            datas: [],
            current: 0,
            pageSize: 10,
            total: 100
        }
    }

    componentDidMount() {
        this.initList();
    }

    initList() {
        doGetComponentChangePageListAction(this.getComponentId(), (this.state.current === 0 ? 0 : this.state.current - 1) * this.state.pageSize, this.state.pageSize).then((resp) => {
            const result = resp.data || {};
            this.setState({
                datas: result.list || [],
                total: result.total || 0,
            })
        }, (resp) => T.prompt.error(resp.msg));
    }

    /**
     * 获取组件ID
     */
     getComponentId(){
        const { component_id } = T.queryString.parse(this.context.router.route.location.search);
        return component_id;
    }

    render() {
        const columns = [
            {
                title: 'hash',
                dataIndex: 'hash',
            },
            {
                title: '提交概要',
                dataIndex: 'message',
            },
            {
                title: '提交时间',
                dataIndex: 'time',
                render: (text) => T.helper.dateFormat(text)
            },
            {
                title: '操作',
                render: (text, record) => [
                    <Link key={2} to={{pathname:EnumRouter.v_component_change_detail, search: '?component_id=' + this.getComponentId() + '&hash=' + record.hash}}>
                        <Button
                            icon="code-o"
                            type="primary"
                        >
                            <span>查看提交diff</span>
                        </Button>
                    </Link>
                ]
            }
        ];

        return (
            <div>
                <MainHeader title="组件开发记录列表" rightRender={
                    <Fragment>
                        <Button
                            type="primary"
                            icon="rollback"
                            onClick={() => this.context && this.context.router && this.context.router.history && this.context.router.history.goBack()}
                        >返回</Button>
                    </Fragment>
                } />

                <MainContent>
                    <BoxContent loading={this.state.loading}>
                        <Table
                            dataSource={this.state.datas}
                            columns={columns}
                            pagination={{
                                showSizeChanger: true,
                                current: this.state.current,
                                pageSize: this.state.pageSize,
                                pageSizeOptions: ["10", "30", "50", "100"],
                                total: this.state.total,
                                onChange: (current,pageSize) => {
                                    this.setState({
                                        ...this.state,
                                        current: current,
                                        pageSize
                                    },()=>{
                                        this.initList();
                                    })
                                },
                                onShowSizeChange:(current, pageSize)=>{
                                    this.setState({
                                        ...this.state,
                                        current: 0,
                                        pageSize
                                    },()=>{
                                        this.initList();
                                    })
                                }
                            }}
                            loading={this.state.loading}
                            rowKey={(record) => record.hash}
                        />
                    </BoxContent>
                </MainContent>
            </div>
        );
    }
}
