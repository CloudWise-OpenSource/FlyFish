import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';

import { Component } from 'react';
import { Table, Modal, Button } from 'antd';
import { doGetDelScreenPageList, doUndoDelScreen } from '../../action/bigScreen';

export default class DeletedScreenModal extends Component {
    state = {
        visible: false,
        saving: false,
        loading: false,
        delScreenList: {
            count: 0,               // 总数据量
            totalPages: 0,          // 总页数
            pageSize: 0,            // 分页中的数量
            currentPage: 0,         // 当前页数
            data: [
                /* {
                    screen_id: 1,
                    account_id: 1,
                    name: "test",
                    cover: "",
                } */
            ]
        }
    };
    componentDidMount() {
        this.showModal();
        this.setState({ loading: true }, () => {
            this.getPageListData();
        });
    }
    getPageListData = (page = 1) => {
        doGetDelScreenPageList(page).then((resp) => {
            this.setState({
                loading: false,
                delScreenList: resp.data
            });
            let dataSource = [];
            const {currentPage, pageSize, data}=resp.data
            if (data.length > 0) {
                data.map((item, index) => {
                    let obj = {
                        rowKey: item.screen_id,
                        num: (currentPage - 1) * pageSize + index + 1,
                        name: item.name,
                        created_at: T.helper.dateFormat(item.created_at),
                        updated_at: T.helper.dateFormat(item.updated_at),
                        screen_id: item.screen_id
                    };
                    dataSource.push(obj);
                });
            }
            this.setState({
                loading: false,
                delScreenList: {
                    ...resp.data,
                    data: dataSource
                }
            });
        }, (resp) => {
            T.prompt.error(resp.msg);
        });
    }

    showModal = () => this.setState({ visible: true });

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => { 
        this.setState({
            visible: false,
        });
    }
    undoDelScreen = (screen_id) => {
        doUndoDelScreen([screen_id]).then((resp) => {
            T.prompt.success(resp.msg);
            const { delScreenList } = this.state
            const { currentPage, data } = delScreenList;
            const page = data.length === 1 && currentPage > 1 ? currentPage-1 : currentPage
            this.getPageListData(page);
        }, (resp) => {
            T.prompt.error(resp.msg);
        });
        console.log(screen_id);
    }
    render() {
        const { delScreenList, loading }=this.state
        const { count, pageSize, currentPage, data } = delScreenList
        console.log(count, pageSize, currentPage, data)
        const columns = [{
            title: '序号',
            dataIndex: 'num',
            key: 'num',
            width: 100,
        }, {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        }, {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 220,
        }, {
            title: '修改时间',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 220,
        }, {
            title: '操作',
            key: 'action',
            width: 100,
            render: (text, record) => {
                let screen_id = record.screen_id;
                return <a href="#" onClick={() => this.undoDelScreen(screen_id)}>还原</a>;
            }
        }];
        return (
            <Modal width="900px"
                visible={this.state.visible}
                title="已删除大屏列表"
                // okText="保存"
                // cancelText="关闭"
                confirmLoading={this.state.saving}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                footer={[
                    <Button key="back" onClick={this.handleCancel}> 
                        关闭
                    </Button>
                  ]}
            >
                <BoxContent loading={this.state.loading}>
                    <Table 
                        columns={columns}  
                        loading={loading}
                        rowKey={(record) => record.screen_id}
                        dataSource={data}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: count,
                            onChange: (page) => this.getPageListData(page)
                        }}
                    />

                </BoxContent>
            </Modal>
        );
    }
}
