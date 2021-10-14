import React from "react";
import {
  FormItem,
  Select,
  RadioBooleanGroup,
  FormItemGroup
} from "datavi-editor/templates";
const { Option } = Select;
import AxisLineSetting from './AxisLineSetting';
import TextSetting from "./TextSetting";
import ShadowSetting from "./Shadow";
import TipLabel from './TipLabel';

import PropTypes from 'prop-types';

import { TOOLTIPAXISPOINTERTYPE } from '../../constant/tooltip';
import { noop } from '../../utils';

export default class AxisPointerSetting extends React.Component {
  static propTypes = {
    /**
     * @description 分组标题
     */
    title: PropTypes.string,
    /**
     * @description 默认配置
     */
    option: PropTypes.object,
    /**
     * @description 自定义change键
     */
    customKey: PropTypes.string,
    /**
     * @description 是否需要前置键
     */
    needKey: PropTypes.bool,
    /**
     * @description 处理变化事件
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    title: 'axisPointer',
    option: {},
    onChange: noop,
    needKey: true
  }

  constructor(props) {
    super(props);
  }

  handleTooltipChange = (key, value, parent) => {
    const { onChange, customKey, needKey } = this.props;
    let option = {
      [key]: value
    }
    if (parent) {
      option = {
        [parent]: option
      }
    }
    if (needKey) {
      onChange(
        customKey || 'axisPointer',
        option
      )
    } else {
      onChange(key, value, parent)
    }

  }

  render() {
    const {
      option: {
        lineStyle = {},
        crossStyle = {},
        label = {},
        type = TOOLTIPAXISPOINTERTYPE.line,
        shadowStyle = {},
        snap
      },
      title
    } = this.props;

    return (
      <div>
        <h2>
          <TipLabel
            label={title}
            message={'以下配置均为' + title + '子项'}
          />
        </h2>
        <FormItem label="type" extra="指示器类型">
          <Select
            value={type}
            onChange={(value) => this.handleTooltipChange('type', value)}
          >
            {
              Object.values(TOOLTIPAXISPOINTERTYPE).map(value => (
                <Option key={value} value={value}>{value}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem label="snap" extra="坐标轴指示器是否自动吸附到点上">
          <RadioBooleanGroup
            value={snap}
            onChange={(event) => this.handleTooltipChange('snap', event.target.value)}
          />
        </FormItem>
        <AxisLineSetting
          title="lineStyle"
          option={
            { show: lineStyle.show, lineStyle }
          }
          onChange={(key, value) => this.handleTooltipChange(key, value, 'lineStyle')}
        />
        <AxisLineSetting
          title="crossStyle"
          option={
            { show: crossStyle.show, lineStyle: crossStyle }
          }
          onChange={(key, value) => this.handleTooltipChange(key, value, 'crossStyle')}
        />
        <TextSetting
          title="label"
          option={label}
          onChange={(key, value) => this.handleTooltipChange(key, value, 'label')}
        />
        <FormItemGroup title="shadowStyle">
          <ShadowSetting
            option={shadowStyle}
            onCHange={(key, value) => this.handleTooltipChange(key, value, 'shadowStyle')}
          />
        </FormItemGroup>
      </div>
    );
  }
}