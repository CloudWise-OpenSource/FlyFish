/**
 * Created by chencheng on 17-8-31.
 */
import styles from './index.scss'
import T from 'utils/T'
import EnumRouter from 'constants/EnumRouter'
import ProgressModal from './ProgressModal'
import { MainHeader, MainContent } from 'templates/MainLayout';
import {Link} from 'react-router-dom'
import { PureComponent } from 'react';
import {Col,Row,Input,Icon,Button} from 'antd'

const {TextArea} = Input

@T.decorator.contextTypes('router','store')
export default class PluginUpload extends PureComponent {
    state = {
        fileName:'',
        plugin:{},
        pluginName:'',
        pluginDescribe:''
    }

    /**
     * 上传文件
     * @param e
     */
    upLoadFile(e){
        let plugin = e.target.files[0]
        this.setState({
            fileName:plugin.name,
            plugin
        })
    }

    /**
     * 保存插件名称
     * @param e
     */
    savePluginName(e){
        let pluginName = e.target.value
        this.setState({
            pluginName
        })
    }

    /**
     * 保存插件描述
     * @param e
     */
    savePluginStru(e){
        let pluginDescribe = e.target.value
        this.setState({
            pluginDescribe
        })
    }

    /**
     * 提交弹窗
     */
    submit(){
        const { plugin, pluginName, pluginDescribe} = this.state

        T.helper.renderModal(<ProgressModal
            plugin={plugin}
            pluginName = {pluginName}
            pluginDescribe = {pluginDescribe}
            toPluginList = {()=>this.toPluginList()}
        />);
    }

    /**
     * 返回插件列表
     */
    toPluginList(){

        this.context.router.history.push({
            pathname: EnumRouter.dHub_pluginList
        })
    }

    render() {
        return (
            <div>
                <MainHeader title="上传插件" rightRender={
                    <Link to={EnumRouter.dHub_pluginList}><Button type="primary"><Icon type="rollback"/>返回插件列表</Button></Link>}/>

                <MainContent>
                    <Row className={styles["upload-Row"]}>
                        <Col span={3}/>
                        <Col span={3} className={styles['col-text']}>插件上传</Col>
                        <Col span={6}>

                            <Button type="primary" icon="file" className={styles["file-select"]}>
                                选择文件
                                <input className={styles["file-inp"]} type="file"
                                       onChange={(e)=>this.upLoadFile(e)}
                                />
                            </Button>&nbsp;{this.state.fileName}
                        </Col>
                        <Col span={12}/>
                    </Row>
                    <Row className={styles["upload-Row"]}>
                        <Col span={3}></Col>
                        <Col span={3} className={styles['col-text']}>插件名称</Col>
                        <Col span={6}><Input onChange = {(e)=>this.savePluginName(e)}/></Col>
                    </Row>
                    <Row className={styles["upload-Row"]}>
                        <Col span={3}></Col>
                        <Col span={3} className={styles['col-text']}>插件描述</Col>
                        <Col span={15}><TextArea onChange={(e)=>this.savePluginStru(e)}/></Col>
                        <Col span={3}/>
                    </Row>
                    <Row className={styles["upload-Row"]}>
                        <Col span={11}/>
                        <Col span={2}>
                            <Button type="primary" onClick={()=>this.submit()}>上传</Button>
                        </Col>
                        <Col span={11}/>
                    </Row>
                </MainContent>
            </div>
        );
    }
}
