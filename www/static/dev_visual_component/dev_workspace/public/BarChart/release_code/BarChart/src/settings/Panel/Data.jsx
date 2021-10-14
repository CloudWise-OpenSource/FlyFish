/**
 * @description 数据配置
 */

import React from "react";
import PropTypes from "prop-types";

import { Input, EditorModal } from "datavi-editor/templates";
import { showMsg } from "data-vi/modal";
import Form, { FormItem } from "../Form";

import { matchFunctionBody } from "../../utils";

const defaultFunction = function transferData(data) {
  return data;
};

// 暂时datavi不能用hook, 先这样写
class Data extends React.Component {
  state = {
    visible: false,
    key: null,
  };

  // emmm~ 不知为何放在state里弹框会闪
  validateState = true;

  toggleEditor = (key) => {
    this.setState({
      key,
      visible: !this.state.visible,
    });
  };

  formatInitialValues = ({
    transferXAxisData = defaultFunction,
    transferSeriesData = defaultFunction,
  } = {}) => {
    return {
      transferXAxisData: this.stringfiyFunction(transferXAxisData),
      transferSeriesData: this.stringfiyFunction(transferSeriesData),
    };
  };

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
    const { key } = this.state;
    console.log(value);
    if (!this.validateState) {
      showMsg("您输入的函数存在错误, 请检查");
    } else {
      const [functionParams, functionBody] = matchFunctionBody(value);
      let transferData = null;
      try {
        // 暂时保留这种写法, 会丢掉对应的方法名
        transferData = new Function(functionParams, functionBody);
        // 这里运行一下: 避免方法中存在错误导致组件崩溃
        eval(transferData([]));
      } catch (e) {
        console.warn(e);
        transferData = null;
        showMsg("您输入的函数存在错误, 请检查");
      }
      if (transferData) {
        this.toggleEditor();
        this.props.onChange({
          [key]: transferData,
          functions: { [key]: this.stringfiyFunction(transferData) },
        });
      }
    }
  };

  render() {
    const { initialValues, onChange } = this.props;
    const { key, visible } = this.state;
    const formatValues = this.formatInitialValues(initialValues);
    return (
      <React.Fragment>
        <FormItem
          name="transferXAxisData"
          label="格式xAxis"
          extra="点击进行编辑"
          onClick={() => this.toggleEditor("transferXAxisData")}
        >
          <Input.TextArea
            value={formatValues.transferXAxisData}
            style={{ height: "30vh" }}
            placeholder="请输入格式xAxis函数"
            disabled
          />
        </FormItem>
        <FormItem
          name="transferSeriesData"
          label="格式data"
          extra="点击进行编辑"
          onClick={() => this.toggleEditor("transferSeriesData")}
        >
          <Input.TextArea
            value={formatValues.transferSeriesData}
            style={{ height: "30vh" }}
            placeholder="请输入格式data函数"
            disabled
          />
        </FormItem>
        {formatValues[key] && (
          <EditorModal
            title="配置函数"
            mode="javascript"
            visible={visible}
            value={formatValues[key]}
            editorProps={{
              tabSize: 2,
              onValidate: this.handleValidate,
            }}
            onSave={this.handleContentChange}
            onCancel={() => this.toggleEditor()}
          />
        )}
      </React.Fragment>
    );
  }
}

Data.defaultProps = {
  initialValues: {},
  onChange: () => { },
};

Data.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Data;
