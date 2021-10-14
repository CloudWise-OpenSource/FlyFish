import React from 'react';
import {
  FormItem,
  Select,
  FormItemGroup,
  ColorPickerInput,
  InputNumber
} from "datavi-editor/templates";
import ShadowSetting from './Shadow';

import PropTypes from 'prop-types';

import { noop } from '../../utils';
import { ORIGIN } from '../../constant';

class AreaSetting extends React.Component {
  static propTypes = {
    /**
     * @description 组件标题
     */
    title: PropTypes.string,
    /**
     * @description 受控组件值
     */
    option: PropTypes.object,
    /**
     * @description 值变动
     */
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange: noop,
    option: {},
    title: 'areaStyle'
  }

  constructor(props) {
    super(props);
    this.state = {}
  }


  render() {
    const {
      option = {},
      onChange,
      title
    } = this.props;
    const {
      color = '#000',
      origin = ORIGIN.auto,
      opacity = 1
    } = option;
    return (
      <FormItemGroup title={title}>
        <FormItem label="color" extra="填充的颜色">
          <ColorPickerInput
            value={color}
            onChange={(color) => onChange('color', color)}
          />
        </FormItem>
        <FormItem label="orgin" extra="图形区域的起始位置">
          <Select
            value={origin}
            onChange={value => onChange('origin', value)}
          >
            {
              Object.values(ORIGIN).map(value => (
                <Select.Option key={value} value={value}>{value}</Select.Option>
              ))
            }
          </Select>
        </FormItem>
        <ShadowSetting
          option={option}
          onChange={onChange}
        />
        <FormItem label="opacity" extra="阴影长度">
          <InputNumber
            value={opacity}
            min={0}
            max={1}
            onChange={val => onChange('opacity', val)}
          />
        </FormItem>
      </FormItemGroup>
    )
  }


}

export default AreaSetting;