/**
 * Created by chencheng on 17-8-31.
 */
import './index.scss'
import T from 'utils/T'
import EnumRouter from 'constants/EnumRouter'
import ChangeConfModal from './ChangeConfModal';
import Tj_Table from 'templates/ToolComponents/Table'
import { PureComponent } from 'react';
import { MainHeader, MainContent } from 'templates/MainLayout';
import {Button} from 'antd';
import {Link} from 'react-router-dom'
import {
    doGetConfFileList
} from '../../actions/pluginConf'

@T.decorator.contextTypes('router','store')
export default class PluginConf extends PureComponent {

    state = {
        confFileList:[],  //配置文件列表数据
        instanceId: '',
        nodeIp:'',
        nodePort:''
    }

    componentDidMount(){

        const  { instanceId,nodeIp,nodePort } = this.getQueryString()
        let params = {
            instanceId,
            nodeIp,
            nodePort
        }

        doGetConfFileList(params).then((resp)=>{

            const { fileList } = resp.data
            let confFileList = []

            fileList.map((item,idx)=>{

                idx = idx+1
                let obj = {
                    key: String(idx),
                    number: String(idx),
                    fileName: item,
                }
                confFileList.push(obj)

            })

            this.setState({
                instanceId,
                nodeIp,
                nodePort,
                confFileList
            })

        },(resp)=>{

            T.prompt.error(resp.msg)
        })

    }

    showPluginDispatch(record){
        const { fileName } = record
        const { instanceId,nodeIp,nodePort} = this.state

        T.helper.renderModal(<ChangeConfModal fileName ={fileName} instanceId={instanceId} nodeIp={nodeIp}  nodePort={nodePort} />);
    }

    getQueryString = () => T.queryString.parse(this.context.router.route.location.search);

    render() {

        const { confFileList } = this.state
        let search = this.getQueryString()
        let self = this

        const columns = [
            {
                title: '序号',
                dataIndex: 'number',
                key: 'number',
            },
            {
                title: '文件名称',
                dataIndex: 'fileName',
                key: 'fileName',
            },
            {
                title: '操作',
                dataIndex: 'operator',
                render:function (text,record,index) {
                    return(<div>
                        <Button type="primary" icon="edit" onClick={() => self.showPluginDispatch(record)}>修改</Button>
                    </div>)
                }
            }
        ];

        return (
            <div>
                <MainHeader title={search.nodeIp+">插件配置"}  rightRender={
                    <Link to={EnumRouter.dHub_pluginList}><Button type="primary" icon="rollback">返回插件列表</Button></Link>
                } />

                <MainContent>
                    <Tj_Table className="config-model" pagination={false} dataSource={confFileList} columns={columns} />
                </MainContent>
            </div>
        );
    }
}
