/**
 * Created by chencheng on 17-8-31.
 */
import T from 'utils/T';
import styles from './index.scss'
import Tj_Table from 'templates/ToolComponents/Table';
import EnumRouter from 'constants/EnumRouter'
import PluginDispatchModal from './PluginDispatchModal';
import UninstallPluginModal from './UninstallPluginModal'
import BoxContent from 'templates/ToolComponents/BoxContent'
import { PureComponent } from 'react';
import { EnumHubStatus,EnumPluginTypes } from 'constants/app/dataHub/index';
import {Link} from 'react-router-dom';
import { MainHeader, MainContent } from 'templates/MainLayout';
import {Button,Select} from 'antd'
const Option = Select.Option;
import {
    getPluginListAction,
    getHostListAction,
    doStartPlugin,
    doStopPlugin,
} from '../../actions/pluginList'

@T.decorator.contextTypes('router','store')
export default class PluginList extends PureComponent {

    /**
     * 分发插件弹窗
     * @param {Object} record 行数据
     */
    showPluginDispatch(record){
        const { pluginListParams } = this.props.PluginListReducer
        T.helper.renderModal(<PluginDispatchModal
            pluginListParams={pluginListParams}
            record = {record}
            getPluginList={() => this.getPluginList(pluginListParams)}
        />);
    }

    componentDidMount(){
        //获取插件列表
        this.getPluginList();
        //获取主机列表
        this.context.store.dispatch( getHostListAction())
    }

    getPluginList(){
        //获取插件列表
        const { pluginListParams } = this.props.PluginListReducer
        this.context.store.dispatch(getPluginListAction(pluginListParams))
    }

    /**
     * select模糊查询
     * @param {Array} value
     */
    changeHost(value){
        const { pluginListParams } = this.props.PluginListReducer
        pluginListParams.ipList = value
        //获取插件列表
        this.context.store.dispatch(getPluginListAction(pluginListParams))
    }

    /**
     * 启动插件
     * @param record
     */
    startPlugin(record){

        const { hostIp,instanceId,nodePort } = record
        const { pluginListParams } = this.props.PluginListReducer
        let self = this

        let params = {
            nodeIp:hostIp,
            instanceId,
            nodePort
        }
        doStartPlugin(params).then((resp)=>{

            //获取插件列表
            self.context.store.dispatch(getPluginListAction(pluginListParams))

        },(resp)=>{
            T.prompt.error(resp.msg)
        })
    }

    /**
     * 暂停插件
     * @param record
     */
    stopPlugin(record){

        const { hostIp,instanceId,nodePort } = record
        const { pluginListParams } = this.props.PluginListReducer
        let self = this

        let params = {
            nodeIp:hostIp,
            instanceId,
            nodePort
        }
        doStopPlugin(params).then((resp)=>{

            //获取插件列表
            self.context.store.dispatch(getPluginListAction(pluginListParams))

        },(resp)=>{
            T.prompt.error(resp.msg)
        })
    }

    /**
     * 卸载插件弹窗
     * @param record
     */
    unInstallPluginModal(record){

        const { pluginListParams } = this.props.PluginListReducer

        T.helper.renderModal(<UninstallPluginModal
            record={record}
            pluginListParams={pluginListParams}
            getPluginList={() => this.getPluginList(pluginListParams)}
        />);
    }

    /**
     * 分页
     * @param obj
     */
    changePage(obj){

        const {current} = obj
        let page = current
        const { pluginListParams } = this.props.PluginListReducer

        pluginListParams.page = page
        pluginListParams.ipList = []
        this.context.store.dispatch(getPluginListAction(pluginListParams))
    }

