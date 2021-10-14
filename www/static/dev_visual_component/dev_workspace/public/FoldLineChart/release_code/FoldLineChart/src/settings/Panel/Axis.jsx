/**
 * @description 轴配置
 */

import React from "react";
import PropTypes from "prop-types";
import { merge } from "data-vi/helpers";

import {
  Select,
  Input,
  InputNumber,
  FormItemGroup,
  RadioBooleanGroup,
  Button,
} from "datavi-editor/templates";
import Form, { FormItem } from "../Form";
import Font from "./Font";
import AxisLine from "./AxisLine";
import AxisTick from "./AxisTick";
import SplitLine from "./SplitLine";
import AxisLabel from "./AxisLabel";
import FormatterModal from "./FormatterModal";

import { AXISTYPE, AXISNAMELOCATIONTYPE } from "../../constant/batchAxis";
import { XAXISPOSITION } from "../../constant/xAxis";
import { YAXISPOSITION } from "../../constant/yAxis";

const Option = Select.Option;

class Axis extends React.Component {
  state = {
    visible: false,
  };
  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };
  render() {
    const { initialValues, onChange, type } = this.props;
    const position = type === "x" ? XAXISPOSITION : YAXISPOSITION;
    const formatInitialValues = merge(
      {},
      type === "x"
        ? {}
        : { axisLine: { show: false }, axisTick: { show: false } },
      initialValues
    );
    const { visible } = this.state;
    return (
      <React.Fragment>
        <Form
          onValuesChange={(form, changeValues) => onChange(changeValues)}
          initialValues={formatInitialValues}
        >
          <FormItemGroup title="基础配置">
            <FormItem name="show" label="显示">
              <RadioBooleanGroup />
            </FormItem>
            <FormItem name="position" label="位置">
              <Select>
                {Object.keys(position).map((value) => (
                  <Option value={value} key={value}>
                    {position[value]}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem name="type" label="类型">
              <Select>
                {Object.keys(AXISTYPE).map((value) => (
                  <Option value={value} key={value}>
                    {AXISTYPE[value]}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </FormItemGroup>
          <FormItemGroup title="坐标轴名称">
            <FormItem name="name" label="名称">
              <Input placeholder="请输入坐标轴名称" />
            </FormItem>
            <FormItem name="nameLocation" label="位置">
              <Select>
                {Object.keys(AXISNAMELOCATIONTYPE).map((value) => (
                  <Option value={value} key={value}>
                    {AXISNAMELOCATIONTYPE[value]}
                  </Option>
                ))}
              </Select>
            </FormItem>
            <FormItem name="nameGap" label="距离">
              <InputNumber placeholder="请输入距离" />
            </FormItem>
            <FormItem name="nameRotate" label="角度">
              <InputNumber placeholder="请输入角度" />
            </FormItem>
            <Font
              title=""
              initialValues={formatInitialValues.nameTextStyle}
              onChange={(value) => onChange({ nameTextStyle: value })}
            />
          </FormItemGroup>
          <AxisLine
            tyep={type}
            initialValues={formatInitialValues.axisLine}
            onChange={(value) => onChange({ axisLine: value })}
          />
          <AxisTick
            tyep={type}
            initialValues={formatInitialValues.axisTick}
            onChange={(value) => onChange({ axisTick: value })}
          />
          <SplitLine
            tyep={type}
            initialValues={formatInitialValues.splitLine}
            onChange={(value) => onChange({ splitLine: value })}
          />
          <AxisLabel
            tyep={type}
            initialValues={formatInitialValues.axisLabel}
            onChange={(value) => onChange({ axisLabel: value })}
          />
          <Button
            style={{ display: "block", width: "100%" }}
            onClick={this.toggleVisible}
          >
            标签格式函数编辑
          </Button>
        </Form>
        <FormatterModal
          visible={visible}
          onChange={(formatter) => {
            onChange({ axisLabel: { formatter } });
            onChange(
              { [`${type}Axis.axisLabel.formatter`]: String(formatter) },
              "functions"
            );
            this.toggleVisible();
          }}
          onCancel={this.toggleVisible}
          formatter={formatInitialValues.axisLabel.formatter}
        />
      </React.Fragment>
    );
  }
}

Axis.defaultProps = {
  initialValues: {},
  onChange: () => {},
  keyprefix: "",
  type: "x",
};

Axis.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string,
  type: PropTypes.string,
};

export default Axis;
