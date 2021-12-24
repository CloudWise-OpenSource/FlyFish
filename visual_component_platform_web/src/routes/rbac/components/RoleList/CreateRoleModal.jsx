import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';

import { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';
import { doAddRole, doUpdateRole, doGetRoleDetail } from '../../action/role';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};

const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, saving, loading, onCancel, onCreate, form, formData } = props;
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                title={formData.role_id ? '编辑角色' : '创建角色'}
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
                            label="角色名"
                        >
                            {getFieldDecorator('role_name', {
                                initialValue: formData.role_name,
                                rules: [{ required: true, message: '请填写角色名!' }],
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
);

@T.decorator.propTypes({
    role_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    getRoleList: PropTypes.func.isRequired
})
export default class CreateRoleModal extends PureComponent {
    state = {
        visible: false,
        saving: false,
        loading: false,

        data: {
            role_name: null,
            description: null,
        }
    };

    static defaultProps = {
        role_id: null
    };

    componentDidMount() {
        this.showModal();
        const { role_id } = this.props;

        if (role_id) {
            this.setState({ loading: true }, () => {
                doGetRoleDetail(role_id).then((resp) => {
                    this.setState({
                        loading: false,
                        data: {
                            role_name: resp.data.role_name,
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

            const { role_id, getRoleList } = this.props;
            const { role_name, description } = values;

            this.setState({ saving: true }, () => {
                const thenFn = [
                    () => {
                        form.resetFields();
                        getRoleList();
                        this.setState({ saving: false });
                        this.handleCancel();
                        T.prompt.success('保存成功');
                    }, (resp) => {
                        this.setState({ saving: false });
                        T.prompt.error(resp.msg);
                    }
                ];

                if (!role_id) {
                    doAddRole({ role_name, description }).then(...thenFn);
                } else {
                    doUpdateRole(role_id, { role_name, description }).then(...thenFn);
                }

            });
        });
    }

    render() {
        return (
            <CollectionCreateForm
                ref={(form) => this.form = form}
                formData={{
                    role_id: this.props.role_id,
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
