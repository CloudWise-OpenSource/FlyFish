import React from 'react';
import PropTypes from 'prop-types';

import {
  FormItemGroup,
  FormItem,
  Input,
  InputNumber,
  ColorPickerInput,
  Select,
} from "datavi-editor/templates";
import InputArrayNumber from './InputArrayNumber';
import ShadowSetting from './Shadow';

import {
  AXISLINETYPE,
} from '../../constant/batchAxis';
import {
  FONTALIGIN,
  FONTVERTICALALIGN,
  FONTSTYLE,
  FONTWEIGHT,
  TEXTOVERFLOW,
  LINETEXTOVERFLOW,
  FONTWEIGHTNUMBER
} from '../../constant';
import { noop } from '../../utils';

const TextSetting = ({
  title,
  onChange,
  extraPrefix,
  addOnSlot,
  addAfterSlot,
  option: {
    color = '#333',
    fontStyle = FONTSTYLE.normal,
    fontWeight = FONTWEIGHT.normal,
    fontFamily = 'sans-serif',
    fontSize = 12,
    align,
    verticalAlign,
    lineHeight,
    backgroundColor = 'rgba(0, 0, 0, 0)',
    borderColor,
    borderWidth = 0,
    borderType = AXISLINETYPE.solid,
    borderDashOffset = 0,
    borderRadius = [],
    padding = [],
    shadowColor = 'rgba(0, 0, 0, 0)',
    shadowBlur = 0,
    shadowOffsetX = 0,
    shadowOffsetY = 0,
    width,
    height,
    overflow = TEXTOVERFLOW.none,
    ellipsis = '...',
    lineOverflow = LINETEXTOVERFLOW.none,
  }
}) => {
  return (
    <FormItemGroup title={title}>
      {addOnSlot}
      <FormItem label="fontColor" extra={extraPrefix + "名称的颜色"}>
        <ColorPickerInput
          value={color}
          onChange={(color) => onChange('color', color)}
        />
      </FormItem>
      <FormItem label="fontStyle" extra={extraPrefix + "名称文字字体的风格"}>
        <Select
          value={fontStyle}
          onSelect={(val) => onChange('fontStyle', FONTSTYLE[val])}
        >
          {
            Object.keys(FONTSTYLE).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="fontWeight" extra={extraPrefix + "名称文字字体的粗细"}>
        <Select
          value={fontWeight}
          onSelect={(val) => onChange('fontWeight', FONTWEIGHT[val])}
        >
          {
            Object.keys(FONTWEIGHT).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="fontWeight" extra={extraPrefix + "名称文字字体的粗细"}>
        <InputNumber
          value={FONTWEIGHTNUMBER[fontWeight] || fontWeight}
          onSelect={(val) =>
            onChange('fontWeight', val)
          }
        />
      </FormItem>
      <FormItem label="fontFamily" extra={extraPrefix + "名称文字的字体系列"}>
        <Input
          value={fontFamily}
          onChange={(event) => onChange('fontFamily', event.target.value)}
        />
      </FormItem>
      <FormItem label="fontSize" extra={extraPrefix + "坐标轴名称文字的字体大小"}>
        <InputNumber
          value={fontSize}
          onChange={val => onChange('fontSize', val)}
        />
      </FormItem>
      <FormItem label="align" extra={extraPrefix + "文字水平对齐方式，默认自动"}>
        <Select
          value={align}
          onSelect={(val) => onChange('align', FONTALIGIN[val])}
        >
          {
            Object.keys(FONTALIGIN).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="verticalAlign" extra="文字垂直对齐方式，默认自动">
        <Select
          value={verticalAlign}
          onSelect={(val) => onChange('verticalAlign', FONTVERTICALALIGN[val])}
        >
          {
            Object.keys(FONTVERTICALALIGN).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="lineHeight" extra="行高">
        <InputNumber
          value={lineHeight}
          onChange={val => onChange('lineHeight', val)}
        />
      </FormItem>
      <FormItem label="backgroundColor" extra="文字块背景色">
        <ColorPickerInput
          value={backgroundColor}
          onChange={(color) => onChange('backgroundColor', color)}
        />
      </FormItem>
      <FormItem label="borderColor" extra="文字块边框颜色">
        <ColorPickerInput
          value={borderColor}
          onChange={(color) => onChange('borderColor', color)}
        />
      </FormItem>
      <FormItem label="borderWidth" extra="文字块边框宽度">
        <InputNumber
          value={borderWidth}
          onChange={val => onChange('borderWidth', val)}
        />
      </FormItem>
      <FormItem label="borderType" extra="文字垂直对齐方式，默认自动">
        <Select
          value={borderType}
          onSelect={(val) => onChange('borderType', AXISLINETYPE[val])}
        >
          {
            Object.keys(AXISLINETYPE).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="borderDashOffset" extra="用于设置虚线的偏移量">
        <InputNumber
          value={borderDashOffset}
          onChange={val => onChange('borderDashOffset', val)}
        />
      </FormItem>
      <FormItem label="borderRadius" extra="文字块的圆角">
        <InputArrayNumber
          value={borderRadius}
          onChange={val => onChange('borderRadius', val)}
        />
      </FormItem>
      <FormItem label="padding" extra="文字块的内边距">
        <InputArrayNumber
          value={padding}
          onChange={val => onChange('padding', val)}
        />
      </FormItem>
      <ShadowSetting
        option={
          {
            shadowBlur,
            shadowColor,
            shadowOffsetX,
            shadowOffsetY
          }
        }
        onChange={onChange}
      />
      <FormItem label="textWidth" extra="文本显示宽度">
        <InputNumber
          value={width}
          onChange={val => onChange('width', val)}
        />
      </FormItem>
      <FormItem label="textHeight" extra="文本显示高度">
        <InputNumber
          value={height}
          onChange={val => onChange('height', val)}
        />
      </FormItem>
      <FormItem label="overflow" extra="文字超出宽度是否截断或者换行。配置width时有效">
        <Select
          value={overflow}
          onSelect={(val) => onChange('overflow', TEXTOVERFLOW[val])}
        >
          {
            Object.keys(TEXTOVERFLOW).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      <FormItem label="ellipsis" extra="在overflow配置为'truncate'的时候，可以通过该属性配置末尾显示的文本">
        <Input value={ellipsis} onChange={
          event => onChange('ellipsis', event.target.value)
        } />
      </FormItem>
      <FormItem label="lineOverflow" extra="文本超出高度部分是否截断，配置height时有效">
        <Select
          value={lineOverflow}
          onSelect={(val) =>
            onChange('lineOverflow', LINETEXTOVERFLOW[val])}
        >
          {
            Object.keys(LINETEXTOVERFLOW).map(value => (
              <Option value={value} key={value}>{value}</Option>
            ))
          }
        </Select>
      </FormItem>
      {addAfterSlot}
    </FormItemGroup>
  )
}

TextSetting.proppTypes = {
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

TextSetting.defaultProps = {
  title: 'name',
  option: {},
  extraPrefix: '',
  addOnSlot: [],
  addAfterSlot: [],
  onChange: noop
}
export default TextSetting;