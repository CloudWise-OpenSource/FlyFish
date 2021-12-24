/**
 * Created by chencheng on 17-8-31.
 */
import styles from "./CategoriesModalCreate.scss";
import PropTypes from 'prop-types';
import T from 'utils/T';

import BoxContent from 'templates/ToolComponents/BoxContent'

import { Component } from 'react';
import { Row, Col, Input, Button, Select, Modal } from 'antd';

import { doGetCategoriesDetail, doAddCategories, doUpdateCategories } from "../../action/categories";

@T.decorator.propTypes({
	categories_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
    getCategoriesListCb: PropTypes.func.isRequired
})
export default class CategoriesModalCreate extends Component {
	static defaultProps = {
        categories_id: false,
        getCategoriesListCb: () => {}
	}

    constructor() {
        super();
        this.state = {
            fetching: false,    // 获取数据过程状态
            saving: false,      // 保存数据过程状态
			visible: false,		// 是否显示modal

            name: null,            // 名称
            type: null,      	   // 类型
        };
    }

	componentDidMount() {
    	this.setState({visible: true}, () => this.initData())
	}

	initData() {
		const { categories_id } = this.props;

		if (categories_id) {
			this.setState({fetching: true}, () => {
				doGetCategoriesDetail(categories_id).then(resp => {
					const {name, type} = resp.data;
					this.setState({
						fetching: false,
						name,
						type,
					});
				}, resp => {
					this.setState({fetching: false});
					T.prompt.error(resp.msg);
				})
			})
		}
	}

    /**
     * 保存模型
     */
    saveCategories = () => {
		const { name, type } = this.state;

		if (T.lodash.isEmpty(name)) {
			T.prompt.error("请填写名称");
			return false;
		}
		if (T.lodash.isEmpty(type)) {
			T.prompt.error("请填写分类标识！");
			return false;
		}

		this.setState({ saving: true }, () => {
			const { categories_id } = this.props;
			const isCreate = !categories_id;

			const thenParams = [
				() => {
					this.setState({saving: false, visible: false});
					this.props.getCategoriesListCb();
					T.prompt.success(isCreate ? '创建成功' : '修改成功');
				},

				resp => {
					this.setState({saving: false});
					T.prompt.error(resp.msg);
				}
			];

			if (isCreate) {
				doAddCategories(name, type).then(...thenParams);
			}else {
				doUpdateCategories(categories_id, name, type).then(...thenParams);
			}
		})
    }

    render() {
    	const { categories_id } = this.props;
        const { fetching, saving, visible } = this.state;
        return (
            <Modal
				wrapClassName={styles["v-categories-modal-create"]}
				title={!categories_id ? "创建分类": "编辑分类"}
				visible={visible}
				onCancel={() => this.setState({visible: false})}
				footer={[
					<Button key="back" onClick={() => this.setState({visible: false})}>取消</Button>,
					<Button key="submit" type="primary" loading={saving} onClick={this.saveCategories}>
						保存
					</Button>,
				]}
			>
				<BoxContent loading={fetching}>
					<Row className={styles["item-group"]} type="flex" align="middle">
						<Col span={4} offset={4}><span>名称:</span></Col>
						<Col span={10}><Input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value.trim() })} /></Col>
					</Row>

					<Row className={styles["item-group"]} type="flex" align="middle">
						<Col span={4} offset={4}><span>分类标识:</span></Col>
						<Col span={10}><Input value={this.state.type} onChange={(e) => this.setState({ type: e.target.value.trim() })} /></Col>
					</Row>

				</BoxContent>
			</Modal>
        );
    }
}
