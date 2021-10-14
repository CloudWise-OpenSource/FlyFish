/**
 * @description 矩阵配置 - 
 */

import React from 'react';
import PropTypes from 'prop-types';
import { merge } from 'data-vi/helpers';

import {
  Input,
  FormItemGroup,
  RadioBooleanGroup
} from 'datavi-editor/templates';
import Form, { FormItem } from '../Form';

const Grid = ({
  initialValues,
  onChange,
  title,
  needVisible
}) => {

  return (
    <Form
      onValuesChange={(form, changeValues) => onChange(changeValues)}
      initialValues={merge({}, needVisible ? { show: false } : {}, initialValues)}
    >
      <FormItemGroup title={title}>
        {
          needVisible
          &&
          <FormItem name="show" label="显示">
            <RadioBooleanGroup />
          </FormItem>
        }
        <FormItem name='top' label='上边距'>
          <Input maxLength={25} placeholder='请输入上边距' />
        </FormItem>
        <FormItem name='bottom' label='下边距'>
          <Input maxLength={25} placeholder='请输入下边距' />
        </FormItem>
        <FormItem name='left' label='左边距'>
          <Input maxLength={25} placeholder='请输入左边距' />
        </FormItem>
        <FormItem name='right' label='右边距'>
          <Input maxLength={25} placeholder='请输入右边距' />
        </FormItem>
      </FormItemGroup>
    </Form>

  )
}

Grid.defaultProps = {
  initialValues: {},
  onChange: () => { },
  title: '边距',
  needVisible: false
}

Grid.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  needVisible: PropTypes.bool,
}

export default Grid;