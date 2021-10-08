import PropTypes from 'prop-types';
import T from 'utils/T';

import { PureComponent } from 'react';
import { Modal, Tree, Row, Col } from 'antd';

import { doDisposeMenuPermission, doGetMenuPermission } from '../../action/permission';
import { EnumDefaultMenus } from 'constants/EnumDefaultMenus';
import BoxContent from '../../../../templates/ToolComponents/BoxContent';

const EnumDefaultMenusClone = T.lodash.cloneDeep(EnumDefaultMenus);

@T.decorator.propTypes({
    subject_type: PropTypes.number.isRequired,
    subject_id: PropTypes.number.isRequired,
})
export default class SetMenuPermissionModal extends PureComponent {
    state = {
        loading: false,
        saving: false,
        autoExpandParent: true,
        permission: [],
    };

    componentDidMount() {
        this.showModal();
        // 加载权限数据
        this.loadPermission();
    }

    showModal = () => this.setState({ visible: true });

    handleCancel = () => this.setState({ visible: false });

    onCheck = (permission) => {
        console.log('onCheck', permission);
        this.setState({ permission });
    }


    /**
     * 加载权限数据
     */
    loadPermission() {
        const { subject_type, subject_id } = this.props;

        this.setState({ loading: true }, () => {
            doGetMenuPermission(subject_id, subject_type).then(resp => {
                this.setState({
                    loading: false,
                    permission: T.lodash.isEmpty(resp.data.permission) ? [] : resp.data.permission
                });
            }, resp => {
                T.prompt.error(resp.msg);
                this.setState({ loading: false });
            });
        });
    }

    /**
     * 执行创建或更新
     */
    handleCreateOrUpdate = () => {
        const { subject_type, subject_id } = this.props;
        const { permission } = this.state;

        this.setState({ saving: true }, () => {
            doDisposeMenuPermission(subject_id, subject_type, permission).then(resp => {
                T.prompt.success('操作成功');
                this.setState({ saving: false, visible: false });
            }, resp => {
                T.prompt.error(resp.msg);
                this.setState({ saving: false });
            });
        });
    }


    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children && item.children.length > 0) {
                return (
                    <Tree.TreeNode title={item.label} key={item.uniqueIdentity}>
                        {this.renderTreeNodes(item.children)}
                    </Tree.TreeNode>
                );
            }

            if (item.uiPermission && item.uiPermission.length > 0) {
                return (
                    <Tree.TreeNode title={item.label} key={item.uniqueIdentity}>
                        {this.renderTreeNodes(item.uiPermission)}
                    </Tree.TreeNode>
                );
            }

            return <Tree.TreeNode title={item.label} key={item.uniqueIdentity} />;
        });
    }

    render() {
        const { visible, saving, loading } = this.state;

        return (
            <Modal
                visible={visible}
                title="设置栏目权限"
                okText="确定"
                cancelText="取消"
                confirmLoading={saving}
                onCancel={this.handleCancel}
                onOk={this.handleCreateOrUpdate}
            >
                <BoxContent loading={loading}>
                    <Row type="flex" justify="center">
                        <Col>
                            <Tree
                                checkable
                                defaultExpandedKeys={EnumDefaultMenusClone[0].childrenMenu.map(item => item.uniqueIdentity)}
                                autoExpandParent={this.state.autoExpandParent}
                                onCheck={this.onCheck}
                                checkedKeys={this.state.permission}
                            >
                                {this.renderTreeNodes(EnumDefaultMenusClone[0].childrenMenu)}
                            </Tree>
                        </Col>
                    </Row>
                </BoxContent>
            </Modal>
        );
    }
}
