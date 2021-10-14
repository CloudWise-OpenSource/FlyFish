import React from "react";
import {
  Form,
  FormItem,
  Input,
  RadioBooleanGroup,
  Select,
} from "datavi-editor/templates";
import TextSetting from './TextSetting';
import AxisLineSetting from "./AxisLineSetting";
const { Option } = Select;

import { LEGENDTYPE, LEGENDORIENT } from '../../constant';

const specialIndent = ['legendType', 'showLegend'];

export default class EchartLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  updateOptions(...args) {
    this.props.updateOptions && this.props.updateOptions(...args);
  }

  handleLegendChange = (key, value, parent) => {
    let option = {};
    if (parent) {
      option = {
        options: {
          legend: {
            [parent]: {
              [key]: value
            }
          }
        }
      }
    } else if (specialIndent.includes(key)) {
      option[key] = value;
    } else {
      option = {
        options: {
          legend: {
            [key]: value
          }
        }
      }
    }
    this.updateOptions({
      ...option
    })
  }

  render() {
    const {
      options: {
        showLegend,
        legendType,
        options: {
          legend: {
            top = 'auto',
            left = 'auto',
            right = 'auto',
            bottom = 'auto',
            width = 'auto',
            height = 'auto',
            textStyle = {},
            lineStyle = {},
            orient = LEGENDORIENT.horizontal
          } = {}
        } = {}
      }
    } = this.props;
    const lineStyleConfig = {
      lineStyle,
      show: lineStyle.show
    }

    return (
      <Form>
        <FormItem label="show" extra="是否展示图例">
          <RadioBooleanGroup
            value={showLegend}
            onChange={(event) => this.handleLegendChange('showLegend', event.target.value)}
          />
        </FormItem>
        <FormItem label="type" extra="图例的类型">
          <Select
            value={legendType}
            onSelect={(val) => this.handleLegendChange('legendType', LEGENDTYPE[val])}
          >
            {
              Object.keys(LEGENDTYPE).map(value => (
                <Option value={value} key={value}>{value}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem label="top" extra="图例组件离容器上侧的距离">
          <Input
            value={top}
            onChange={(event) => this.handleLegendChange('top', event.target.value)}
          />
        </FormItem>
        <FormItem label="bottom" extra="图例组件离容器下侧的距离">
          <Input
            value={bottom}
            onChange={(event) => this.handleLegendChange('bottom', event.target.value)}
          />
        </FormItem>
        <FormItem label="left" extra="图例组件离容器左侧的距离">
          <Input
            value={left}
            onChange={(event) => this.handleLegendChange('left', event.target.value)}
          />
        </FormItem>
        <FormItem label="right" extra="图例组件离容器右侧的距离">
          <Input
            value={right}
            onChange={(event) => this.handleLegendChange('right', event.target.value)}
          />
        </FormItem>
        <FormItem label="width" extra="图例组件的宽度">
          <Input
            value={width}
            onChange={(event) => this.handleLegendChange('width', event.target.value)}
          />
        </FormItem>
        <FormItem label="height" extra="图例组件的高度">
          <Input
            value={height}
            onChange={(event) => this.handleLegendChange('height', event.target.value)}
          />
        </FormItem>
        <TextSetting
          option={textStyle}
          onChange={(key, value) => this.handleLegendChange(key, value, 'textStyle')}
        />
        <AxisLineSetting
          title="lineStyle"
          option={lineStyleConfig}
          onChange={(key, value) => this.handleLegendChange(key, value, 'lineStyle')}
        />
        <FormItem label="orient" extra="图例列表的布局朝向">
          <Select
            value={orient}
            onSelect={(val) => this.handleLegendChange('orient', LEGENDORIENT[val])}
          >
            {
              Object.keys(LEGENDORIENT).map(value => (
                <Option value={value} key={value}>{value}</Option>
              ))
            }
          </Select>
        </FormItem>
      </Form>
    );
  }
}