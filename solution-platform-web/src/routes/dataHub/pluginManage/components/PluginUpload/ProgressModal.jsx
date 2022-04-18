/**
 * Created by john on 2018/1/26.
 */
import PropTypes from 'prop-types';
import styles from './ProgressModal.scss'
import T from 'utils/T'
import { PureComponent } from 'react';
import { Modal,Row,Col,Progress} from 'antd';
import {
    doSubmit
} from '../../actions/pluginUpload'

@T.decorator.propTypes({

    plugin: PropTypes.object.isRequired,
    pluginName: PropTypes.string.isRequired,
    pluginDescribe: PropTypes.string.isRequired

})
export default class ProgressModal extends PureComponent{

    state = {
        visible: false,
        progressNumber:0,
        stru:'正在上传插件'
    }

    componentDidMount(){
       //提交
       this.submit()
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    /**
     * 取消
     */
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }

    /**
     * 确认
     */
    handleOk = () => {

        this.setState({
            visible:false
        })
    }

    /**
     * 提交
     */
    submit(){
        const { plugin, pluginName, pluginDescribe } = this.props

        //上传插件
        doSubmit(plugin, pluginName, pluginDescribe, (evt)=>{//上传进度回调

            let num = Math.floor((evt.loaded/evt.total)*100)
            let stru='正在上传插件...'

            if(evt.loaded>500){//接口报错时,不显示弹窗
                this.showModal();
            }

            if (num==100){
                stru = "上传完成,正在分析数据,请稍后..."
            }
            this.setState({
                progressNumber:num,
                stru
            })

        }).then((resp)=>{

            this.setState({
                visible:false
            })

            this.props.toPluginList()

        },(resp)=>{
            this.setState({
                visible:false
            })
            T.prompt.error(resp.msg)
        })
    }

    render(){

        return (
            <div className={styles["progress-btn"]}>
                <Modal
                    cancelText="取消"
                    okText="确定"
                    title="上传进度"
                    footer={null}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}

                >
                    <Row className={styles['row-progress']}>
                        <Col span={7}/>
                        <Col span={10} className={styles['col-progress']}>
                            <Progress type="circle" percent={this.state.progressNumber} />
                        </Col>
                        <Col span={7}/>
                    </Row>
                    <Row className={styles['row-stru']}>
                        <Col span={6}/>
                        <Col span={12} className={styles['col-stru']}>{this.state.stru}</Col>
                        <Col span={6}/>
                    </Row>

                </Modal>
            </div>
        )
    }
}
