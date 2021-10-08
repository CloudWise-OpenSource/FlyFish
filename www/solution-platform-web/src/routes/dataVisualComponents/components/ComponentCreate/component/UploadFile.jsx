/**
  * 上传文件
  */
import { PureComponent } from 'react';
import { Button, Row, Col, Icon, Modal, Upload } from 'antd';

import PropTypes from 'prop-types';
import T from 'utils/T';

import {
  doUploadFile
} from '../../../action/component';

@T.decorator.propTypes({
  component_id: PropTypes.number.isRequired,
  filePath: PropTypes.string.isRequired,
  initDevComponentSpaceCb: PropTypes.func.isRequired,
})
class UploadFile extends PureComponent {
  static defaultProps = {
    component_id: false,
    initDevComponentSpaceCb: () => { }
  }

  constructor() {
    super();
    this.state = {
      saving: false,      // 保存数据过程状态
      visible: false,		// 是否显示modal

      fileList: [],
    };
  }

  componentDidMount() {
    this.setState({ visible: true })
  }

  /**
      * 保存
      */
  saveComponent = () => {
    const { fileList } = this.state;

    if (fileList.length < 1) {
      T.prompt.error("请选择要上传的文件");
      return false;
    }

    this.setState({ saving: true }, () => {
      const { component_id, filePath } = this.props;
      const thenParams = [
        () => {
          this.setState({ saving: false, visible: false });
          this.props.initDevComponentSpaceCb();
          T.prompt.success('上传成功');
        },

        resp => {
          this.setState({ saving: false });
          T.prompt.error(resp.msg);
        }
      ];

      doUploadFile(component_id, filePath, fileList).then(...thenParams);
    })
  }

  render() {
    const { saving, visible } = this.state;

    const props = {
      multiple: true,		// 允许上传多个文件
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }));

        // 禁止自动上传
        return false;
      },

      fileList: this.state.fileList,
    };

    return (
      <Modal
        title="上传文件"
        visible={visible}
        onCancel={() => this.setState({ visible: false })}
        footer={[
          <Button key="back" onClick={() => this.setState({ visible: false })}>取消</Button>,
          <Button key="submit" type="primary" loading={saving} onClick={this.saveComponent}>
            确定
          </Button>,
        ]}
      >
        <Row type="flex" align="middle" justify="center">
          <Col span={6}>
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default UploadFile;
