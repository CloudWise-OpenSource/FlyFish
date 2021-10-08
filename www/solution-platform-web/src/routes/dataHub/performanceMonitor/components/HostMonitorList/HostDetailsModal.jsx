/**
 * Created by willem on 18-1-22.
 */
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import T from 'utils/T';
import {
    EnumTimeRange
} from 'constants/app/dataHub';
import {
    doGetHostDetails
} from '../../actions/hostMonitorList';

import { Select, Modal, Tabs, Row, Col } from 'antd';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
import Area from 'templates/ToolComponents/Charts/Area';
import BoxContent from 'templates/ToolComponents/BoxContent';


@T.decorator.propTypes({
    info: PropTypes.shape({
        nodeIp: PropTypes.string.isRequired     // 主机地址
    })
})
export default class HostDetailsModal extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            timeRange: EnumTimeRange[0].value, // 时间范围
            chartData: {                       // 统计图数据
                hostCpu: [],
                hostMem: [],
                hostDisk: [],
                hostNet: []
            },
            isLoading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const { info } = this.props;
        // 获取图表数据
        this.setState({
            isLoading: true
        }, () => {
            doGetHostDetails(info.nodeIp, this.state.timeRange).then(resp => {
                const hostCpu = resp[0].data;
                const hostMem = resp[1].data;
                const hostDisk = resp[2].data;
                const hostNet = resp[3].data;
                this.setState({
                    isLoading: false,
                    chartData: {
                        hostCpu,
                        hostMem,
                        hostDisk,
                        hostNet
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
            xAxis: {
                categories: [],
                labels: {
                    formatter: function () {
                        return T.helper.dateFormat(this.value, 'H:mm');
                    }
                },
            },
            yAxis: {
                min: 0,
            },
            series: []
        };
    };

    /**
     * 获取cpu使用率-面积统计图配置
     */
    getOption_cpu() {
        return T.lodash.defaultsDeep(this.getOptions(), {
            xAxis: {
                categories: this.state.chartData.hostCpu.map(item => item.time),
                tickInterval: 2  // 隔n个轴标签显示
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value * 100 + '%';
                    }
                }
            },
            series: [{
                name: 'sysUsage',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hostCpu.map(item => (!T.lodash.isUndefined(item.sysUsage) ? item.sysUsage : null))
            }, {
                name: 'usrUsage',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#2f4554'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hostCpu.map(item => (!T.lodash.isUndefined(item.usrUsage) ? item.usrUsage : null))
            }, {
                name: 'waitUsage',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#61a0a8'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hostCpu.map(item => (!T.lodash.isUndefined(item.waitUsage) ? item.waitUsage : null))
            }],
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
        });
    }

    /**
     * 获取内存使用量-面积统计图配置
     */
    getOption_mem() {
        return T.lodash.defaultsDeep(this.getOptions(), {
            xAxis: {
                categories: this.state.chartData.hostMem.map(item => item.time),
                tickInterval: 2  // 隔n个轴标签显示
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return Math.round(Number(this.value) / Math.pow(2, 30)) + 'G';
                    }
                }
            },
            series: [{
                name: 'memTotal',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hostMem.map(item => (!T.lodash.isUndefined(item.memTotal) ? item.memTotal : null))
            }, {
                name: 'memUse',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#2f4554'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: this.state.chartData.hostMem.map(item => (!T.lodash.isUndefined(item.memUse) ? item.memUse : null))
            }],
            tooltip: {
                formatter: function () {
                    let s = '<b>' + this.x + '</b>';
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ' +
                            (Number(this.y) / Math.pow(2, 30)).toFixed(2) + 'G';
                    });
                    return s;
                },
            },
        });
    }

    /**
     * 获取主磁盘空间使用率-面积统计图配置-左
     * @param {String} title
     * @param {Array} diskIOList
     * @returns {*}
     */
    getOption_diskIOListLeft(title, diskIOList) {
        // 当值全为0时,制定最大值1,防止0轴居中
        const cloneArr = T.lodash.cloneDeep(diskIOList);
        const hasValueArr = cloneArr.filter(item => item.diskReadTimePerSec !== 0 || item.diskWriteTimePerSec !== 0);
        return T.lodash.defaultsDeep(this.getOptions(), {
            chart: {
                height: 200
            },
            title: {
                text: title,
                align: 'left'
            },
            legend: {
                align: 'right'
            },
            xAxis: {
                categories: diskIOList.map(item => item.time),
                tickInterval: 4  // 隔n个轴标签显示
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                min: 0,
                max: hasValueArr.length > 0 ? null : 1
            },
            series: [{
                name: '每秒读取次数',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: diskIOList.map(item => (!T.lodash.isUndefined(item.diskReadTimePerSec) ? item.diskReadTimePerSec : null))
            }, {
                name: '每秒写入次数',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#2f4554'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: diskIOList.map(item => (!T.lodash.isUndefined(item.diskWriteTimePerSec) ? item.diskWriteTimePerSec : null))
            }],
            tooltip: {
                formatter: function () {
                    let s = '<b>' + this.x + '</b>';
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ' +
                            Number(this.y).toFixed(2);
                    });
                    return s;
                },
            },
        });
    }

    /**
     * 获取主磁盘空间使用率-面积统计图配置-右
     * @param {String} title 标题
     * @param {Array} diskUsageList 数据
     * @returns {*}
     */
    getOption_diskUsageListRight(title, diskUsageList) {
        return T.lodash.defaultsDeep(this.getOptions(), {
            chart: {
                height: 200
            },
            title: {
                text: title,
                align: 'left'
            },
            legend: {
                align: 'right'
            },
            xAxis: {
                categories: diskUsageList.map(item => item.time),
                tickInterval: 4  // 隔n个轴标签显示
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return (Number(this.value) / Math.pow(2, 20)).toFixed(1) + 'G';
                    }
                }
            },
            series: [{
                name: '已使用磁盘空间',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: diskUsageList.map(item => (!T.lodash.isUndefined(item.diskUse) ? item.diskUse : null))
            }, {
                name: '磁盘总空间',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#2f4554'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: diskUsageList.map(item => (!T.lodash.isUndefined(item.diskTotal) ? item.diskTotal : null))
            }],
            tooltip: {
                formatter: function () {
                    let s = '<b>' + this.x + '</b>';
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ' +
                            (Number(this.y) / Math.pow(2, 20)).toFixed(2) + 'G';
                    });
                    return s;
                },
            },
        });
    }

    /**
     * 获取主机网卡流量-面积统计图配置
     * @param {String} title 标题
     * @param {Array} inOutList 数据
     * @returns {*}
     */
    getOption_net(title, inOutList) {
        return T.lodash.defaultsDeep(this.getOptions(), {
            chart: {
                height: 250
            },
            title: {
                text: title,
                align: 'left'
            },
            legend: {
                align: 'right'
            },
            xAxis: {
                categories: inOutList.map(item => item.time),
                tickInterval: 2  // 隔n个轴标签显示
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                min: 0,
                title: {
                    align: 'high',
                    text: '单位(mbps)',
                    rotation: 0,
                    y: -15,
                    x: 70,
                }
            },
            series: [{
                name: 'netIn',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#c23531'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: inOutList.map(item => (!T.lodash.isUndefined(item.in) ? item.in : null))
            }, {
                name: 'netOut',
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, '#2f4554'],
                        [1, 'rgba(255,255,255,0)']
                    ]
                },
                data: inOutList.map(item => (!T.lodash.isUndefined(item.out) ? item.out : null))
            }],
            tooltip: {
                formatter: function () {
                    let s = '<b>' + this.x + '</b>';
                    $.each(this.points, function () {
                        s += '<br/>' + this.series.name + ': ' +
                            Number(this.y).toFixed(4);
                    });
                    return s;
                },
            },
        });
    }

    render() {
        const { info } = this.props;
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
                    marginTop: -260,
                }}
                width={800}
            >
                <div className="hubModalBox">
                    <div className="searchBox">
                        <span>主机：{info.nodeIp} </span>&nbsp;&nbsp;&nbsp;
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
                    <BoxContent loading={isLoading} isNotData={!Array.isArray(chartData.hostCpu)}>
                        <Tabs type="card">
                            <TabPane tab="主机CPU使用率" key="1">
                                <Area
                                    option={this.getOption_cpu()}
                                />
                            </TabPane>
                            <TabPane tab="主机内存使用量" key="2">
                                <Area
                                    option={this.getOption_mem()}
                                />
                            </TabPane>
                            <TabPane tab="主机磁盘空间使用率" key="3">
                                {
                                    chartData.hostDisk.map((item, index) => <Row key={item.devName + index}>
                                        <Col span={12}>
                                            <Area
                                                option={this.getOption_diskIOListLeft(item.devName, item.diskIOList)}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Area
                                                option={this.getOption_diskUsageListRight(item.devName, item.diskUsageList)}
                                            />
                                        </Col>
                                    </Row>)
                                }
                            </TabPane>
                            <TabPane tab="主机网卡流量" key="4">
                                {
                                    chartData.hostNet.map((item, index) => <Row key={item.netName + index}>
                                        <Col span={24}>
                                            <Area
                                                option={this.getOption_net(item.netName, item.inOutList)}
                                            />
                                        </Col>
                                    </Row>)
                                }
                            </TabPane>
                        </Tabs>
                    </BoxContent>
                </div>
            </Modal>
        );
    }
}
