/**
 * Created by chencheng on 17-8-31.
 */
import styles from "./OrgModalCreate.scss";
import PropTypes from 'prop-types';
// import pinyin from 'pinyin';
import T from 'utils/T';

import BoxContent from 'templates/ToolComponents/BoxContent'

import { Component } from 'react';
import { Row, Col, Input, Button, Modal } from 'antd';

import { doGetOrgDetail, doAddOrg, doUpdateOrg } from "../../action/organize";

@T.decorator.propTypes({
	org_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
    getOrgListCb: PropTypes.func.isRequired
})
export default class ComponentModalCreate extends Component {
	static defaultProps = {
        org_id: false,
        getOrgListCb: () => {}
	}

    constructor() {
        super();
        this.state = {
            fetching: false,    // 获取数据过程状态
            saving: false,      // 保存数据过程状态
			visible: false,		// 是否显示modal

            name: null,            	// 名称
            org_mark: null,         // 组织标识
            description: null, 		// 描述
        };
    }

	componentDidMount() {
    	this.setState({visible: true}, () => this.initData())
	}

	initData() {
		const { org_id } = this.props;
        if (org_id) {
            this.setState({fetching: true}, () => {
                doGetOrgDetail(org_id).then(resp => {
                    const {name, org_mark, description} = resp.data;
                    this.setState({
                        fetching: false,
                        name,
                        org_mark,
                        description,
                    });
                }, resp => {
                    this.setState({fetching: false});
                    T.prompt.error(resp.msg);
                })
            })
        }
	}

    /**
     * 保存
     */
    saveOrg = () => {
		const { name, org_mark, description } = this.state;

		if (T.lodash.isEmpty(name)) {
			T.prompt.error("名称不能空");
			return false;
		}

		if (T.lodash.isEmpty(org_mark)) {
			T.prompt.error("唯一标识不能空");
			return false;
		}

		this.setState({ saving: true }, () => {
			const { org_id } = this.props;
			const isCreate = !org_id;

			const thenParams = [
				() => {
					this.setState({saving: false, visible: false});
					this.props.getOrgListCb();
					T.prompt.success(isCreate ? '创建成功' : '修改成功');
				},

				resp => {
					this.setState({saving: false});
					T.prompt.error(resp.msg);
				}
			];

			if (isCreate) {
				doAddOrg({ name, org_mark, description }).then(...thenParams);
			}else {
				doUpdateOrg({ name, description, org_id }).then(...thenParams);
			}
		})
    }

    render() {
    	const { org_id } = this.props;
        const { fetching, saving, visible } = this.state;

        return (
            <Modal
				wrapClassName={styles["v-org-modal-create"]}
				title={!org_id ? "创建组织": "编辑组织"}
				visible={visible}
				onCancel={() => this.setState({visible: false})}
				footer={[
					<Button key="back" onClick={() => this.setState({visible: false})}>取消</Button>,
					<Button key="submit" type="primary" loading={saving} onClick={this.saveOrg}>
						保存
					</Button>,
				]}
			>
				<BoxContent loading={fetching}>
					<Row className={styles["item-group"]} type="flex" align="middle">
						<Col span={4} offset={4}><span>名称:</span></Col>
						<Col span={10}>
							<Input
								value={this.state.name}
								onChange={(e) => this.setState({
									name: e.target.value.trim(),
                                    // org_mark: !!org_id ? this.state.org_mark : pinyin(e.target.value.trim(),{
                                    //     style: pinyin.STYLE_NORMAL, // 设置拼音风格
                                    //     segment: true
                                    // }).join("_"),
								})}
							/>
						</Col>
					</Row>

                    <Row className={styles["item-group"]} type="flex" align="middle">
                        <Col span={4} offset={4}><span>唯一标识:</span></Col>
                        <Col span={10}><Input disabled={!!org_id} value={this.state.org_mark} onChange={(e) => this.setState({ org_mark: e.target.value.trim() })} /></Col>
                    </Row>

					<Row className={styles["item-group"]} type="flex" align="middle">
						<Col span={4} offset={4}><span>描述:</span></Col>
						<Col span={10}><Input.TextArea value={this.state.description} onChange={(e) => this.setState({ description: e.target.value.trim() })} /></Col>
					</Row>

				</BoxContent>
			</Modal>
        );
    }
}
