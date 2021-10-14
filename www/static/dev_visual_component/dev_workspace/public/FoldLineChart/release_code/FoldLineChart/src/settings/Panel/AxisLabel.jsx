/**
* @description 刻度标签配置
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
import Rect from './Rect';
import Font from './Font';

import { AXISLABEL } from '../../Chart/theme';


const AxisLabel = ({
  initialValues,
  onChange,
  keyprefix,
  type
}) => {
  const values = merge({}, AXISLABEL, initialValues);

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={values}>
      <FormItemGroup title="刻度标签相关配置">
        <FormItem name="show" label="显示">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="inside" label="是否朝内">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="margin" label="距离轴线">
          <InputNumber />
        </FormItem>
        <Rect initialValues={initialValues} onChange={onChange} />
        <Font initialValues={initialValues} onChange={onChange} />
      </FormItemGroup>
    </Form>

  )
}

AxisLabel.defaultProps = {
  initialValues: {},
  onChange: () => { },
  keyprefix: '',
  type: 'x'
}

AxisLabel.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string,
  type: PropTypes.string,
}

export default AxisLabel;