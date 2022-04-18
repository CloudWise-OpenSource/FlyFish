/**
 * 代码树操作modal
 */
import { PureComponent } from 'react';
import { Row, Col, Input, Select, Modal } from 'antd';

import PropTypes from 'prop-types';
import T from 'utils/T';


import { EnumCodeTreeMarkType, EnumCodeTreeOperateType } from 'constants/app/dataVisualComponents';
import {
  doAddDevFileOrDir,
  doUpdateDevFileOrDir,
} from '../../../action/component';

@T.decorator.propTypes({
  component_id: PropTypes.number.isRequired,
  operateType: PropTypes.number.isRequired,
  filePath: PropTypes.string.isRequired,
  initDevComponentSpaceCb: PropTypes.func.isRequired,
})
class CodeTreeOperateModal extends PureComponent {
  constructor(props) {
    super();
    this.nameInput = null;
    this.state = {
      visible: false,
      saving: false,
      name: props.name || null,                                        //  文件或目录名称
      fileOrDirMark: EnumCodeTreeMarkType.file.value,    //  文件或目录标识
    }
  }

  componentDidMount() {
    this.showModal();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });

    if (this.nameInput) this.nameInput.focus();
  }

  handleOk = (e) => {
    const { component_id, filePath, operateType, initDevComponentSpaceCb } = this.props;
    const { name, fileOrDirMark } = this.state;

    this.setState({ saving: true }, () => {
      switch (operateType) {
        case EnumCodeTreeOperateType.add:
          return doAddDevFileOrDir(component_id, filePath, name, fileOrDirMark).then(
            () => {
              T.prompt.success('操作成功');
              initDevComponentSpaceCb();
              this.setState({ visible: false, saving: false });
            },
            (resp) => {
              T.prompt.error(resp.msg);
              this.setState({ saving: false });
            }
          );
        case EnumCodeTreeOperateType.edit:
          return doUpdateDevFileOrDir(component_id, filePath, name).then(
            () => {
              T.prompt.success('操作成功');
              initDevComponentSpaceCb();
              this.setState({ visible: false, saving: false });
            },
            (resp) => {
              T.prompt.error(resp.msg);
              this.setState({ saving: false });
            }
          );

        case EnumCodeTreeOperateType.del:

      }
    })
  }

  handleCancel = (e) => this.setState({ visible: false });

  render() {
    const { visible, saving, name, fileOrDirMark } = this.state;
    const { operateType } = this.props;
    const itemGroupStyle = { marginBottom: 5 };
    return (
      <Modal
        title="添加文件或目录"
        visible={visible}
        confirmLoading={saving}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Row type="flex" align="middle" style={itemGroupStyle}>
          <Col span={4} offset={4}><span>名称:</span></Col>
          <Col span={10}>
            <Input
              value={name}
              onKeyDown={(e) => e.keyCode == 13 ? this.handleOk() : null}
              onChange={(e) => this.setState({ name: e.target.value.trim() })}
            />
          </Col>
        </Row>

        {operateType == EnumCodeTreeOperateType.add ?
          <Row type="flex" align="middle" style={itemGroupStyle}>
            <Col span={4} offset={4}><span>文件类型:</span></Col>
            <Col span={10}>
              <Select
                value={fileOrDirMark}
                onChange={(fileOrDirMark) => this.setState({ fileOrDirMark })}
                style={{ width: "100%" }}
              >
                {Object.values(EnumCodeTreeMarkType).map(item => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
              </Select>
            </Col>
          </Row> : null}
      </Modal>
    );
  }
}

export default CodeTreeOperateModal;
