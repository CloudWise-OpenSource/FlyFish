import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';

import { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { EnumUserStatusType } from 'constants/app/rbac/user';
import { doResetPassword } from '../../action/user';

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
                title="重置密码"
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
                            label="老密码"
                        >
                            {getFieldDecorator('old_password', {
                                initialValue: formData.old_password,
                                rules: [{ required: true, message: '请填写老密码!' }],
                            })(
                                <Input type="password" />
                            )}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="新密码"
                        >
                            {getFieldDecorator('new_password', {
                                initialValue: formData.new_password,
                                rules: [{ required: true, message: '请填写新密码!' }],
                            })(
                                <Input type="password" />
                            )}
                        </Form.Item>
                    </Form>
                </BoxContent>
            </Modal>
        );
    }
);

@T.decorator.propTypes({
    user_id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
})
export default class ResetPasswordModal extends PureComponent {
    state = {
        visible: false,
        saving: false,
        loading: false,

        data: {
            old_password: null,
            new_password: null,
        }
    };

    static defaultProps = {
        user_id: null
    };

    componentDidMount() {
        this.showModal();
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

            const { user_id } = this.props;
            const { old_password, new_password } = values;

            this.setState({ saving: true }, () => {
                const thenFn = [
                    () => {
                        form.resetFields();
                        this.setState({ saving: false });
                        this.handleCancel();
                        T.prompt.success('修改成功');
                    }, (resp) => {
                        this.setState({ saving: false });
                        T.prompt.error(resp.msg);
                    }
                ];

                doResetPassword(user_id, old_password, new_password).then(...thenFn);

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
