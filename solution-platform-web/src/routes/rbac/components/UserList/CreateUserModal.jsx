import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';

import { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { EnumUserStatusType } from 'constants/app/rbac/user';
import { doAddUser, doUpdateUser, doGetUserDetail } from '../../action/user';

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
                title={formData.user_id ? '编辑用户' : '创建用户'}
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
                            label="用户名"
                        >
                            {getFieldDecorator('user_name', {
                                initialValue: formData.user_name,
                                rules: [{ required: true, message: '请填写用户名!' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="邮箱"
                        >
                            {getFieldDecorator('user_email', {
                                initialValue: formData.user_email,
                                rules: [{ required: true, message: '请填写邮箱!' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="手机号"
                        >
                            {getFieldDecorator('user_phone', {
                                initialValue: formData.user_phone,
                                rules: [{ required: true, message: '请填写手机号!' }],
                            })(
                                <Input />
                            )}
                        </Form.Item>

                        {formData.user_id ? null :
                        <Form.Item
                            {...formItemLayout}
                            label="密码"
                            >
                            {getFieldDecorator('user_password', {
                                    initialValue: formData.user_password,
                                    rules: [{ required: true, message: '请填写密码!' }],
                                })(
                                    <Input type="password" />
                                )}
                        </Form.Item>
                        }
                        {!formData.user_id ? null :
                        <Form.Item
                            {...formItemLayout}
                            label="用户状态"
                            >
                            {getFieldDecorator('user_status', {
                                    initialValue: formData.user_status.toString(),
                                    rules: [{ required: true, message: '请填写用户状态!' }],
                                })(
                                    <Select>
                                        {
                                            Object.values(EnumUserStatusType).map(item => (
                                                EnumUserStatusType.all.value == item.value ? null : <Select.Option key={item.value} value={item.value.toString()}>{item.label}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                )}
                        </Form.Item>
                        }
                    </Form>
                </BoxContent>
            </Modal>
        );
    }
);

@T.decorator.propTypes({
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
    getUserList: PropTypes.func.isRequired
})
export default class CreateUserModal extends PureComponent {
    state = {
        visible: false,
        saving: false,
        loading: false,

        data: {
            user_name: null,
            user_email: null,
            user_phone: null,
            user_status: EnumUserStatusType.normal.value,
        }
    };

    static defaultProps = {
        user_id: null
    };

    componentDidMount() {
        this.showModal();
        const { user_id } = this.props;

        // 获取大屏详情
        if (user_id) {
            this.setState({ loading: true }, () => {
                doGetUserDetail(user_id).then((resp) => {
                    this.setState({
                        loading: false,
                        data: {
                            user_name: resp.data.user_name,
                            user_email: resp.data.user_email,
                            user_phone: resp.data.user_phone,
                            user_status: resp.data.user_status,
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

            const { user_id, getUserList } = this.props;
            const { user_name, user_email, user_phone, user_password, user_status } = values;

            this.setState({ saving: true }, () => {
                const thenFn = [
                    () => {
                        form.resetFields();
                        getUserList();
                        this.setState({ saving: false });
                        this.handleCancel();
                        T.prompt.success('保存成功');
                    }, (resp) => {
                        this.setState({ saving: false });
                        T.prompt.error(resp.msg);
                    }
                ];

                if (!user_id) {
                    doAddUser({ user_name, user_email, user_phone, user_password, user_status }).then(...thenFn);
                } else {
                    doUpdateUser(user_id, { user_name, user_email, user_phone, user_status }).then(...thenFn);
                }

            });
        });
    }

    render() {
        return (
            <CollectionCreateForm
                ref={(form) => this.form = form}
                formData={{
                    user_id: this.props.user_id,
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
