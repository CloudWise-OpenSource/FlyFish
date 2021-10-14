import React from "react";
import {
  Form,
  FormItem,
  Select,
  RadioBooleanGroup,
} from "datavi-editor/templates";
const { Option } = Select;
import TextSetting from './TextSetting';
import AxisPointerSetting from './AxisPointer'

import { TOOLTIPTIGGER } from '../../constant/tooltip';

export default class TooltipSetting extends React.Component {
  constructor(props) {
    super(props);
  }

  updateOptions(...args) {
    this.props.updateOptions && this.props.updateOptions(...args);
  }

  handleTooltipChange = (key, value, parent) => {
    this.updateOptions({
      options: {
        tooltip: (
          parent
            ?
            {
              [parent]: { [key]: value }
            }
            :
            {
              [key]: value
            }
        )
      }
    })
  }

  render() {
    const {
      options: {
        options: {
          tooltip: {
            show = true,
            trigger = TOOLTIPTIGGER.item,
            axisPointer = {},
            textStyle = {}
          } = {}
        } = {}
      } = {}
    } = this.props;

    return (
      <Form>
        <FormItem label="show" extra="是否显示提示框组件">
          <RadioBooleanGroup
            value={show}
            onChange={(event) => this.handleTooltipChange('show', event.target.value)}
          />
        </FormItem>
        <FormItem label="trigger" extra="触发类型">
          <Select
            value={trigger}
            onSelect={(val) => this.handleTooltipChange('trigger', val)}
          >
            {
              Object.values(TOOLTIPTIGGER).map(value => (
                <Option value={value} key={value}>{value}</Option>
              ))
            }
          </Select>
        </FormItem>
        <TextSetting
          title="textStyle"
          option={textStyle}
          onChange={(key, value) => this.handleTooltipChange(key, value, 'textStyle')}
        />
        <AxisPointerSetting
          option={axisPointer}
          onChange={this.handleTooltipChange}
        />
      </Form>
    );
  }
}