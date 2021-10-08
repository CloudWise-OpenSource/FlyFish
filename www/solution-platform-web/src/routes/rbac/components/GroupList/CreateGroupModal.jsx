import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';

import { PureComponent } from 'react';
import { Modal, Form, Input, Radio, TreeSelect } from 'antd';
import { EnumIsChildGroupType } from 'constants/app/rbac/group';
import { doAddGroup, doUpdateGroup, doGetGroupDetail } from '../../action/group';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};

class CreateGroup extends PureComponent {

    constructor(props) {
        super();
		this.state = {
			is_children_group: props.formData.is_children_group
		};
	}

    handleIsChildrenChange = (e) => {
        this.setState({ is_children_group: e.target.value });
	}

    render() {
		const { visible, saving, loading, onCancel, onCreate, form, formData } = this.props;
		const { getFieldDecorator } = form;

		const treeData = formData.groupTree;

		return (
    <Modal
        visible={visible}
        title={formData.group_id ? '编辑分组' : '创建分组'}
        okText="保存"
        cancelText="取消"
        confirmLoading={saving}
        onCancel={onCancel}
        onOk={onCreate}
			>
        <BoxContent loading={loading}>
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label="是否为子分组"
						>
                    {getFieldDecorator('is_children_group', {
								initialValue: formData.is_children_group,
								rules: [{ required: true, message: '请填写分组名!' }],
							})(
    <Radio.Group onChange={this.handleIsChildrenChange}>
        {
										Object.values(EnumIsChildGroupType).map(item => <Radio key={item.value} value={item.value}>{item.label}</Radio>)
									}
    </Radio.Group>
							)}
                </Form.Item>

                {
							this.state.is_children_group == EnumIsChildGroupType.yes.value ? <Form.Item
    {...formItemLayout}
    label="父分组"
							>
    {getFieldDecorator('parent_group_id', {
									initialValue: formData.parent_group_id.toString(),
								})(
    <TreeSelect
        placeholder="Please select"
        treeDefaultExpandAll
        treeData={treeData}
    />
								)}
							</Form.Item> : null
						}

                <Form.Item
                    {...formItemLayout}
                    label="分组名"
						>
                    {getFieldDecorator('group_name', {
								initialValue: formData.group_name,
								rules: [{ required: true, message: '请填写分组名!' }],
							})(
    <Input />
							)}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="描述"
						>
                    {getFieldDecorator('description', {
								initialValue: formData.description,
							})(
    <Input.TextArea rows={4} />
							)}
                </Form.Item>
            </Form>
        </BoxContent>
    </Modal>
		);
    }
}
const CollectionCreateForm = Form.create()(CreateGroup);


@T.decorator.propTypes({
	groupTree: PropTypes.array,
	root_group_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	parent_group_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    group_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    getGroupList: PropTypes.func.isRequired
})
export default class CreateGroupModal extends PureComponent {
    state = {
        visible: false,
        saving: false,
        loading: false,

        data: {
            group_name: null,
            description: null,
        }
    };

    static defaultProps = {
		groupTree: [],
		root_group_id: null,
		parent_group_id: null,
        group_id: null,
    };

    componentDidMount() {
        this.showModal();
        const { group_id } = this.props;

        if (group_id) {
            this.setState({ loading: true }, () => {
                doGetGroupDetail(group_id).then((resp) => {
                    this.setState({
                        loading: false,
                        data: {
                            group_name: resp.data.group_name,
                            description: resp.data.description,
                        }
                    });
                }, (resp) => {
                    T.prompt.error(resp.msg);
                });
            });
        }
    }

    showModal = () => this.setState({ visible: true });

    handleCancel = () => this.setState({ visible: false });

    /**
     * 执行创建或编辑
     */
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) return false;

            const { group_id, root_group_id, getGroupList } = this.props;
            let { group_name, parent_group_id, is_children_group, description } = values;

            this.setState({ saving: true }, () => {
                const thenFn = [
                    () => {
                        form.resetFields();
                        getGroupList();
                        this.setState({ saving: false });
                        this.handleCancel();
                        T.prompt.success('保存成功');
                    }, (resp) => {
                        this.setState({ saving: false });
                        T.prompt.error(resp.msg);
                    }
                ];

				parent_group_id = is_children_group == EnumIsChildGroupType.no.value ? root_group_id : parent_group_id;

                if (!group_id) {
                    doAddGroup({ parent_group_id, group_name, description }).then(...thenFn);
                } else {
                    doUpdateGroup(group_id, { parent_group_id, group_name, description }).then(...thenFn);
                }

            });
        });
    }

	/**
     * 格式化分组树
	 * @param groupTree
	 * @returns {Array}
	 */
	formatGroupTree = (groupTree) => {
		let treeData = [];
		if (!groupTree) return treeData;

		for (let i = 0; i < groupTree.length; i++) {
			let { group_id, group_name, children } = groupTree[i];
			let group = {
				label: group_name,
				value: group_id.toString(),
				key: group_id,
				children: null
			};

			if (Array.isArray(children) && children.length > 0) {
				group.children = this.formatGroupTree(children);
			}

			treeData.push(group);
		}

		return treeData;
	};

    render() {
        return (
            <CollectionCreateForm
                ref={(form) => this.form = form}
                formData={{
					groupTree: this.formatGroupTree(this.props.groupTree),
                    group_id: this.props.group_id,
                    parent_group_id: this.props.parent_group_id,
					root_group_id: this.props.root_group_id,
                    is_children_group: this.props.parent_group_id == this.props.root_group_id ? EnumIsChildGroupType.no.value : EnumIsChildGroupType.yes.value,
                    ...this.state.data
                }}
                visible={this.state.visible}
                saving={this.state.saving}
                loading={this.state.loading}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
            />
        );
    }
}
