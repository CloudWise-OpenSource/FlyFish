import styles from './PluginDispatchModal.scss';
import T from 'utils/T';
import PropTypes from 'prop-types';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { Modal, Row, Col, Input, Button, Table } from 'antd';
import {
    doGetPluginHostList,
    doPostDispatchPlugin,
} from '../../actions/pluginList';

@T.decorator.propTypes({
    getPluginList: PropTypes.func.isRequired,
    pluginListParams: PropTypes.object.isRequired,
    record: PropTypes.object.isRequired,

})
export default class PluginDispatchModal extends PureComponent {

    state = {
        loading: false,
        selectedRows: [], // 选中行
        visible: false,
        page: 1,
        pageSize: 10,
        ip: '', // 搜索参数
        totalCount: '',
        pageCount: '',
        list: [], // 列表数据
        dispatchParams: { // 插件分发提交参数
            fromHost: {
                ip: '',
                port: ''
            },
            pluginId: '',
            toHostList: []

        }

    }

    componentDidMount() {
        this.showModal();
        const { page, pageSize, ip } = this.state;
        this.getPluginHostList(page, pageSize, ip);

        this.setState({
            loading: true
        });

        this.saveDispatchParams();
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    /**
     * 提交
     */
    handleOk = () => {

        const { dispatchParams, selectedRows } = this.state;
        const { pluginListParams } = this.props;
        dispatchParams.toHostList = [];

        selectedRows.map((item, idx) => {

            let obj = {
                ip: item.hostName,
                port: item.port
            };

            dispatchParams.toHostList.push(obj);
        });

        if (dispatchParams.toHostList.length > 0) {

            doPostDispatchPlugin(dispatchParams).then((resp) => {
                this.setState({
                    visible: false,
                });

                // 更新列表
                this.props.getPluginList(pluginListParams);

            }, (resp) => {
                T.prompt.error(resp.msg);
            });
        } else {
            T.prompt.error('请选择主机名称');
        }


    }
    /**
     * 取消
     */
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    /**
     * 获取插件主机列表
     */
    getPluginHostList(page, pageSize, ip) {

        doGetPluginHostList(page, pageSize, ip).then((resp) => {

            const { page, pageSize, totalCount, pageCount, list } = resp.data;
            let arr = [];

            list.map((item, idx) => {
                let obj = {
                    key: String(idx),
                    operator: '',
                    hostName: item.ip,
                    port: item.port
                };
                arr.push(obj);
            });
            this.setState({
                page,
                pageSize,
                totalCount,
                pageCount,
                list: arr,
                loading: false
            });
        }, (resp) => {
            T.prompt.error(resp.msg);
        });
    }
    /**
     * 保存提交接口参数
     */
    saveDispatchParams() {

        const { pluginId, nodePort, hostIp } = this.props.record;

        this.setState({
            dispatchParams: {
                fromHost: {
                    ip: hostIp,
                    port: nodePort
                },
                pluginId: pluginId,
                toHostList: []
            }
        });
    }

    /**
     * 保存搜索框内容
     * @param {String} e
     */
    searchHost(e) {
        let ip = e.target.value;
        this.setState({
            ip
        });
    }

    /**
     * 搜索按钮-查询
     */
    searchBtn() {
        const { page, pageSize, ip } = this.state;
        this.getPluginHostList(page, pageSize, ip);
    }

    /**
     * 分页
     * @param {Object} obj
     * @param {Number} obj.current 选中当前页
     * @param {Number} obj.pageSize 页容量
     */
    changePage(obj) {
        const { current, pageSize } = obj;
        let ip = '';
        let page = current;

        this.getPluginHostList(page, pageSize, ip);
    }
    render() {

        let self = this;
        const { record } = this.props;
        const { selectedRows, list, loading, page, pageSize, totalCount } = this.state;
        const pagination = {
            current: page,
            pageSize: pageSize,
            total: totalCount
        };
        const columns = [{
            title: '操作',
            dataIndex: 'operator',
            key: 'operator',
        }, {
            title: '主机名称',
            dataIndex: 'hostName',
            key: 'hostName',
        }];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                self.setState({
                    selectedRows
                });
            }
        };

        return (
            <Modal
                cancelText="取消"
                okText="提交"
                title="插件分发"
                width={800}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Row>
                    <Col span={1}></Col>
                    <Col span={3}>待分发插件:</Col>
                    <Col span={19}>
                        {
                            record.pluginName
                        }
                    </Col>
                    <Col span={1}></Col>
                </Row>
                <Row className={styles.host_row}>
                    <Col span={1}></Col>
                    <Col span={3}>待分发主机:</Col>
                    <Col span={8}>
                        {'当前已勾选' + selectedRows.length + '台待分发主机'}
                    </Col>
                    <Col span={11}>
                        <Input className={styles.search_input} onChange={(e) => this.searchHost(e)} />
                        <Button type="primary" className={styles.search_btn} onClick={() => this.searchBtn()}>搜索</Button>
                    </Col>
                    <Col span={1}></Col>
                </Row>
                <Row className={styles.table_row}>
                    <BoxContent loading={loading} isNotData={list.length > 0 ? false : true}>
                        <Table size="small"
                            pagination={pagination}
                            rowSelection={rowSelection}
                            dataSource={list}
                            columns={columns}
                            onChange={(current) => this.changePage(current)}
                        />
                    </BoxContent>
                </Row>

            </Modal>
        );
    }
}
