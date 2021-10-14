/**
 * @description 格式化配置
 */

import React from "react";
import PropTypes from "prop-types";

import { EditorModal } from "datavi-editor/templates";
import { showMsg } from "data-vi/modal";

import { matchFunctionBody } from "../../utils";

const defaultFunction = function formatter(value) {
  return value;
};

// 暂时datavi不能用hook, 先这样写
class FormatterModal extends React.Component {
  // emmm~ 不知为何放在state里弹框会闪
  validateState = true;

  stringfiyFunction = (value) => {
    let func = "";
    try {
      func = String(value);
    } catch (e) {
      console.warn(e);
    }
    return func;
  };

  handleValidate = ([status]) => {
    let validateState = true;
    if (status && status.type === "error") {
      validateState = false;
    }
    this.validateState = validateState;
  };

  handleContentChange = (value) => {
    if (!this.validateState) {
      showMsg("您输入的函数存在错误, 请检查");
    } else {
      const [functionParams, functionBody] = matchFunctionBody(value);
      let formatterFunction = null;
      const params = [functionParams].flat();
      try {
        // 暂时保留这种写法, 会丢掉对应的方法名
        formatterFunction = new Function(...params, functionBody);
        // 这里运行一下: 避免方法中存在错误导致组件崩溃
        params.length === 1 && eval(formatterFunction(12));
      } catch (e) {
        console.warn(e);
        formatterFunction = null;
        showMsg("您输入的函数存在错误, 请检查");
      }
      console.log(value, formatterFunction);

      if (formatterFunction) {
        this.props.onChange(formatterFunction);
      }
    }
  };

  render() {
    const { formatter, visible, onCancel } = this.props;
    const formatValues = this.stringfiyFunction(formatter);
    return (
      <EditorModal
        title="配置函数"
        mode="javascript"
        visible={visible}
        value={formatValues}
        editorProps={{
          tabSize: 2,
          onValidate: this.handleValidate,
        }}
        onSave={this.handleContentChange}
        onCancel={() => onCancel()}
      />
    );
  }
}

FormatterModal.defaultProps = {
  formatter: defaultFunction,
  visible: false,
  onChange: () => {},
  onCancel: () => {},
};

FormatterModal.propTypes = {
  formatter: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default FormatterModal;
