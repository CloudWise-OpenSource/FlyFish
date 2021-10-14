import React from 'react';
import PropTypes from 'prop-types';

import {
  FormItemGroup,
  FormItem,
  InputNumber,
  ColorPickerInput,
  Select,
  RadioBooleanGroup
} from "datavi-editor/templates";

import {
  AXISLINETYPE,
  AXISLINEJOIN,
  AXISLINECAP
} from '../../constant/batchAxis';
import { noop } from '../../utils';

const AxisLineSetting = ({
  title,
  option: {
    show = true,
    lineStyle: {
      color = '#333',
      width = 1,
      type = AXISLINETYPE.solid,
      dashOffset = 0,
      cap = AXISLINECAP.butt,
      join = AXISLINEJOIN.bevel,
      miterLimit = 10
    } = {}
  },
  onChange,
  addAfterSlot,
  addOnSlot
}) => {
  return (
    <FormItemGroup title={title}>
      {addOnSlot}
      <FormItem label="show" extra="是否显示坐标轴轴线">
        <RadioBooleanGroup
          value={show}
          onChange={(event) => onChange('show', event.target.value)}
        />
      </FormItem>
      <FormItem label="lineColor" extra="坐标轴线线的颜色">
        <ColorPickerInput
          value={color}
          onChange={(color) => onChange('color', color)}
        />
      </FormItem>
      <FormItem label="lineWidth" extra="坐标轴线线宽">
        <InputNumber
          value={width}
          onChange={value => onChange('width', value)}
        />
      </FormItem>
      <FormItem label="lineType" extra="线的类型">
        <Select
          value={type}
          onSelect={(val) => onChange('type', AXISLINETYPE[val])}
        >
          {
            Object.keys(AXISLINETYPE).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="lineDashOffset" extra="用于设置虚线的偏移量">
        <InputNumber
          value={dashOffset}
          onChange={value => onChange('dashOffset', value)}
        />
      </FormItem>
      <FormItem label="lineCap" extra="用于指定线段末端的绘制方式">
        <Select
          value={cap}
          onSelect={(val) => onChange('cap', AXISLINECAP[val])}
        >
          {
            Object.keys(AXISLINECAP).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="lineJoin" extra="用于设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性（长度为0的变形部分，其指定的末端和控制点在同一位置，会被忽略）">
        <Select
          value={join}
          onSelect={(val) => onChange('join', AXISLINEJOIN[val])}
        >
          {
            Object.keys(AXISLINEJOIN).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="lineMiterLimit" extra="用于设置斜接面限制比例">
        <InputNumber
          value={miterLimit}
          onChange={value => onChange('miterLimit', value)}
        />
      </FormItem>
      {addAfterSlot}
    </FormItemGroup>
  );
}

AxisLineSetting.proppTypes = {
  /**
   * @description 分组标题
   */
  title: PropTypes.string,
  /**
   * @description 分组配置
   */
  option: PropTypes.object.isRequired,
  /**
   * @description 说明前缀
   */
  extraPrefix: PropTypes.string,
  /**
   * @description 前置插槽
   */
  addOnSlot: PropTypes.element,
  /**
   * @description 后置插槽
   */
  addAfterSlot: PropTypes.element,
  /**
   * @description 值更改事件
   */
  onChange: PropTypes.func,
}

AxisLineSetting.defaultProps = {
  title: 'axisLine',
  option: {},
  extraPrefix: '',
  addOnSlot: [],
  addAfterSlot: [],
  onChange: noop
}

export default AxisLineSetting;