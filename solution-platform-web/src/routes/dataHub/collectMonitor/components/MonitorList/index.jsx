/**
 * Created by chencheng on 17-8-31.
 */
import styles from './index.scss';
import T from 'utils/T';
import Column from 'templates/ToolComponents/Charts/Column';
import CollectDetailModal from './CollectDetailModal';
import BoxContent from 'templates/ToolComponents/BoxContent'
import { EnumHubStatus,EnumPluginTypes,EnumTimeRange,EnumPluginStatus } from 'constants/app/dataHub/index';
import { PureComponent } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import { Row, Col, Select, Table, Progress } from 'antd';
const Option = Select.Option;
import {
    doGetLogTypeList,
    doGetCollectData,
    doGetCollectList,
} from '../../actions/monitorList'

export default class MonitorList extends PureComponent {

    state = {
         logTypeList:[],    //存放日志类型列表
         logType:'1',  //存放日志类型 默认1
         pluginType:'',     //存放插件类型 默认source-agent
         timeRange:'30M', //存放时间范围 默认30M
         chartData:{

             xTime:[],  //横轴时间
             collectList:[],  //日志采集量
             produceList:[],     //日志生产量
             sendList:[] , //日志发送量
             receiveList:[],   //日志接收量
             cp:[],  //  采集量／生产量
             sr:[]       //   发送量／接收量
         },
         page:1 ,
         pageSize:10,
         totalCount:'',   //列表数据总量
         tableList:[],   //存放列表数据
         chartLoading:true,
         tableLoading:true

    }

