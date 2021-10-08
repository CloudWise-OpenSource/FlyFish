/**
 * Created by willem on 18-1-22.
 */
import styles from './index.scss';
import { PureComponent } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import T from 'utils/T';
import {
    EnumHostStatus,
    EnumPaginationConfig,
    EnumWarnColor
} from 'constants/app/dataHub/index';
import {
    getHostAllListAction,
    getHubMonitorListAction
} from '../../actions/hubMonitorList';

import Tj_Table from 'templates/ToolComponents/Table';
import HubDetailsModal from './HubDetailsModal';
import { Select, Progress, Spin } from 'antd';
const Option = Select.Option;

@T.decorator.contextTypes('store')
export default class HubMonitorList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            ipList: []
        };
    }
    componentDidMount() {
        // 获取主机列表数据
        this.context.store.dispatch(getHostAllListAction());
        // 获取插件监控列表数据
        this.context.store.dispatch(getHubMonitorListAction(EnumPaginationConfig.page.value, EnumPaginationConfig.pageSize.value));
    }

    /**
     * 菜单选择器值改变时-ipList
     * @param {Array} value hostIp数组
     */
    handleSelectChange = (value) => {
        // ipList改变时立即重新加载表格数据
        this.context.store.dispatch(getHubMonitorListAction(EnumPaginationConfig.page.value, EnumPaginationConfig.pageSize.value, value));
        // 存ipList,改变页码时需要携带
        this.setState({ ipList: value });
    };

    /**
     * 点击查看host主机详情
     * @param {Object} hubInfo 插件监控信息
     */
    handleShowDetails = (hubInfo) => {
        T.helper.renderModal(<HubDetailsModal hubInfo={hubInfo} />);
    };

    /**
     * 页码改变的回调，参数是改变后的页码及每页条数
     * @param {Number} page 当前页
     * @param {Number} pageSize 页数
     */
    paginationChange = (page, pageSize) => {
        const ipList = this.state.ipList;
        this.context.store.dispatch(getHubMonitorListAction(page, pageSize, ipList));
    };

    /**
     * 匹配进度条显示颜色
     * @param {Number/String} text 值
     * @param {Number} n text值若是百分比则1， 小数则为100（默认）
     * @returns {string}
     */
    selectWarnColor = (text, n = 100) => {
        let className = 'default';
        EnumWarnColor.forEach(item => {
            const value = Number(text) * n;
            if (item.low <= value && item.high > value) {
                className = item.className;
            }
        });
        return className;
    };

    render() {
        const { hubMonitorListReducer } = this.props;
        const { hostAllList, monitorList } = hubMonitorListReducer;

        const columns = [
            {
                title: 'Hub状态',
                dataIndex: 'hubStatus',
                render: text => <div
                    className={Number(text) === EnumHostStatus.using.value ? EnumHostStatus.using.className : EnumHostStatus.stop.className}
                ><span /></div>
            },
            {
                title: '主机IP',
                dataIndex: 'nodeIp',
                render: (text, record) => <span onClick={() => this.handleShowDetails(record)} className="showHubDetails">{text}</span>
            },
            {
                title: 'HubCPU使用率',
                dataIndex: 'cpuUsePerc',
                render: text => <Progress
                    percent={Number(text) > 100 ? 100 : Number(text)}
                    status="active"
                    format={percent => Number(text).toFixed(2) + '%'}
                    strokeWidth={16}
                    className={this.selectWarnColor(text, 1)}
                />,
                sorter: (a, b) => a.cpuUsePerc - b.cpuUsePerc,
            },
            {
                title: 'Hub内存使用率',
                dataIndex: 'memUsePerc',
                render: text => <Progress
                    percent={Number(text) * 100 > 100 ? 100 : Number(text) * 100}
                    status="active"
                    format={percent => (Number(text) * 100).toFixed(2) + '%'}
                    strokeWidth={16}
                    className={this.selectWarnColor(text)}
                />,
                sorter: (a, b) => a.memUsePerc - b.memUsePerc,

            }
        ];

        // 格式化数据，赋予key值
        const dataSource = monitorList.list.map((item, index) => {
            return {
                ...item,
                key: index
            };
        });

        // 分页器配置
        const paginations = {
            current: monitorList.page,
            total: monitorList.totalCount,
            defaultPageSize: EnumPaginationConfig.pageSize.value,
            showQuickJumper: true,
            onChange: this.paginationChange,
            size: 'small'
        };
        return (
            <div>
                <MainHeader title="Hub监控" />

                <MainContent className={styles.hubMonitorBox}>
                    <div className={styles.searchHeader}>
                        <span>主机列表：</span>
                        <Select
                            mode="multiple"
                            allowClear // 支持清除
                            notFoundContent={hostAllList.isLoading ? <Spin size="small" /> : null} // 远程加载
                            showSearch
                            style={{ width: 350 }}
                            placeholder="请选择主机地址"
                            optionFilterProp="children" // 对内嵌内容进行搜索
                            onChange={this.handleSelectChange}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                hostAllList.list.map(item => {
                                    return <Option value={item.ip} key={item.ip}>{item.ip}</Option>;
                                })
                            }
                        </Select>
                    </div>
                    <div>
                        <Tj_Table
                            dataSource={dataSource}
                            columns={columns}
                            pagination={paginations}
                            loading={monitorList.isLoading}
                        />
                    </div>
                </MainContent>
            </div>
        );
    }
}
