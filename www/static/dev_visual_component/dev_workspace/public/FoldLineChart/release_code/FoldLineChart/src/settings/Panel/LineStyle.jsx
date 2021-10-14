/**
* @description 轴线配置
*/

import React from 'react';
import PropTypes from 'prop-types';

import {
  Select,
  InputNumber,
  FormItemGroup,
  ColorPickerInput,
  Slider
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import Shadow from './Shadow';

import {
  AXISLINETYPE,
  AXISLINECAP,
  AXISLINEJOIN
} from '../../constant/batchAxis';

const Option = Select.Option;

const LineStyle = ({
  initialValues,
  onChange,
  keyprefix,
}) => {

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={initialValues}>
      <FormItemGroup title="线配置">
        <FormItem name="color" label="颜色">
          <ColorPickerInput />
        </FormItem>
        <FormItem name="width" label="宽度">
          <InputNumber />
        </FormItem>
        <FormItem name="opacity" label="透明度">
          <Slider min={0} max={1} step={0.01} />
        </FormItem>
        <FormItem name="type" label="类型">
          <Select>
            {
              Object.keys(AXISLINETYPE).map(value => (
                <Option value={value} key={value}>{AXISLINETYPE[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name="dashOffset" label="虚线偏移">
          <InputNumber />
        </FormItem>
        <FormItem name="cap" label="末端绘制">
          <Select>
            {
              Object.keys(AXISLINECAP).map(value => (
                <Option value={value} key={value}>{AXISLINECAP[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name="join" label="连接绘制">
          <Select>
            {
              Object.keys(AXISLINEJOIN).map(value => (
                <Option value={value} key={value}>{AXISLINEJOIN[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name="miterLimit" label="斜接比例">
          <InputNumber />
        </FormItem>
        <Shadow title="" initialValues={initialValues} onChange={onChange} />
      </FormItemGroup>
    </Form>

  )
}

LineStyle.defaultProps = {
  initialValues: {},
  onChange: () => { },
  keyprefix: '',
}

LineStyle.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string,
  type: PropTypes.string,
}

export default LineStyle;