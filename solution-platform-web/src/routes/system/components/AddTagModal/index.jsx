import React from 'react';
import { Modal, Form, Input } from 'antd';

import PropsType from 'prop-types';

import styles from './index.scss';

const noop = () => { };
const reg = /^[\u4e00-\u9fa5\w]*$/;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
};

const AddTagModal = ({
    visible,
    edit,
    loading,
    onCancel,
    onSubmit,
    form: {
        resetFields,
        getFieldDecorator,
        validateFields
    }
}) => {
    /**
     * @description 提交
     */
    const handleConfirm = () => {
        if (loading) return;
        validateFields((errors, values) => {
            if (!errors) {
                onSubmit(values);
            }
        });
    };

    const normalize = (value) => (value ? value.trim() : value);

    return (
        <Modal
            visible={visible}
            title={`${edit ? '编辑' : '新建'}标签`}
            onOk={handleConfirm}
            onCancel={() => { !loading && onCancel() }}
            afterClose={resetFields}
            okButtonProps={{ loading }}
            cancelButtonProps={{ loading }}
        >
            <Form layout="horizontal">
                <Form.Item label="标签名称" {...formItemLayout}>
                    {
                        getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入正确标签名称', min: 2, max: 20, whitespace: true, pattern: reg }],
                            normalize
                        })(
                            <Input placeholder="请输入标签名称" maxLength={20} />
                        )
                    }
                </Form.Item>
                <Form.Item label="标签描述" {...formItemLayout}>
                    {
                        getFieldDecorator('description', {
                            rules: [{ required: true, message: '请输入正确标签描述', min: 0, max: 50, whitespace: true, pattern: reg }],
                            normalize
                        })(
                            <Input.TextArea className={styles.addTagTextarea} row={3} placeholder="请输入标签描述" maxLength={50} />
                        )
                    }
                </Form.Item>
            </Form>
        </Modal>
    );
};

AddTagModal.defaultProps = {
    visible: false,
    edit: false,
    loading: false,
    onSubmit: noop,
    onCancel: noop,
    initialValue: {}
};

AddTagModal.propTypes = {
    visible: PropsType.bool.isRequired, // 弹窗状态
    edit: PropsType.bool.isRequired, // 是否为编辑状态
    loading: PropsType.bool.isRequired, // 是否在加载中
    onSubmit: PropsType.func.isRequired, // 提交
    onCancel: PropsType.func.isRequired, // 取消
    initialValue: PropsType.object, // 初始值
};

export default Form.create({
    // 处理初始默认值问题
    mapPropsToFields: ({ initialValue }) => Object.fromEntries(Object.entries(initialValue).map(([key, value]) => [
        key,
        Form.createFormField({
            value,
        })
    ]))
})(AddTagModal);
