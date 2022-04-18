/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import BoxContent from 'templates/ToolComponents/BoxContent';
import { PureComponent } from 'react';
import { MainContent } from 'templates/MainLayout';
import { Modal, Row, Col, Button, Icon, Input, Select } from 'antd';
const { TextArea } = Input;
const { Option } = Select;

import { getImgGroupListAction } from '../../action/imgGroup'

@T.decorator.contextTypes('store')
export default class UploadImg extends PureComponent {
    state = {
        file: null,
        name: '',
        desc: '',
        extendDesc: '',
        group_id: '',
    }

    componentDidMount() {
        this.context.store.dispatch(getImgGroupListAction(1, true));
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.imgGroupList != this.props.imgGroupList && nextProps.imgGroupList.length > 0){
            this.setState({ group_id: nextProps.imgGroupList[0].id})
        }
        if (nextProps.oldName != this.props.oldName || nextProps.oldDesc != this.props.oldDesc || nextProps.oldExtendDesc != this.props.oldExtendDesc){
            const { oldName, oldDesc, oldExtendDesc } = nextProps;
            this.setState({ name: oldName, desc: oldDesc, extendDesc: oldExtendDesc })
        }
    }

    render() {
        const { visible, saving, onCancel, onCreate, isUpload, imgGroupList, oldDesc, oldName, oldExtendDesc } = this.props;
    
        const { name, file, desc, extendDesc, group_id } = this.state;

        return (
            <Modal visible={visible}
                title={isUpload ? "更新图片" : "上传图片"}
                okText="保存"
                cancelText="取消"
                confirmLoading={saving}
                onCancel={onCancel}
                maskClosable={true}
                onOk={onCreate.bind(this, file, name, desc, extendDesc, group_id)}>

                <MainContent>
                    <BoxContent>
                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>选择图片</span></Col>
                            <Col span={19}>
                                <div
                                    onClick={() => $('#upload-data-input').click()}
                                    className="uploadFile"
                                >
                                    <Button type="primary">
                                        <Icon type="folder-open" /> 选择文件
								    </Button>
                                    <input
                                        id="upload-data-input"
                                        multiple="multiple"
                                        type="file"
                                        style={{ display: "none" }}
                                        onChange={e => {
                                            let file = e.target.files[0];
                                            this.setState({ file })
                                        }}
                                    />&nbsp;{file && file.name || ''}
                                </div>
                            </Col>
                        </Row>

                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>图片展示名称</span></Col>
                            <Col span={19}>
                                <Input placeholder="输入图片展示名称" value={name} onChange={(e)=>{
                                    this.setState({name: e.target.value});
                                }} />
                                {/* <Input <Input placeholder="Basic usage" /> /> */}
                            </Col>
                        </Row>

                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>选择图片组</span></Col>
                            <Col span={19}>
                                <Select style={{ width: 160 }} defaultValue={imgGroupList.length > 0 ? imgGroupList[0].id : ''} onChange={(group_id)=>{
                                    this.setState({ group_id })
                                }}>
                                    {
                                        imgGroupList.map((item)=>{
                                            return <Option key={item.id} value={item.id}>{ item.name }</Option>
                                        })
                                    }
                                </Select>
                            </Col>
                        </Row>

                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>扩展信息</span></Col>
                            <Col span={19}>
                                <TextArea placeholder=";表示换行" value={extendDesc} autosize={{ minRows: 3, maxRows: 6 }} onChange={(e)=>{
                                    this.setState({ extendDesc: e.target.value })
                                }}/>
                            </Col>
                        </Row>

                        <Row gutter={16} type="flex" align="middle" style={{ marginBottom: 5 }}>
                            <Col span={5} ><span>备注信息说明*</span></Col>
                            <Col span={19}>
                                <TextArea placeholder="" value={desc} autosize={{ minRows: 3, maxRows: 6 }} onChange={(e) => {
                                    this.setState({ desc: e.target.value })
                                }} />
                            </Col>
                        </Row>
                    </BoxContent>
                </MainContent>
            </Modal>
        );
    }
}