import { PureComponent } from 'react';
import { Modal, Input } from 'antd';
import T from 'utils/T';
const { TextArea } = Input;
import {
    doGetLogContent
} from '../../actions/pluginLog';
export default class LookLogModal extends PureComponent {
    state = {
        visible: true,
        content: ''
    }

    componentDidMount() {

        const { instanceId, nodeIp, nodePort, fileName } = this.props;
        // 获取日志内容
        doGetLogContent(instanceId, nodeIp, nodePort, fileName).then((resp) => {

            this.setState({
                content: resp.data.content
            });
        }, (resp) => {
           T.prompt.error(resp.msg);
        });
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

    render() {
        return (
            <Modal
                cancelText="取消"
                okText="确定"
                title="查看日志"
                width={700}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >{
                <TextArea value={this.state.content} disabled={false} autosize={{ minRows: 20, maxRows: 25 }} />
            }

            </Modal>
        );
    }
}
