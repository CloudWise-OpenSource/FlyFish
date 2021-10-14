/**
 * @description 扩展配置
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  Input,
  EditorModal
} from 'datavi-editor/templates';
import { showMsg } from 'data-vi/modal';
import Form, { FormItem } from '../Form';
// 暂时datavi不能用hook, 先这样写
class Extend extends React.Component {
  state = {
    visible: false
  }

  // emmm~ 不知为何放在state里弹框会闪
  validateState = true;

  toggleEditor = () => {
    console.log('toogle')
    this.setState({
      visible: !this.state.visible
    })
  }

  formatInitialValues = ({ options = {} } = {}) => {
    return {
      options: JSON.stringify(options, null, 2)
    }
  }

  handleValidate = ([status]) => {
    let validateState = true;
    if (status && status.type === 'error') {
      validateState = false;
    }
    this.validateState = validateState;
  }

  handleContentChange = (value) => {
    console.log(value)
    if (!this.validateState) {
      showMsg('您输入的配置存在错误, 请检查');
    } else {
      this.toggleEditor();
      this.props.onChange({ options: JSON.parse(value) })
    }
  }

  render() {
    const {
      initialValues,
      onChange
    } = this.props;
    const formatValues = this.formatInitialValues(initialValues);
    return (
      <React.Fragment>
        <FormItem
          name="options"
          label="自定义配置"
          extra="注意: 若使用自定义配置会覆盖我们提供的部分独立的配置; 点击进行编辑"
          onClick={() => this.toggleEditor()}
        >
          <Input.TextArea value={formatValues.options} style={{ height: '50vh' }} placeholder="请输入自定义配置" disabled />
        </FormItem>
        {
          formatValues.options
          &&
          <EditorModal
            title="自定义配置"
            mode="json"
            visible={this.state.visible}
            value={formatValues.options}
            editorProps={{
              tabSize: 2,
              onValidate: this.handleValidate
            }}
            onSave={this.handleContentChange}
            onCancel={() => this.toggleEditor()}
          />
        }

      </React.Fragment>
    )
  }
}

Extend.defaultProps = {
  initialValues: {},
  onChange: () => { },
}

Extend.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default Extend;