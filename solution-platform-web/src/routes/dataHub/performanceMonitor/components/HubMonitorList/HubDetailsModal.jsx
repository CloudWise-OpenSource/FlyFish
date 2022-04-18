/**
 * Created by willem on 18-1-22.
 */
import styles from './HubDetailsModal.scss';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import T from 'utils/T';
import {
    EnumTimeRange
} from 'constants/app/dataHub';
import {
    doGetHubDetails
} from '../../actions/hubMonitorList';

import Area from 'templates/ToolComponents/Charts/Area';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { Select, Modal, Tabs } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;


@T.decorator.propTypes({
    hubInfo: PropTypes.shape({
        nodeIp: PropTypes.string.isRequired,        // 主机地址
    })
})
export default class HubDetailsModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            timeRange: EnumTimeRange[0].value, // 时间范围
            chartData: {                       // 统计图数据
                hubCpu: [],
                hubMem: []
            },
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const { hubInfo } = this.props;
        // 获取图表数据
        this.setState({
            isLoading: true
        }, () => {
            doGetHubDetails(hubInfo.nodeIp, this.state.timeRange).then(resp => {
                const hubCpu = resp[0].data;
                const hubMem = resp[1].data;
                this.setState({
                    isLoading: false,
                    chartData: {
                        hubCpu,
                        hubMem
                    }
                });
            }, resp => {
                T.prompt.error(resp.msg);
            });
        });
    }

    /**
     * 菜单选择器值发生改变时
     * @param {String} value
     */
    handleSelectChange = (value) => {
        this.setState({ timeRange: value });
        // 获取图表数据
        this.loadData();
    };

    /**
     * 获取面积统计图--通用配置
     */
    getOptions = () => {
        return {
            chart: {
                height: 250
            },
            xAxis: {
                categories: [],
                labels: {
                    formatter: function () {
                        return T.helper.dateFormat(this.value, 'H:mm');
                    }
                },
                tickInterval: 2  // 隔n个轴标签显示
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value * 100 + '%';
                    }
                },
                min: 0,
            },
            series: [],
            tooltip: {
                formatter: function () {
                    let s = '<b>' + this.x + '</b>';
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ' +
                            (this.y * 100).toFixed(1) + '%';
                    });
                    return s;
                },
            },
        };
    };

    /**
     * 获取cpu-面积统计图配置
     */
    getOption_cpu() {
        return T.lodash.defaultsDeep(this.getOptions(), {
            xAxis: {
                categories: this.state.chartData.hubCpu.map(item => item.time),
            },
            series: [{
                name: 'userUsage',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hubCpu.map(item => (!T.lodash.isUndefined(item.usrUsage) ? item.usrUsage / 100 : null))
            }],
        });
    }

    /**
     * 获取mem-面积统计图配置
     */
    getOption_mem() {
        return T.lodash.defaultsDeep(this.getOptions(), {
            xAxis: {
                categories: this.state.chartData.hubCpu.map(item => item.time)
            },
            series: [{
                name: 'MemUse',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hubMem.map(item => (!T.lodash.isUndefined(item.memUse) || !T.lodash.isUndefined(item.memTotal) ? item.memUse / item.memTotal : null))
            }]
        });
    }

    render() {
        const { hubInfo } = this.props;
        const { isLoading, chartData, visible } = this.state;
        return (
            <Modal
                title="详情"
                visible={visible}
                footer={null}
                onCancel={() => this.setState({ visible: false })}
                bodyStyle={{
                    padding: '16px',
                }}
                style={{
                    top: '50%',
                    marginTop: -250,
                }}
                width={800}
            >
                <div className={styles.hubModalBox}>
                    <div className={styles.searchBox}>
                        <span>主机：{hubInfo.nodeIp} </span>&nbsp;&nbsp;&nbsp;
                        <span>时间范围：</span>
                        <Select
                            defaultValue={EnumTimeRange[0].value}
                            style={{ width: 120 }}
                            onChange={this.handleSelectChange}
                            size="small"
                        >
                            {
                                EnumTimeRange.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
                            }
                        </Select>
                    </div>
                    <BoxContent loading={isLoading} isNotData={!Array.isArray(chartData.hubCpu)}>
                        <Tabs type="card">
                            <TabPane tab="HubCPU使用率" key="1">
                                <Area
                                    option={this.getOption_cpu()}
                                />
                            </TabPane>
                            <TabPane tab="Hub内存使用率" key="2">
                                <Area
                                    option={this.getOption_mem()}
                                />
                            </TabPane>
                        </Tabs>
                    </BoxContent>
                </div>
            </Modal>
        );
    }
}
