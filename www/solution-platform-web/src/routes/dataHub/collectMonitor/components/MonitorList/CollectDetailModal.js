/**
 * Created by john on 2018/1/22.
 */
import T from 'utils/T';
import Column from 'templates/ToolComponents/Charts/Column';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { Modal, Col, Row } from 'antd';
import {
    doGetDetail
} from '../../actions/monitorList';

export default class CollectDetailModal extends PureComponent {

    state = {
        visible: false,
        loading: true,
        chartData: {
            xTime: [],  // 横轴时间
            sendList: [], // 日志发送量或消费量
            receiveList: [],   // 日志接收量或生产量
            sr: [],       //   发送量／接收量
        },
        unit: 'bit',  // 单位
        sendOrConsume: '日志发送量',    // 名称   发送或消费
        receiveOrProduce: '日志接收量',    // 名称    接收或生产
        percent: '发送量/接收量'   // 名称   采集量／生产量  或  发送量/接收量
    }

    componentDidMount() {
        this.showModal();
    }

    componentDidMount() {

        const { logType, timeRange, ip, pluginType } = this.props;

        this.getDetail(logType, timeRange, ip, pluginType);

    }
    /**
     * 获取详情
     * @param logType
     * @param timeRange
     * @param hostIP
     * @param pluginType
     */
    getDetail(logType, timeRange, ip, pluginType) {
        if (pluginType == 'sink-agent') {

            this.setState({
                sendOrConsume: '日志发送量',    // 名称   发送或消费
                receiveOrProduce: '日志接收量',    // 名称    接收或生产
                percent: '发送量/接收量'   // 名称   采集量／生产量  或  发送量/接收量
            });

        } else if (pluginType == 'source-agent') {

            this.setState({
                sendOrConsume: '日志消费量',
                receiveOrProduce: '日志生产量',
                percent: '发送量/接收量'
            });
        }
        doGetDetail(logType, timeRange, ip, pluginType).then((resp) => {

            this.dataFormat(resp.data);
            this.setState({
                loading: false
            });

        }, (resp) => {
            T.prompt.error(resp.msg);
        });

    }

    /**
     * 数据格式化-chart
     * @param data
     */
    dataFormat(data) {
        // 消费--发送
        const { consumList, produceList } = data;

        let timeTotal = [];    // 横轴时间
        let receiveData = []; // 接收数据
        let sendData = []; // 发送数据
        let srData = [];      //   发送量／接收量

        // 格式化日志发送量／消费量
        consumList && consumList.map((item, idx) => {
            // 时间格式化
            let arr1 = item.time.split(' ');
            let arr2 = arr1[1].split(':');
            let time = arr2[0] + ':' + arr2[1];
            timeTotal.push(time);
            // 格式化发送量
            sendData.push(Number(this.dataSizeFormat(item.dataSize)));
        });

        // 格式化日志接收量／生产量       发送量/接收量
        produceList && produceList.map((item, idx) => {

            receiveData.push(Number(this.dataSizeFormat(item.dataSize)));

            srData.push(Number((consumList[idx].dataSize / item.dataSize).toFixed(3)));
        });

        this.setState({
            chartData: {
                xTime: timeTotal,  // 横轴时间
                sendList: sendData, // 日志发送量
                receiveList: receiveData,   // 日志接收量
                sr: srData       //   发送量／接收量
            }
        });

    }

    /**
     * 数据量单位判断
     * @param data
     * @return {*}
     */
    dataSizeFormat(data) {

        if (data >= 1024 && data < 1048576) { // 1-1024kb   1M以内
            this.setState({
                unit: 'K'
            });
            return (data / 1024).toFixed(3);

        } else if (data >= 1048576 && data < 1073742000) {  // 1-1024M   1G以内
            this.setState({
                unit: 'M'
            });
            return (data / 1048576).toFixed(3);

        } else if (data >= 1073742000) {   // 大于1G
            this.setState({
                unit: 'G'
            });
            return (data / 1073742000).toFixed(3);

        } else {  // 小于1024  单位字节bit
            this.setState({
                unit: 'Bit'
            });
            return data;
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
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
    getOptions = () => {
        return {
            chart: {
                zoomType: 'xy',
                marginTop: 70,
            },
            title: {
                text: ''
            },
            subtitle: {
                text: '',
                enabled: false
            },
            xAxis: [{
                categories: this.state.chartData.xTime,
                crosshair: true
            }],
            yAxis: [{ // Primary yAxis
                title: {
                    text: '数据量(' + this.state.unit + ')',
                    align: 'high',
                    rotation: 0, // 旋转
                    y: -15,
                    x: 5,
                    offset: 0,
                },
                min: 0,
                lineWidth: 0,
            }, { // Secondary yAxis
                title: {
                    text: '消费比例',
                    align: 'high',
                    rotation: 0, // 旋转
                    y: -15,
                    x: 0,
                    offset: 0,
                },
                min: 0,
                max: 1,
                lineWidth: 0,
                opposite: true // 该轴对立面显示
            }],
            tooltip: {
                shared: true
            },
            legend: {
                enabled: true,
                layout: 'horizontal',
                align: 'right',
                verticalAlign: 'top',
            },
            series: [
                {
                    name: this.state.sendOrConsume,
                    type: 'column',
                    yAxis: 0,
                    data: this.state.chartData.sendList,
                    tooltip: {
                        valueSuffix: this.state.unit
                    }
                },
                {
                    name: this.state.receiveOrProduce,
                    type: 'column',
                    yAxis: 0,
                    data: this.state.chartData.receiveList,
                    tooltip: {
                        valueSuffix: this.state.unit
                    }
                },
                {
                    name: this.state.percent,
                    type: 'line',
                    yAxis: 1,
                    data: this.state.chartData.sr,
                    tooltip: {
                        valueSuffix: ''
                    }
                }]
        };
    }

    render() {

        const { hostIP } = this.props;
        const { loading } = this.state;

        return (
            <Modal

                title="详情"
                width={700}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText="取消"
                okText="确定"
                footer={null}
            >
                <Row>
                    <Col span={1}></Col>
                    <Col span={2}>主机:</Col>
                    <Col span={20}>{hostIP}</Col>
                    <Col span={1}></Col>
                </Row>
                <Row>
                    <Col span={1}></Col>
                    <Col span={22}>

                        <BoxContent isNotData={this.state.chartData.xTime.length > 0 ? false : true} loading={loading}>
                            <Column option={this.getOptions()} />
                        </BoxContent>
                    </Col>
                    <Col span={1}></Col>
                </Row>

            </Modal>
        );
    }
}
