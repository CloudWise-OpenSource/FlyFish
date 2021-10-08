/**
 * Created by john on 2018/1/24.
 */
import styles from './index.scss'
import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter'
import Tj_Table from 'templates/ToolComponents/Table'
import { PureComponent } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import { EnumWorkStatus } from 'constants/app/dataHub/index'
import {Button} from 'antd'
import {Link} from 'react-router-dom'
import {
    doGetWorkerList,
    doStartWorker,
    doStopWorker
} from '../../actions/pluginWorker'

@T.decorator.contextTypes('router','store')
export default class PluginWorker extends PureComponent {

    state = {
       workerList:[],  //worker列表
        time:10  //计时
    }

    componentDidMount(){

        this.getWorkerList()
    }

    getQueryString = () => T.queryString.parse(this.context.router.route.location.search);

    /**
     * 获取worker列表
     */
    getWorkerList(){

        const {instanceId,nodeIp,nodePort} = this.getQueryString()

        doGetWorkerList(instanceId,nodeIp,nodePort).then((resp)=>{

            let workerList = this.dataFormat(resp.data)

            this.setState({
                workerList
            })

        },(resp)=>{

            T.prompt.error(resp.msg)
        })
    }

    /**
     * 数据格式化
     * @param data
     * @return {Array}
     */
    dataFormat(data){

        let arr = []

        data.map((item,idx)=>{

            const {nodeIp,workName,status,id,num} = item

            let obj = {
                key:String(idx),
                nodeIp,
                workName,
                status,
                id,
                num

            }

            arr.push(obj)
        })

        return arr

    }

    /**
     * 开启worker
     * @param record
     */
    startWorker(record,index){

        const { workerList } = this.state
        const {instanceId,nodeIp,nodePort} = this.getQueryString()
        const { workName } = record
        let num = 10

        workerList[index].status = 2

        this.setState({
            workerList
        })

        doStartWorker(instanceId,nodeIp,nodePort,workName).then((resp)=>{

        },(resp)=>{

            T.prompt.error(resp.msg)
            this.getWorkerList()

        })

        let timer = window.setInterval(()=>{

            num = num-1

            this.setState({
                time:num
            })

            if(num == 0){

                window.clearInterval(timer)

                this.getWorkerList()

            }

        },1000)
    }

    /**
     * 暂停worker
     * @param record
     */
    stopWorker(record,index){

        const { workerList } = this.state
        const {instanceId,nodeIp,nodePort} = this.getQueryString()
        const { workName } = record

        workerList[index].status = 2
        let num = 10

        this.setState({
            workerList
        })

        doStopWorker(instanceId,nodeIp,nodePort,workName).then((resp)=>{

        },(resp)=>{

            T.prompt.error(resp.msg)
            this.getWorkerList()
        })

        let timer = window.setInterval(()=>{

            num = num-1

            this.setState({
                time:num
            })

            if(num == 0){

                window.clearInterval(timer)
                this.getWorkerList()

            }

        },1000)

    }

    render() {

        const { workerList } = this.state

        const columns = [
            {
                title: 'worker状态',
                dataIndex: 'status',
                render:function (text, record, index) {
                    return <div className={Number(text) === EnumWorkStatus.start.value ? styles[EnumWorkStatus.start.className] : styles[EnumWorkStatus.stop.className]}><span></span></div>
                }
            },
            {
                title: '主机IP',
                dataIndex: 'nodeIp',
                key: 'nodeIp',
            },
            {
                title: 'worker名称',
                dataIndex: 'workName',
                key: 'workName',
            },
            {
                title: '操作',
                dataIndex: 'operator',
                render: (text, record, index) => {

                    if (Number(record.status)==EnumWorkStatus.start.value){

                        return <Button type="primary" icon="pause-circle-o" onClick={()=>this.startWorker(record,index)}>开启worker</Button>

                    }else if(Number(record.status)==EnumWorkStatus.stop.value){

                        return <Button type="primary" icon="minus-circle-o" onClick={()=>this.stopWorker(record,index)}>暂停worker</Button>

                    }else if(Number(record.status==EnumWorkStatus.countDown.value)) {

                        return this.state.time

                    }else{

                    }

                }
            }
        ];

        return (
            <div>
                <MainHeader title="worker" rightRender={
                    <Link to={EnumRouter.dHub_pluginList}><Button type="primary" icon="rollback">返回插件列表</Button></Link>
                } />

                <MainContent>
                    <Tj_Table pagination={false} dataSource={workerList} columns={columns} />
                </MainContent>

            </div>
        );
    }
}
