/**
 * Created by chencheng on 17-8-31.
 */
import PropTypes from 'prop-types';
import T from 'utils/T';

import { Component } from 'react';
import { Row, Col, Button, Modal, Upload, Icon } from 'antd';

import { doImportComponentCode } from '../../action/component';

@T.decorator.propTypes({
  component_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]).isRequired,
})
export default class ComponentModalImport extends Component {
  static defaultProps = {
    component_id: false,
  }

  constructor() {
    super();
    this.state = {
      saving: false,      // 保存数据过程状态
      visible: false,		// 是否显示modal

      componentList: []
    };
  }

  componentDidMount() {
    this.setState({ visible: true });
  }

  /**
   * 保存模型
   */
  saveComponent = () => {
    const { componentList } = this.state;


    this.setState({ saving: true }, () => {
      const { component_id } = this.props;

      const thenParams = [
        () => {
          this.setState({ saving: false, visible: false });
          T.prompt.success('上传组件源码包成功');
        },

        resp => {
          this.setState({ saving: false });
          T.prompt.error(resp.msg || '上传组件源码包失败，请稍后重试！');
        }
      ];

      doImportComponentCode({ component_id, component: componentList }).then(...thenParams);
    });
  }

  render() {
    let { componentName } = this.props;
    const { saving, visible } = this.state;
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
        this.setState({
          componentList: [file]
        });

        // 禁止自动上传
        return false;
      },

      fileList: this.state.componentList,
    };
    return (
        <Modal
            title={`上传${componentName}组件源码`}
            visible={visible}
            onCancel={() => this.setState({ visible: false })}
            footer={[
                <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>,
                <Button key="submit" type="primary" loading={saving} onClick={this.saveComponent}>
                    确定
                </Button>,
        ]}
      >
            <Row type="flex" align="middle">
                <Col span={10}>
                    <Upload {...props}>
                        <Button>
                            <Icon type="upload" /> 选择组件源码包
                        </Button>
                    </Upload>
                </Col>
            </Row>
        </Modal>
    );
  }
}
