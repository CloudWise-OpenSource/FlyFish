/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';
import styles from './index.scss';
import { Component } from 'react';
import { Row, Col, Icon, Button, Upload, message } from 'antd';
import Modal from 'templates/ToolComponents/Tj_Modal';
import TagSelect from 'routes/common/components/TagSelect';
import { doAddComponent, doUpdateComponent } from '../../action/component';
import { getTagListByComponentId } from 'routes/system/webAPI/componentTag';

@T.decorator.propTypes({
    component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
    getComponentListCb: PropTypes.func.isRequired
})
export default class ComponentModalCreate extends Component {
    static defaultProps = {
        component_id: false,
        getComponentListCb: () => { }
    }

    constructor() {
        super();
        this.state = {
            saving: false,      // 保存数据过程状态
            visible: false,		// 是否显示modal
            selectTag: null, // 选中标签

            componentList: [],
        };
    }

    componentDidMount() {
        this.setState({ visible: true });
        this.fetchTagInfo();
    }

    /**
     * @description 获取当前组件标签信息
     */
    fetchTagInfo = () => {
        const { component_id } = this.props;
        if (component_id) {
            this.setState({ saving: true }, () => {
                getTagListByComponentId(component_id).then(({ code, data }) => {
                    console.log(code,data)
                    if (!code && data) {
                        this.setState({
                            selectTag: data
                        });
                    }
                }).finally(() => {
                    this.setState({ saving: false });
                }).catch(e => {
                    T.prompt.error('获取标签信息失败');
                });
            });
        }
    }

    /**
     * 保存
     */
    saveComponent = () => {
        const { componentList, selectTag } = this.state;
        const { component_id } = this.props;
        if (!component_id && componentList.length < 1) {
            T.prompt.error('请选择要上传的文件');
            return false;
        }

        if (!selectTag) {
            T.prompt.error('请选择标签');
            return false;
        }

        this.setState({ saving: true }, () => {
            const { selectTag: tag_id } = this.state;
            const isCreate = !component_id;

            const onUploadProgress = (event) => {
                const { loaded, total } = event;
                this.setState({
                    uploadProgress: Math.floor(loaded / total) * 100
                });
            };

            const thenParams = [
                () => {
                    this.setState({ saving: false, visible: false });
                    this.props.getComponentListCb();
                    T.prompt.success(isCreate ? '创建成功' : '修改成功');
                },

                resp => {
                    this.setState({ saving: false });
                    T.prompt.error(resp.msg);
                }
            ];

            if (isCreate) {
                doAddComponent({ componentList, tag_id }, onUploadProgress).then(...thenParams);
            } else {
                doUpdateComponent({ component_id, tag_id, component: componentList }).then(...thenParams);
            }
        });
    }

    /**
     * @description 处理select值
     * @param {number[]} selectTag
     */
    handleSelectChange = (selectTag) => {
        this.setState({ selectTag });
    }

    render() {
        const { component_id } = this.props;
        const { saving, visible, componentList, selectTag } = this.state;

        const props = {
            multiple: false,		// 允许上传多个文件
            onRemove: (file) => {
                this.setState(({ componentList }) => {
                    const index = componentList.indexOf(file);
                    const newFileList = componentList.slice();
                    newFileList.splice(index, 1);
                    return {
                        componentList: newFileList,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({ componentList }) => ({
                    componentList: [file],
                }));

                // 禁止自动上传
                return false;
            },

            fileList: this.state.componentList,
        };
        console.log(selectTag)
        return (
            <Modal
                title={!component_id ? '创建组件' : '编辑组件'}
                visible={visible}
                onCancel={() => this.setState({ visible: false })}
                footer={[
                    <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>,
                    <Button key="submit" type="primary" loading={saving} onClick={this.saveComponent}>
                        保存
                    </Button>,
                ]}
                className={styles.uploadBox}
            >
                <Row type="flex" align="middle" justify="center">
                    <Col span={6} className="ant-form-item-label">
                        <label className="ant-form-item-required">选择标签</label>
                    </Col>
                    <Col span={10} className="ant-form-item-control">
                        <TagSelect
                            needDefault
                            value={selectTag}
                            mode="tag"
                            className={styles.tagSelect}
                            onChange={this.handleSelectChange}
                        />
                    </Col>
                </Row>
                <Row className={styles.col} type="flex" align="top" justify="center">
                    <Col span={6} className="ant-form-item-label">
                        <label className={!component_id ? 'ant-form-item-required' : ''}>选择组件</label>
                    </Col>
                    <Col span={10} className="ant-form-item-control">
                        <Upload {...props}>
                            <Button>
                                <Icon type="upload" /> 选择组件
                            </Button>
                        </Upload>
                    </Col>
                </Row>
            </Modal>
        );
    }
}
