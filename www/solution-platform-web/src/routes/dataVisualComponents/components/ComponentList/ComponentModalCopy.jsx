/**
 * Created by chencheng on 17-8-31.
 */
import styles from './ComponentModalCreate.scss';
import PropTypes from 'prop-types';
import T from 'utils/T';

import BoxContent from 'templates/ToolComponents/BoxContent';

import { Component } from 'react';
import { Row, Col, Input, Button, Modal } from 'antd';

import { doGetComponentDetail, doCopyComponent } from '../../action/component';

@T.decorator.propTypes({
	component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
})
export default class ComponentModalCreate extends Component {
	static defaultProps = {
        component_id: false,
	}

    constructor() {
        super();
        this.state = {
            fetching: false,    // 获取数据过程状态
            saving: false,      // 保存数据过程状态
			visible: false,		// 是否显示modal

            target_component_mark: null, 		// 组件标识
        };
    }

	componentDidMount() {
    	this.setState({ visible: true }, () => this.initData());
	}

	initData() {
		const { component_id } = this.props;
		this.setState({ fetching: true }, () => {
            T.request.all(doGetComponentDetail(component_id)).then(resp => {
                const [componentResp] = resp;
                const { name, component_mark } = componentResp.data;
                this.setState({
                    fetching: false,
                    name,
                    target_component_mark: component_mark,
                });
            }, resp => {
                this.setState({ fetching: false });
                T.prompt.error(resp.msg);
            });
		});
	}

    /**
     * 保存模型
     */
    saveComponent = () => {
		const { target_component_mark } = this.state;


		this.setState({ saving: true }, () => {
			const { component_id } = this.props;

			const thenParams = [
				() => {
					this.setState({ saving: false, visible: false });
					T.prompt.success('复制成功');
				},

				resp => {
					this.setState({ saving: false });
					T.prompt.error(resp.msg);
				}
			];

            doCopyComponent({ component_id, target_component_mark }).then(...thenParams);
		});
    }

    render() {
        const { fetching, saving, visible } = this.state;

        return (
            <Modal
                wrapClassName={styles['v-component-modal-create']}
                title="复制组件"
                visible={visible}
                onCancel={() => this.setState({ visible: false })}
                footer={[
                    <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>,
                    <Button key="submit" type="primary" loading={saving} onClick={this.saveComponent}>
                        确定
                    </Button>,
				]}
			>
                <BoxContent loading={fetching}>
                    <Row className={styles['item-group']} type="flex" align="middle">
                        <Col span={4} offset={4}><span>目标组件标识:</span></Col>
                        <Col span={10}><Input value={this.state.target_component_mark} onChange={(e) => this.setState({ target_component_mark: e.target.value.trim() })} /></Col>
                    </Row>
                </BoxContent>
            </Modal>
        );
    }
}
