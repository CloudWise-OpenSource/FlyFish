/**
 * @description 扩展配置
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
  Input,
  FormItemGroup,
  FormItem,
  EditorModal
} from 'datavi-editor/templates';
import { showMsg } from 'data-vi/modal';
import { matchFunctionBody } from '../utils'

// 暂时datavi不能用hook, 先这样写
class Extend extends React.Component {
  state = {
    visible: false
  }

  // emmm~ 不知为何放在state里弹框会闪
  validateState = true;

  toggleEditor = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  formatInitialValues = ({ sort } = {}) => {
    return {
      sort: this.stringfiyFunction(sort)
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
    const { key } = this.state;
    console.log(value)
    if (!this.validateState) {
      showMsg('您输入的函数存在错误, 请检查');
    } else {
      const functionBody = matchFunctionBody(value);
      let transferData = null;
      try {
        // 暂时保留这种写法, 会丢掉对应的方法名
        transferData = new Function('data', functionBody)
        // 这里运行一下: 避免方法中存在错误导致组件崩溃
        eval(transferData([]));
      } catch (e) {
        console.warn(e)
        transferData = null;
        showMsg('您输入的函数存在错误, 请检查');
      }
      if (transferData) {
        this.toggleEditor();
        this.props.onChange({ sort: transferData })
      }
    }
  }

  stringfiyFunction = (value) => {
    let func = '';
    try {
      func = String(value);
    } catch (e) {
      console.warn(e);
    }
    return func;
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
          label="排序函数"
          extra="注意: 点击进行编辑。确保返回的是一个数组。否则不会产生任何变化"
          onClick={() => this.toggleEditor()}
        >
          <Input.TextArea name="options" value={formatValues.sort} style={{ height: '30vh' }} placeholder="请点击设置排序函数" disabled />
        </FormItem>
        <EditorModal
          title="自定义配置"
          mode="javascript"
          visible={this.state.visible}
          value={formatValues.sort}
          editorProps={{
            tabSize: 2,
            onValidate: this.handleValidate
          }}
          onSave={this.handleContentChange}
          onCancel={() => this.toggleEditor()}
        />
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