import T from 'utils/T';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { Modal, Input } from 'antd';
const { TextArea } = Input;
import {
    doGetConfigContent,
    doSaveConf
} from '../../actions/pluginConf';

@T.decorator.propTypes({
    fileName: PropTypes.string.isRequired,
    instanceId: PropTypes.string.isRequired,
    nodeIp: PropTypes.string.isRequired,
})
export default class ChangeConfModal extends PureComponent {

    state = {
        visible: true,
        confStr: ''
    }

    componentDidMount() {
        this.showModal();
        const { fileName, instanceId, nodeIp, nodePort } = this.props;

        const params = {
            fileName,
            instanceId,
            nodeIp,
            nodePort
        };

        doGetConfigContent(params).then((resp) => {
            this.setState({
                confStr: resp.data.content
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

        const { fileName, instanceId, nodeIp, nodePort } = this.props;

        let params = {
            content: this.state.confStr,
            fileName,
            instanceId,
            nodeIp,
            nodePort
        };
        doSaveConf(params).then((resp) => {

            this.setState({
                visible: false,
            });

        }, (resp) => {
            T.prompt.error(resp.msg);
        });

    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    /**
     *
     */
    changeText(e) {

        let val = e.target.value;
        this.setState({
            confStr: val
        });
    }
    render() {

        const { confStr } = this.state;

        return (
            <Modal
                title="修改配置"
                width={700}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                cancelText="取消"
                okText="提交"
            >
                <TextArea value={confStr}
                    disabled={false}
                    autosize={{ minRows: 20, maxRows: 25 }}
                    onChange={(e) => this.changeText(e)}
                />
            </Modal>
        );
    }
}
