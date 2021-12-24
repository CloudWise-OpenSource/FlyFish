import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';

import { PureComponent } from 'react';
import { Button, Modal, Form, Input, Upload, Icon, Message, Select } from 'antd';
import {
    doAddScreen,
    doUpdateScreen,
    doGetScreenDetail,
    doCopyScreen,
} from '../../action/bigScreen';
import TagSelect from 'routes/common/components/TagSelect';
import { EnumScreenStatus } from '../../../../constants/app/dataVisual/bigScreen';

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

const beforeUpload = (file) => {
    if (file && file.size / 1024 / 1024 > 2) {
        Message.warn('上传文件不能超过 2M!');
    }
    return false;
};
const CollectionCreateForm = Form.create()((props) => {
    const {
        visible,
        saving,
        loading,
        onCancel,
        onCreate,
        form,
        formData,
    } = props;
    const { getFieldDecorator } = form;

    // 监听文件上传cover`
    const normFile = (e) => {
        if (Array.isArray(e)) return e;
        return e && [e.file];
    };

    let title = null;
    switch (formData.screen_title) {
        case 'add':
            title = '创建大屏';
            break;
        case 'edit':
            title = '编辑大屏';
            break;
        case 'copy':
            title = '复制大屏';
            break;
    }
    const { user, isAdmin } = T.auth.getLoginInfo() || {}
    const buttonProp = {
        disabled: formData.screen_title === 'edit' && !isAdmin && formData.create_user_id && formData.create_user_id !== user.user_id
    }
    return (
        <Modal
            visible={visible}
            title={title}
            okText="保存"
            cancelText="取消"
            confirmLoading={saving}
            okButtonProps = {buttonProp}
            onCancel={onCancel}
            onOk={onCreate}
        >
            <BoxContent loading={loading}>
                <Form>
                    <Form.Item {...formItemLayout} label="大屏名称">
                        {getFieldDecorator('name', {
                            initialValue: formData.name,
                            rules: [
                                { required: true, message: '请填写大屏名称!' },
                            ],
                        })(<Input placeholder="请填写大屏名称" />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="标签">
                        {getFieldDecorator('tag_id', {
                            initialValue: formData.tag_id,
                            rules: [
                                { required: true, message: '请选择标签!' },
                            ],
                        })(<TagSelect status={formData.screen_title === 'add' ? 1 : null} />)}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="封面">
                        {getFieldDecorator('cover', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                        })(
                            <Upload beforeUpload={beforeUpload} accept=".jpg, .jpeg, .png">
                                <Button>
                                    <Icon type="upload" /> 上传封面图片
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="大屏logo" extra="务必上传宽高比为1:1的logo">
                        {getFieldDecorator('logo', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                            rules: [
                                { required: formData.screen_title === 'add', message: '请上传大屏logo' }
                            ]
                        })(
                            <Upload beforeUpload={beforeUpload} accept=".jpg, .jpeg, .png">
                                <Button>
                                    <Icon type="upload" /> 上传大屏logo
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="大屏状态" extra="请及时更新大屏状态">
                        {getFieldDecorator('status', {
                            initialValue: formData.status || EnumScreenStatus.developing.value
                        })(
                            <Select>
                                {
                                    Object.values(EnumScreenStatus).map(({ label, value }) => (
                                        <Select.Option value={value} key={value}>{label}</Select.Option>
                                    ))
                                }
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </BoxContent>
        </Modal>
    );
});

@T.decorator.propTypes({
    screen_id: PropTypes.string,
    getScreenList: PropTypes.func.isRequired,
    screen_title: PropTypes.string.isRequired,
})
export default class CreateScreenModal extends PureComponent {
    static defaultProps = {
        screen_id: null,
        screen_title: null,
    };

    state = {
        visible: false,
        saving: false,
        loading: false,

        // 大屏详情内容
        screen: {
            name: null,
            tag_id: []
        },
    };

    componentDidMount() {
        this.showModal();
        const { screen_id } = this.props;

        // 获取大屏详情
        if (screen_id) {
            this.setState({ loading: true }, () => {
                doGetScreenDetail(screen_id).then(
                    ({ code, data }) => {
                        if (code) return;
                        const { name, tag_id, status,create_user_id } = data;
                        this.setState({
                            loading: false,
                            screen: {
                                name,
                                status,
                                tag_id,
                                create_user_id
                            },
                        });
                    },
                    (resp) => {
                        T.prompt.error(resp.msg);
                    }
                );
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

            const { screen_id, getScreenList, screen_title } = this.props;
            let { name, cover: [cover] = [], url, tag_id, status, logo: [logo] = [] } = values;
            tag_id = tag_id.join(',');

            console.log(values);


            this.setState({ saving: true }, () => {
                const thenFn = [
                    () => {
                        form.resetFields();
                        getScreenList();
                        this.setState({ saving: false });
                        this.handleCancel();
                        T.prompt.success('保存成功');
                    },
                    (resp) => {
                        this.setState({ saving: false });
                        T.prompt.error(resp.msg);
                    },
                ];

                switch (screen_title) {
                    case 'add':
                        doAddScreen(name, cover, url, tag_id, logo, status).then(...thenFn);
                        break;
                    case 'edit':
                        doUpdateScreen(screen_id, name, cover, url, tag_id, logo, status).then(
                            ...thenFn
                        );
                        break;
                    case 'copy':
                        doCopyScreen(screen_id, name, cover, url, tag_id, logo, status).then(
                            ...thenFn
                        );
                        break;
                }
            });
        });
    };

    render() {
        return (
            <CollectionCreateForm
                ref={(form) => (this.form = form)}
                formData={{
                    screen_id: this.props.screen_id,
                    screen_title: this.props.screen_title,
                    ...this.state.screen,
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
