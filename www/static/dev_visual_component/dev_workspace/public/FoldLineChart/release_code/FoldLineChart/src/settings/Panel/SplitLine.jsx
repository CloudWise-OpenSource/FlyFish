/**
* @description 分割线配置
*/

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  FormItemGroup,
  RadioBooleanGroup,
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import LineStyle from './LineStyle'

import { SPLITLINE } from '../../Chart/theme';

const SplitLine = ({
  initialValues,
  onChange,
  keyprefix,
}) => {
  const values = merge({}, SPLITLINE, initialValues);

  return (
    <Form onValuesChange={(form, changeValues) => onChange(changeValues)} initialValues={values}>
      <FormItemGroup title="刻度线相关配置(部分类型不展示)">
        <FormItem name="show" label="显示">
          <RadioBooleanGroup />
        </FormItem>
        <LineStyle initialValues={values.lineStyle} onChange={value => onChange({ lineStyle: value })} />
      </FormItemGroup>
    </Form>

  )
}

SplitLine.defaultProps = {
  initialValues: {},
  onChange: () => { },
  keyprefix: '',
  type: 'x'
}

SplitLine.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  keyprefix: PropTypes.string,
  type: PropTypes.string,
}

export default SplitLine;