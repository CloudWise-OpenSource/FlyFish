/**
 * Created by chencheng on 17-8-31.
 */
import './index.scss'
import T from 'utils/T';
import EnumRouter from 'constants/EnumRouter'
import Tj_Table from 'templates/ToolComponents/Table'
import LookLogModal from './LookLogModal';
import { PureComponent } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import {Button,Icon} from 'antd'
import {Link} from 'react-router-dom'
import {
    doGetLogList
} from '../../actions/pluginLog'

@T.decorator.contextTypes('router','store')
export default class PluginLog extends PureComponent {

    state = {
        logList:[]  //日志列表
    }

    showPluginDispatch(record){
        const {instanceId,nodeIp,nodePort,fileName} = record
        T.helper.renderModal(<LookLogModal
            instanceId ={instanceId}
            nodeIp={nodeIp}
            nodePort ={nodePort}
            fileName ={fileName}
        />);
    }
    getQueryString = () => T.queryString.parse(this.context.router.route.location.search);

    componentDidMount(){

        const {instanceId,nodeIp,nodePort} = this.getQueryString()

        doGetLogList(instanceId,nodeIp,nodePort).then((resp)=>{

                let logList = this.dataFormat(resp.data)
                this.setState({
                    logList
                })

        },(resp)=>{
             T.prompt.error(resp.msg)
        })
    }

    //数据格式化
    dataFormat(data){
        let arr = []
        const { fileList,instanceId,nodeIp,nodePort} = data
        fileList.map((item,idx)=>{
            let obj = {
                key:String(idx),
                num:idx+1,
                instanceId,
                nodeIp,
                nodePort,
                fileName:item
            }
            arr.push(obj)
        })

        return arr
    }
    render() {

        let search = this.getQueryString()
        const { logList } = this.state

        const dataSource = [{
            key: '1',
            number: '1',
            fileName: '文件1',
        }, {
            key: '2',
            number: '2',
            fileName: '文件2',
        }];

        const columns = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
            },
            {
                title: '文件名称',
                dataIndex: 'fileName',
                key: 'fileName',
            },
            {
                title: '操作',
                dataIndex: 'operator',
                render:(text, record, index)=> {
                    return(<div>
                        <Button type="primary" icon="book" onClick={() => this.showPluginDispatch(record)}>查看</Button>
                    </div>)
                }
            }
        ];

        return (
            <div>
                <MainHeader title={search.nodeIp+">插件日志"} rightRender={
                    <Link to={EnumRouter.dHub_pluginList}><Button type="primary" icon="rollback">返回插件列表</Button></Link>
                } />

                <MainContent>
                    <Tj_Table dataSource={logList} columns={columns} />
                </MainContent>
            </div>
        );
    }
}
