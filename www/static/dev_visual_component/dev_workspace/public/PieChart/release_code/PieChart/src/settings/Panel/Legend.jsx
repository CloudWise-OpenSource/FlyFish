/**
 * @description 图例配置
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  Input,
  FormItemGroup,
  RadioBooleanGroup,
  Select
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';

import Grid from './Grid';
import Rect from './Rect';
import Font from './Font';

import { LEGEND } from '../../Chart/theme';
import { LEGENDTYPE, LEGENDORIENT } from '../../constant';

const Option = Select.Option;

const Legend = ({
  initialValues,
  onChange,
  title
}) => {
  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={merge({}, LEGEND, initialValues)}>
      <FormItemGroup title="基本属性">
        <FormItem name="show" label="显示">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="type" label="类型">
          <Select>
            {
              Object.keys(LEGENDTYPE).map(value => (
                <Option value={value} key={value}>{LEGENDTYPE[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
        <FormItem name="orient" label="布局">
          <Select>
            {
              Object.keys(LEGENDORIENT).map(value => (
                <Option value={value} key={value}>{LEGENDORIENT[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
      </FormItemGroup>

      <Font title="文字" initialValues={initialValues.textStyle} onChange={(value) => onChange({ textStyle: value })} />
      <Grid initialValues={initialValues} onChange={onChange} />
      <Rect initialValues={initialValues} onChange={onChange} />
    </Form>

  )
}

Legend.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '边距'
}

Legend.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default Legend;