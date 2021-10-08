/**
 * Created by chencheng on 17-8-31.
 */
import styles from './ComponentModalCreate.scss';
import PropTypes from 'prop-types';
import T from 'utils/T';

import BoxContent from 'templates/ToolComponents/BoxContent';

import { Component } from 'react';
import { Row, Col, Input, Button, Modal } from 'antd';

import { doGetComponentDetail, doAddComponent, doUpdateComponent } from '../../action/component';
@T.decorator.propTypes({
	component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
	getComponentListCb: PropTypes.func.isRequired
})
export default class ComponentModalCreate extends Component {
	static defaultProps = {
		component_id: false,
		getComponentListCb: () => { }
	}

	constructor() {
		super();
		this.state = {
			fetching: false,    // 获取数据过程状态
			saving: false,      // 保存数据过程状态
			visible: false,		// 是否显示modal

			name: null,            		// 名称
			component_mark: null, 		// 组件标识
			create_user_id: null
		};
	}

	componentDidMount() {
		this.setState({ visible: true }, () => this.initData());
	}

	filterDataByAdmin = (data) => {
		const { isAdmin } = T.auth.getLoginInfo() || {};
		return isAdmin ? data : data.filter((item) => {
			return item.name !== '公共组件';
		});
	}

	initData() {
		const { component_id } = this.props;
		if (component_id) {
			this.setState({ fetching: true }, () => {
				T.request.all(doGetComponentDetail(component_id)).then(resp => {
					const [componentResp] = resp;
					const { name, component_mark, create_user_id } = componentResp.data;
					this.setState({
						fetching: false,
						name,
						component_mark,
						create_user_id: create_user_id,
					});
				}, resp => {
					this.setState({ fetching: false });
					T.prompt.error(resp.msg);
				});
			});
		}
	}

	/**
	 * 保存模型
	 */
	saveComponent = () => {
		const { name, component_mark } = this.state;

		if (T.lodash.isEmpty(name)) {
			T.prompt.error('名称不能为空！');
			return false;
		}
		if (T.lodash.isEmpty(component_mark)) {
			T.prompt.error('组件标识不能为空！');
			return false;
		}

		this.setState({ saving: true }, () => {
			const { component_id } = this.props;
			const isCreate = !component_id;

			const thenParams = [
				() => {
					this.setState({ saving: false, visible: false });
					this.props.getComponentListCb();
					T.prompt.success(isCreate ? '创建成功' : '修改成功');
				},

				resp => {
					this.setState({ saving: false });
					T.prompt.error(resp.msg);
				}
			];

			if (isCreate) {
				doAddComponent({ name, component_mark }).then(...thenParams);
			} else {
				doUpdateComponent({ name, component_id }).then(...thenParams);
			}
		});
	}

	render() {
		const { component_id } = this.props;
		const { fetching, saving, visible, create_user_id } = this.state;
		const { user, isAdmin } = T.auth.getLoginInfo() || {};
		return (
    <Modal
        wrapClassName={styles['v-component-modal-create']}
        title={!component_id ? '创建组件' : '编辑组件'}
        visible={visible}
        onCancel={() => this.setState({ visible: false })}
        footer={[
            <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>,
            <Button
                key="submit"
                type="primary"
                loading={saving}
                onClick={this.saveComponent}
                disabled={(component_id && !isAdmin && create_user_id && create_user_id !== user.user_id)}
					>
                保存
            </Button>,
				]}
			>
        <BoxContent loading={fetching}>
            <Row className={styles['item-group']} type="flex" align="middle">
                <Col span={4} offset={4}><span>名称:</span></Col>
                <Col span={10}><Input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value.trim() })} /></Col>
            </Row>

            <Row className={styles['item-group']} type="flex" align="middle">
                <Col span={4} offset={4}><span>组件标识:</span></Col>
                <Col span={10}><Input disabled={!!component_id} value={this.state.component_mark} onChange={(e) => this.setState({ component_mark: e.target.value.trim() })} /></Col>
            </Row>
        </BoxContent>
    </Modal>
		);
	}
}

