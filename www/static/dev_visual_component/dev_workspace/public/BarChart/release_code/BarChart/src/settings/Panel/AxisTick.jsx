/**
* @description 刻度线配置
*/

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  FormItemGroup,
  RadioBooleanGroup,
  InputNumber
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import LineStyle from './LineStyle'

import { AXISTICK } from '../../Chart/theme';


const AxisTick = ({
  initialValues,
  onChange,
  keyprefix,
  type
}) => {
  const values = merge({}, AXISTICK, initialValues);

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={values}>
      <FormItemGroup title="刻度线相关配置">
        <FormItem name="show" label="显示">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="alignWithLabel" label="标签对齐">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="inside" label="是否朝内">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="length" label="长度">
          <InputNumber />
        </FormItem>
        <LineStyle initialValues={values.lineStyle} onChange={value => onChange({ lineStyle: value })} />
      </FormItemGroup>
    </Form>

  )
}

AxisTick.defaultProps = {
  initialValues: {},
  onChange: () => { },
  keyprefix: '',
  type: 'x'
}

AxisTick.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string,
  type: PropTypes.string,
}

export default AxisTick;