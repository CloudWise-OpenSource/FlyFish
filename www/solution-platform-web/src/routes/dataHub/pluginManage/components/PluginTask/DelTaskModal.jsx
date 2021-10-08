/**
 * Created by john on 2018/1/31.
 */
import styles from './DelTaskModal.scss';
import PropTypes from 'prop-types';
import T from 'utils/T';
import { PureComponent } from 'react';
import { Modal, Row, Col } from 'antd';

import {
    doDelTask
} from '../../actions/pluginTask';

@T.decorator.propTypes({

    instanceId: PropTypes.string.isRequired,
    nodeIp: PropTypes.string.isRequired,
    nodePort: PropTypes.number.isRequired,
    fileName: PropTypes.string.isRequired,
    getTaskList: PropTypes.func.isRequired,
})
export default class DelTaskModal extends PureComponent {

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
     * 确认删除
     */
    handleOk = () => {

        const { instanceId, nodeIp, nodePort, fileName } = this.props;

      doDelTask(instanceId, nodeIp, nodePort, fileName).then((resp) => {

          this.props.getTaskList();

          this.setState({
              visible: false
          });

          T.prompt.success('删除成功');

      }, (resp) => {
          T.prompt.error(resp.msg);
      });

    }

    render() {

        const { nodeIp, fileName, pluginType } = this.props;

        return (
            <Modal
                cancelText="取消"
                okText="提交"
                title="删除任务"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Row className={styles.row_sru_top}>
                    <Col span={2} />
                    <Col span={20} className={styles.col_sru_top}>
                        您正准备删除主机<span>{nodeIp}</span>上的插件<span>{pluginType}</span>的任务<span>{fileName}</span>
                    </Col>
                    <Col span={2} />
                </Row>
                <Row className={styles.row_sru_bottom}>
                    <Col span={2} />
                    <Col span={20}>
                        请确认
                    </Col>
                    <Col span={2} />
                </Row>

            </Modal>
        );
    }
}
