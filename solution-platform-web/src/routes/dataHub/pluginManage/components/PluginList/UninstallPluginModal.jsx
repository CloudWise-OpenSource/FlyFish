/**
 * Created by john on 2018/1/25.
 */
import PropTypes from 'prop-types';
import styles from './UninstallPluginModal.scss';
import T from 'utils/T';
import { PureComponent } from 'react';
import { Modal, Row, Col } from 'antd';
import {
    doUnInstallPlugin
} from '../../actions/pluginList';

@T.decorator.propTypes({
    getPluginList: PropTypes.func.isRequired,
    pluginListParams: PropTypes.object.isRequired,
    record: PropTypes.object.isRequired,

})
export default class UninstallPluginModal extends PureComponent {

    state = {
        visible: true,
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
        this.unInstallPlugin();
    }

    /**
     * 卸载插件
     */
    unInstallPlugin() {

        const { pluginListParams, record } = this.props;
        const { hostIp, instanceId, nodePort } = record;

        let params = {
            nodeIp: hostIp,
            instanceId,
            nodePort
        };

        doUnInstallPlugin(params).then((resp) => {

            this.setState({
                visible: false,
            });
            this.props.getPluginList(pluginListParams);

        }, (resp) => {

            T.prompt.error(resp.msg);

        });
    }
    render() {
        const { record } = this.props;

        return (
            <Modal
                cancelText="取消"
                okText="提交"
                title="卸载插件"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Row className={styles.row_sru_top}>
                    <Col span={2} />
                    <Col span={20} className={styles.col_sru_top}>
                        您正准备卸载主机<span>{record.hostIp}</span>上的插件<span>{record.pluginType}</span>
                    </Col>
                    <Col span={2} />
                </Row>
                <Row className={styles.row_sru_bottom}>
                    <Col span={2} />
                    <Col span={20} className={styles.col_sru_bottom}>
                        插件一旦卸载，将不再执行采集任务！
                    </Col>
                    <Col span={2} />
                </Row>
            </Modal>
        );
    }
}
