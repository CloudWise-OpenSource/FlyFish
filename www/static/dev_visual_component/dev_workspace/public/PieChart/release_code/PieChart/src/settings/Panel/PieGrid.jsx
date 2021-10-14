/**
 * @description Pie矩阵配置
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  Input,
  FormItemGroup,
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';
import { PIEGRID } from '../../Chart/theme';

const PieGrid = ({
  initialValues,
  onChange,
  title,
}) => {
  const { center: [left, top] = [], radius: [innerRadius, outRadius] = [] } = initialValues;
  return (
    <Form
      onValuesChange={(form, changeValues, { top, left, innerRadius, outRadius }) => onChange({ center: [left, top], radius: [innerRadius, outRadius] })}
      initialValues={merge({}, PIEGRID, { top, left, innerRadius, outRadius })}
    >
      <FormItemGroup title={title}>
        <FormItem name='top' label='上边距'>
          <Input maxLength={25} placeholder='请输入上边距' />
        </FormItem>
        <FormItem name='left' label='左边距'>
          <Input maxLength={25} placeholder='请输入左边距' />
        </FormItem>
      </FormItemGroup>
      <FormItemGroup title="半径">
        <FormItem name='innerRadius' label='内半径'>
          <Input maxLength={25} placeholder='请输内半径' />
        </FormItem>
        <FormItem name='outRadius' label='外半径'>
          <Input maxLength={25} placeholder='请输入外半径' />
        </FormItem>
      </FormItemGroup>
    </Form>
  )
}

PieGrid.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '边距',
}

PieGrid.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
}

export default PieGrid;