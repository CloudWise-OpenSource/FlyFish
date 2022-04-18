/**
 * Created by john on 2018/1/24.
 */
import styles from './index.scss'
import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter'
import Tj_Table from 'templates/ToolComponents/Table';
import CreateTaskModal from './CreateTaskModal'
import EditTaskModal from './EditTaskModal'
import DelTaskModal from './DelTaskModal'
import { PureComponent } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import { Button,Row,Col } from 'antd'
import { Link } from 'react-router-dom'
import {
    doGetTaskList
} from '../../actions/pluginTask'

@T.decorator.contextTypes('router','store')
export default class PluginTask extends PureComponent {

    state = {
        pluginType:'',
        nodeIp:'',
        instanceId:'',
        nodePort:'',
        taskList:[]  //任务列表数据
    }

    componentDidMount(){

        this.getTaskList()
    }

    getQueryString = () => T.queryString.parse(this.context.router.route.location.search);

    /**
     * 获取任务列表
     */
    getTaskList(){
        const { instanceId,nodeIp,nodePort,pluginType } = this.getQueryString()

        this.setState({
            pluginType,
            nodeIp,
            instanceId,
            nodePort
        })
        /**
         * 获取任务列表
         */
        doGetTaskList( instanceId,nodeIp,nodePort ).then((resp)=>{

            let data = this.dataFormat(resp.data)
            this.setState({
                taskList:data
            })
        },(resp)=>{
            T.prompt.error(resp.msg)
        })
    }
    /**
     * 显示编辑弹窗
     */
    showEditModal(record){

        const { instanceId,nodeIp,nodePort,fn } = record

        T.helper.renderModal(<EditTaskModal
            instanceId={instanceId}
            nodeIp={nodeIp}
            nodePort={nodePort}
            fileName={fn}
            getTaskList={()=>this.getTaskList()}
        />);
    }

    /**
     * 显示创建弹窗
     */
    showCreateModal(){
        const { instanceId,nodeIp,nodePort } = this.state
        T.helper.renderModal(<CreateTaskModal
             instanceId={instanceId}
             nodeIp={nodeIp}
             nodePort={nodePort}
             getTaskList={()=>this.getTaskList()}
        />);
    }
    /**
     * 数据格式化
     * @param data
     */
    dataFormat(data){

        const { instanceId,nodeIp,nodePort,jobList } = data

        let obj = {
            key:'',
            number:'',
            taskName:'',
            fn:'',
            instanceId:'',
            nodeIp:'',
            nodePort:''
        }

        let arr = []

        jobList.map((item,idx)=>{

            const { taskName,fn } = item

            obj ={
                key:String(idx),
                number:idx+1,
                taskName,
                fn,
                instanceId,
                nodeIp,
                nodePort
            }

            arr.push(obj)

        })

        return arr
    }

    //显示删除弹窗
    showDelModal(record){

        const { instanceId,nodeIp,nodePort,fn } = record

        T.helper.renderModal(<DelTaskModal
            instanceId={instanceId}
            nodeIp={nodeIp}
            nodePort={nodePort}
            fileName={fn}
            pluginType={this.state.pluginType}
            getTaskList={()=>this.getTaskList()}
        />)
    }
    render() {

        const { taskList } = this.state
        let self = this

        const columns = [
            {
                title: '序号',
                dataIndex: 'number',
                key: 'number',
            },
            {
                title: 'worker名称',
                dataIndex: 'taskName',
                key: 'taskName',
            },
            {
                title: '操作',
                dataIndex: 'operator',
                render:function (text, record, index) {
                    return(<div>
                        <Button className={styles['task-edit']} type="primary" icon="edit" onClick={() => self.showEditModal(record)}>编辑</Button>
                        <Button className={styles['task-del']} type="primary" icon="close" onClick={() => self.showDelModal(record)}>删除任务</Button>
                    </div>)
                }
            }
        ];

        return (
            <div>
                <MainHeader title="任务" rightRender={
                    <div>
                        <Link to={EnumRouter.dHub_pluginList}><Button type="primary" icon="rollback">返回插件列表</Button></Link>
                        <Button type="primary" icon="plus" className={styles['creat-btn']} onClick={()=>this.showCreateModal()}>新建任务</Button>
                    </div>
                } />

                <MainContent>
                    <Row>
                        <Col span={24} style={{fontSize:14}}>主机:{this.state.nodeIp}</Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{fontSize:14}}>插件:{this.state.pluginType}</Col>
                    </Row>
                    <Tj_Table pagination={false} dataSource={taskList} columns={columns} />
                </MainContent>
            </div>
        );
    }
}
