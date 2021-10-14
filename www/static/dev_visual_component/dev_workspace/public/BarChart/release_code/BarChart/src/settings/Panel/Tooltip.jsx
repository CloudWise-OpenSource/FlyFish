/**
 * @description 提示框配置
 */

import React from "react";
import PropTypes from "prop-types";
import { merge } from "data-vi/helpers";

import {
  Select,
  FormItemGroup,
  RadioBooleanGroup,
  Button,
  ColorPickerInput,
} from "datavi-editor/templates";
import Form, { FormItem } from "../Form";
import Font from "./Font";
import Border from "./Border";
import FormatterModal from "./FormatterModal";

import { RECT } from "../../Chart/theme";
import { TOOLTIPTIGGER, TOOLTIPDEFAULTFUNCTION } from "../../constant/tooltip";

const Option = Select.Option;

class Tooltip extends React.Component {
  state = {
    visible: false,
  };

  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  render() {
    const { initialValues, onChange } = this.props;
    const { visible } = this.state;
    return (
      <React.Fragment>
        <Form
          onValuesChange={(form, changeValues) => onChange(changeValues)}
          initialValues={merge({}, RECT, initialValues)}
        >
          <FormItemGroup title="基本属性">
            <FormItem name="show" label="显示">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="showContent" label="显示浮层">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="alwaysShowContent" label="浮层常驻">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="confine" label="限制图表内">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="backgroundColor" label="背景色">
              <ColorPickerInput />
            </FormItem>
            <FormItem name="trigger" label="触发类型">
              <Select>
                {Object.values(TOOLTIPTIGGER).map((value) => (
                  <Option value={value} key={value}>
                    {TOOLTIPTIGGER[value]}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <Button
              style={{ display: "block", width: "100%" }}
              onClick={this.toggleVisible}
            >
              设置字符串格式函数
            </Button>
          </FormItemGroup>
          <Border initialValues={initialValues} onChange={onChange} />
          <Font
            title="字体"
            initialValues={initialValues.textStyle}
            onChange={(value) => onChange({ textStyle: value })}
          />
        </Form>
        <FormatterModal
          formatter={initialValues.formatter || TOOLTIPDEFAULTFUNCTION}
          visible={visible}
          onChange={(formatter) => {
            this.toggleVisible();
            onChange({ formatter });
            onChange({ "tooltip.formatter": String(formatter) }, "functions");
          }}
          onCancel={this.toggleVisible}
        />
      </React.Fragment>
    );
  }
}

Tooltip.defaultProps = {
  initialValues: {},
  onChange: () => {},
  title: "提示框",
};

Tooltip.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default Tooltip;
