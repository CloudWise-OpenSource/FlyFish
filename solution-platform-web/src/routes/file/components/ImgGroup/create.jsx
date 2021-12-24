/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { MainContent } from 'templates/MainLayout';
import { Modal, Row, Col, Button, Icon, Input } from 'antd';
const { TextArea } = Input;

@T.decorator.contextTypes('store')
export default class Create extends PureComponent {
    state = {
        file: null,
        name: '',
        flag: ''
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.oldName != this.props.oldName) {
            this.setState({ name: nextProps.oldName });
        }
    }

    render() {
        const { visible, saving, onCancel, onCreate, isCreate, oldName } = this.props;
        const { name, flag } = this.state;

        return (
            <Modal visible={visible}
                title={isCreate ? '添加分组' : '更新分组名称'}
                okText="保存"
                cancelText="取消"
                confirmLoading={saving}
                onCancel={onCancel}
                maskClosable={true}
                onOk={onCreate.bind(this, name, flag)}>

                <MainContent>
                    <BoxContent>
                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>分组名称</span></Col>
                            <Col span={19}>
                                <Input placeholder="输入分组名称" defaultValue={oldName} onChange={(e) => {
                                    this.setState({ name: e.target.value });
                                }}
                                />
                                {/* <Input <Input placeholder="Basic usage" /> /> */}
                            </Col>
                        </Row>

                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>分组标识符</span></Col>
                            <Col span={19}>
                                <Input disabled={!isCreate} placeholder="输入唯一标识符" onChange={(e) => {
                                    this.setState({ flag: e.target.value });
                                }}
                                />
                            </Col>
                        </Row>
                    </BoxContent>
                </MainContent>
            </Modal>
        );
    }
}