    componentDidMount(){

        const {logType,pluginType,timeRange,page,pageSize} = this.state

        let arr = []

        //获取日志类型列表
        doGetLogTypeList().then((resp)=>{

            resp.data.list.map((item,idx)=>{
                let obj = {
                    value:item.logType,
                    label:item.logTypeName
                }
                arr.push(obj)
            })

            this.setState({
                logTypeList:arr
            })

        },(resp)=>{
            T.prompt.error(resp.msg)
        })

        let type = 'log'
        let e = this.state.logType
        //获取采集数据
        this.getCollectData(logType,pluginType,timeRange,e,type)

        //获取采集数据列表
        this.getCollectList(logType,page,pageSize,pluginType,timeRange)

    }
    /**
     * 获取统计图配置
     */
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
                    text: '数据量(k)',
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
            series: [{
                name: '日志采集量',
                type: 'column',
                yAxis: 0,
                data: this.state.chartData.collectList,
                tooltip: {
                    valueSuffix: 'k'
                }
            }, {
                name: '日志生产量',
                type: 'column',
                yAxis: 0,
                data: this.state.chartData.produceList,
                tooltip: {
                    valueSuffix: 'k'
                }
            },
            {
                name: '日志发送量',
                type: 'column',
                yAxis: 0,
                data: this.state.chartData.sendList,
                tooltip: {
                    valueSuffix: 'k'
                }
            },
            {
                name: '日志接收量',
                type: 'column',
                yAxis: 0,
                data: this.state.chartData.receiveList,
                tooltip: {
                    valueSuffix: 'k'
                }
            }, {
                name: '采集量/生产量',
                type: 'line',
                yAxis: 1,
                data: this.state.chartData.cp,
                tooltip: {
                    valueSuffix: ''
                }
            },
            {
                name: '发送量/接收量',
                type: 'line',
                yAxis: 1,
                data: this.state.chartData.sr,
                tooltip: {
                    valueSuffix: ''
                }
            }]
        };
    };

    //弹窗
    handleShowDetails = (record) => {

        const {logType,timeRange} = this.state
        const {hostIP,pluginType} = record

        T.helper.renderModal(<CollectDetailModal
            logType={logType}
            timeRange={timeRange}
            ip={hostIP}
            pluginType={pluginType}
        />);
    };

    /**
     * 获取采集数据
     * @param {string} logType
     * @param {string} pluginType
     * @param {string} timeRange
     */
    getCollectData(logType,pluginType,timeRange,e,type){
        doGetCollectData(logType,pluginType,timeRange,e,type).then((resp)=>{

            this.dataFormat(resp.data)

            switch (type){
                case 'time':
                    this.setState({
                        chartLoading:false,
                        timeRange:e
                    })
                    break;
                case 'log':
                    this.setState({
                        chartLoading:false,
                        logType:e
                    })
                    break;
                case 'plugin':
                    this.setState({
                        chartLoading:false,
                        pluginType:e
                    })
                    break;
                default:
                    break
            }

        },(resp)=>{
           T.prompt.error(resp.msg)
        })
    }

    /**
     * 获取采集数据列表
     * @param {string} logType
     * @param {string} page
     * @param {string} pageSize
     * @param {string} pluginType
     * @param {string} timeRange
     */
    getCollectList(logType,page,pageSize,pluginType,timeRange){
         doGetCollectList(logType,page,pageSize,pluginType,timeRange).then((resp)=>{
             if(resp.data!=null){
                 this.listDataFormat(resp.data)
             }
             this.setState({
                 tableLoading:false
             })
         },(resp)=>{
             T.prompt.error(resp.msg)
         })
    }

    /**
     * 列表数据格式化
     * @param data
     */
    listDataFormat(data){

        const { list } = data
        let arr = []

        list.map((item,idx)=>{

            let arr1 = item.consumRate.split("=")
            let arr2 = arr1[3].split("%")
            let arr3 = Number(arr2[0])

           item.pluginList.map((itemx,num)=>{

               let obj = {
                   key:String(idx)+String(num),
                   hubStatus: String(item.hubStatus),
                   hostIP: item.nodeIp,
                   pluginType: itemx.pluginType,
                   pluginStatus: String(item.hubStatus),
                   pluginData: String((arr3/100).toFixed(3))

               }

               arr.push(obj)
           })

        })

        this.setState({
            tableList:arr
        })
    }
    /**
     * 数据格式化-chart
     * @param data
     */
    dataFormat(data){

        const {collectList,produceList,receiveList,sendList} = data
        let timeTotal = []    //横轴时间
        let collectData = []  //采集数据
        let produceData = []    //生产数据
        let receiveData = [] //接收数据
        let sendData = [] //发送数据
        let cpData = []  //  采集量／生产量
        let srData = []      //   发送量／接收量

        // 格式化采集量数据/时间格式化
        collectList&&collectList.map((item,idx)=>{
            //时间格式化
            let arr1 = item.time.split(" ")
            let arr2 = arr1[1].split(":")
            let time = arr2[0]+":"+arr2[1]
            timeTotal.push(time)
            //格式化采集量数据
            collectData.push(item.dataSize)
        })

        //格式化日志生产量    采集量／生产量
        produceList&&produceList.map((item,idx)=>{
            produceData.push(item.dataSize)
            cpData.push((collectList[idx].dataSize/item.dataSize).toFixed(3))
        })

        //格式化日志发送量
        sendList&&sendList.map((item,idx)=>{
            sendData.push(item.dataSize)
        })

        //格式化日志接收量  发送量/接收量
        receiveList&&receiveList.map((item,idx)=>{
            receiveData.push(item.dataSize)
            srData.push((sendList[idx].dataSize/item.dataSize).toFixed(3))
        })

        this.setState({
            chartData: {
                xTime: timeTotal,  //横轴时间
                collectList: collectData,  //日志采集量
                produceList: produceData,     //日志生产量
                sendList: sendData, //日志发送量
                receiveList: receiveData,   //日志接收量
                cp: cpData,  //  采集量／生产量
                sr: srData       //   发送量／接收量
            }
        })

    }
    //选择时间类型
    changeTime(e){

        let { logType,pluginType,timeRange } = this.state
        let type = 'time'
        timeRange = e

        this.getCollectData(logType,pluginType,timeRange,e,type)
    }

    //选择插件类型
    changePlugin(e){

        let { logType,pluginType,timeRange,page,pageSize } = this.state
        let type = 'plugin'
        pluginType = e

        this.getCollectData(logType,pluginType,timeRange,e,type)

        this.getCollectList(logType,page,pageSize,pluginType,timeRange)
    }

    //选择日志类型
    changeLogType(e){

        let { logType,pluginType,timeRange } = this.state
        let type = 'log'
        logType = e

        this.getCollectData(logType,pluginType,timeRange,e,type)

    }

    render() {

        const {logTypeList,tableList,chartLoading,tableLoading} = this.state

        const columns = [
            {
                title: 'Hub状态',
                dataIndex: 'hubStatus',
                render: text => <div
                    className={Number(text) === EnumHubStatus.using.value ? styles[EnumHubStatus.using.className] : styles[EnumHubStatus.stop.className]}
                ><span /></div>
            },
            {
                title: '主机IP',
                dataIndex: 'hostIP',
                render: (text, record) => <span onClick={() => this.handleShowDetails(record)} className={styles.showHubDetails}>{text}</span>
            },
            {
                title: '插件类型',
                dataIndex: 'pluginType',
                key: 'pluginType'
            },
            {
                title: '插件状态',
                dataIndex: 'pluginStatus',
                render:(text,record,index)=>{
                    return Number(text)==EnumPluginStatus.using.value?EnumPluginStatus.using.label:EnumPluginStatus.stop.label
                }
            },
            {
                title: '插件数据消费',
                dataIndex: 'pluginData',
                render: text => <Progress
                    percent={Number(text) * 100}
                    status="active"
                    format={percent => percent.toFixed(1) + '%'}
                />

            },
        ];

        return (
            <div>
                <MainHeader title="采集监控" />

                <MainContent>
                    <Row>
                        <Col span={1}></Col>
                        <Col className={styles["col-text"]} span={2}>日志类型:</Col>
                        <Col span={3}>
                            <Select style={{ width: 150 }} onChange={(e)=>this.changeLogType(e)}>
                                {
                                    logTypeList.map((item,idx)=>{
                                        return <Option value={item.value} key={idx}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col className={styles["col-text"]} span={2}>插件类型:</Col>
                        <Col span={3}>
                            <Select style={{ width: 150 }} onChange={(e)=>this.changePlugin(e)}>
                                {
                                    EnumPluginTypes.map((item,idx)=>{
                                        return <Option value={item.value} key={idx}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col className={styles["col-text"]} span={2}>时间类型:</Col>
                        <Col span={3}>
                            <Select style={{ width: 150 }} onChange={(e)=>this.changeTime(e)}>
                                {
                                    EnumTimeRange.map((item,idx)=>{
                                        return <Option value={item.value} key={idx}>{item.label}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={8} />
                    </Row>
                    <Row className={styles["row-column"]}>
                        <Col span={1}></Col>
                        <Col span={22}>
                            <BoxContent isNotData = {this.state.chartData.xTime.length>0?false:true} loading = {chartLoading}>
                                <Column option={this.getOptions()}/>
                            </BoxContent>
                        </Col>
                        <Col span={1}></Col>
                    </Row>
                    <Row className={styles["row-table"]}>
                        <Col span={1}></Col>
                        <Col span={22}>
                            <BoxContent isNotData = {tableList.length>0?false:true} loading = {tableLoading}>
                                <Table columns={columns} dataSource={tableList} />
                            </BoxContent>
                        </Col>
                        <Col span={1}></Col>
                    </Row>
                </MainContent>
            </div>
        );
    }
}
