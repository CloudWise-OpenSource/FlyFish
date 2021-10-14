/**
* @description 轴配置
*/

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  FormItemGroup,
  RadioBooleanGroup
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import LineStyle from './LineStyle'

import { AXISLINE } from '../../Chart/theme';


const AxisLine = ({
  initialValues,
  onChange,
  keyprefix,
  type
}) => {
  const values = merge({}, AXISLINE, initialValues);

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={values}>
      <FormItemGroup title="轴线相关配置">
        <FormItem name="show" label="显示">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="onZero" label="0刻度">
          <RadioBooleanGroup />
        </FormItem>
        <LineStyle initialValues={values.lineStyle} onChange={value => onChange({ lineStyle: value })} />
      </FormItemGroup>
    </Form>

  )
}

AxisLine.defaultProps = {
  initialValues: {},
  onChange: () => { },
  keyprefix: '',
  type: 'x'
}

AxisLine.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string,
  type: PropTypes.string,
}

export default AxisLine;