    /**
     * 合并行
     * @param {string} val
     * @param {number} pluginLen
     * @param {number} hostNum
     * @return {{children: *, props: {}}}
     */
    mergeRow(val,pluginLen,hostNum){
        const obj = {
            children: val,
            props: {},
        };

        if (hostNum==0){
            obj.props.rowSpan = pluginLen
        }else {
            obj.props.rowSpan = 0;
        }
        return obj
    }
    render() {

        const { pluginListData,loading,hostListData,pluginListParams,totalCount } = this.props.PluginListReducer
        const { page,pageSize } = pluginListParams
        let self = this
        const pagination ={
            current:page,
            pageSize:pageSize,
            total:totalCount
        }

        const columns = [{
            title: 'Hub状态',
            dataIndex: 'hubStatus',
            render:(value, row, index) => {

                let val = <div className={Number(value) === EnumHubStatus.using.value ? styles[EnumHubStatus.using.className] : styles[EnumHubStatus.stop.className]}><span></span></div>
                const { hostNum,pluginLen } = row
                return this.mergeRow(val,pluginLen,hostNum)
            }
        }, {
            title: '主机IP',
            dataIndex: 'hostIp',
            render: (value, row, index) => {

                let val = value
                const { hostNum,pluginLen } = row
                return this.mergeRow(val,pluginLen,hostNum)

            },
            key:'hostIp'
        }, {
            title: '插件名称',
            dataIndex: 'pluginName',
            key: 'pluginName',
        },
        {
            title: '插件类型',
            dataIndex: 'pluginType',
            render:(text)=>EnumPluginTypes.filter(item => item.value === text)[0].label
        },
        {
            title: '插件状态',
            dataIndex: 'pluginStatus',
            render:(text) => {
                return(Number(text)==EnumHubStatus.using.value?EnumHubStatus.using.label:EnumHubStatus.stop.label)
            }
        },
        {
            title: '任务',
            dataIndex: 'task',
            render:(text,record,index)=>{
                return(<Link to={{
                    pathname:EnumRouter.dHub_pluginTask,
                    search:`?instanceId=${record.instanceId}`+`&nodeIp=${record.hostIp}`+`&nodePort=${record.nodePort}`+`&pluginType=${record.pluginType}`
                }}>{"("+text+")"}</Link>)
            }
        },
        {
            title: 'worker',
            dataIndex: 'worker',
            render: (text,record,index) =>{
                return (<Link to={{
                    pathname:EnumRouter.dHub_pluginWorker,
                    search:`?instanceId=${record.instanceId}`+`&nodeIp=${record.hostIp}`+`&nodePort=${record.nodePort}`
                }}>查看</Link>)
            }
        },
        {
            title: '插件管理',
            dataIndex: 'pluginManage',
            render:(text, record) => {

                return(<div>
                    {
                        Number(record.pluginStatus)==EnumHubStatus.using.value?
                            <Button
                                className={styles.table_btn}
                                type="primary"
                                icon="minus-circle-o"
                                onClick={()=>this.stopPlugin(record)}
                            >
                                暂停插件
                            </Button>:
                            <Button
                                className={styles.table_btn}
                                type="primary"
                                icon="pause-circle-o"
                                onClick={()=>this.startPlugin(record)}
                            >
                                启动插件
                            </Button>
                    }


                        <Link to={{
                            pathname:EnumRouter.dHub_pluginConf,
                            search:`?instanceId=${record.instanceId}`+`&nodeIp=${record.hostIp}`+`&nodePort=${record.nodePort}`
                        }}>
                            <Button className={styles.table_btn} type="primary" icon="plus-square-o">配置</Button>
                        </Link>

                        <Link to={{
                            pathname:EnumRouter.dHub_pluginLog,
                            search:`?instanceId=${record.instanceId}`+`&nodeIp=${record.hostIp}`+`&nodePort=${record.nodePort}`
                        }}>
                            <Button className={styles.table_btn} type="primary" icon="book">查看日志</Button>
                        </Link>

                    <Button className={styles.table_btn} type="primary" icon="folder-add" onClick={()=>self.showPluginDispatch(record)}>分发插件</Button>
                    <Button className={styles.table_btn} type="danger" icon="download" onClick={()=>self.unInstallPluginModal(record)}>卸载</Button>
                </div>)
            }
        }
        ];

        return (
            <div>
                <MainHeader title="采集器" rightRender={

                    <Link to={{
                        pathname:EnumRouter.dHub_pluginUpload
                    }}>
                        <Button type="primary" icon="plus">上传插件</Button>
                    </Link>

                } />

                <MainContent>
                    <div>
                         <span className={styles.hostName}>主机列表</span>
                         <Select style={{width: 300}}  mode="tags" className={styles.host_sel} onChange={(value)=>this.changeHost(value)}>
                             {
                                 hostListData.map((item,idx)=>{
                                     return(<Option key={idx}  value={item.ip}>{item.ip}</Option>)
                                 })
                             }
                         </Select>
                    </div>
                    <BoxContent isNotData = {pluginListData.length>0?false:true} loading = {loading}>
                       <Tj_Table
                           pagination={pagination}
                           dataSource={pluginListData}
                           columns={columns}
                           onChange={(current)=>this.changePage(current)}
                       />
                    </BoxContent>
                </MainContent>
            </div>
        );
    }
}
