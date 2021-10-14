/**
 * @description 提示框配置
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  Select,
  FormItemGroup,
  RadioBooleanGroup
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import Font from './Font'
import Border from './Border';

import { RECT } from '../../Chart/theme';
import { TOOLTIPTIGGER } from '../../constant/tooltip';

const Option = Select.Option;

const Tooltip = ({
  initialValues,
  onChange,
  title
}) => {
  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={merge({}, RECT, initialValues)}>
      <FormItemGroup title="基本属性">
        <FormItem name="show" label="显示">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="showContent" label="显示浮层">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="alwaysShowContent" label="浮层常驻">
          <RadioBooleanGroup />
        </FormItem>
        <FormItem name="trigger" label="触发类型">
          <Select>
            {
              Object.values(TOOLTIPTIGGER).map(value => (
                <Option value={value} key={value}>{TOOLTIPTIGGER[value]}</Option>
              ))
            }
          </Select>
        </FormItem>
      </FormItemGroup>
      <Border initialValues={initialValues} onChange={onChange} />
      <Font title="字体" initialValues={initialValues.textStyle} onChange={(value) => onChange({ textStyle: value })} />
    </Form>

  )
}

Tooltip.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '提示框'
}

Tooltip.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string
}

export default Tooltip;