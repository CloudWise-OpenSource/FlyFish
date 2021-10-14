import React from 'react';
import {
  FormItem,
  InputNumber,
  ColorPickerInput
} from "datavi-editor/templates";

import PropTypes from 'prop-types';

import { noop } from '../../utils';

class ShadowSetting extends React.Component {
  static propTypes = {
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
  }

  constructor(props) {
    super(props);
  }

  render() {
    const {
      option: {
        shadowColor,
        shadowBlur,
        shadowOffsetX = 0,
        shadowOffsetY = 0
      },
      onChange,
    } = this.props;
    return (
      <div>
        <FormItem label="shadowColor" extra="阴影颜色">
          <ColorPickerInput
            value={shadowColor}
            onChange={(color) => onChange('shadowColor', color)}
          />
        </FormItem>
        <FormItem label="shadowBlur" extra="阴影长度">
          <InputNumber
            value={shadowBlur}
            onChange={val => onChange('shadowBlur', val)}
          />
        </FormItem>
        <FormItem label="shadowOffsetX" extra="阴影 X 偏移">
          <InputNumber
            value={shadowOffsetX}
            onChange={val => onChange('shadowOffsetX', val)}
          />
        </FormItem>
        <FormItem label="shadowOffsetY" extra="阴影 Y 偏移">
          <InputNumber
            value={shadowOffsetY}
            onChange={val => onChange('shadowOffsetY', val)}
          />
        </FormItem>
      </div>
    )
  }
}

export default ShadowSetting;